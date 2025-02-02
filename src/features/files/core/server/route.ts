import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { z } from "zod";

import { getCurrentUser } from "@/features/auth/core/queries";
import type { TFileType } from "@/features/fileType/core/types";

import {
  APPWRITE_BUCKET_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_FILES_COLLECTION_ID,
} from "@/core/configs";
import { sessionMiddleware } from "@/lib/hono";
import { constructFileUrl, getFileType } from "@/lib/utils";

const app = new Hono()
  .get("/summary", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");

      const currentUser = await getCurrentUser();
      if (!currentUser) return c.json({ error: "Unauthorized" }, 400);

      const files = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_FILES_COLLECTION_ID,
        [Query.equal("owner", [currentUser.$id])]
      );

      const totalSpace = {
        image: { size: 0, latestDate: "" },
        document: { size: 0, latestDate: "" },
        video: { size: 0, latestDate: "" },
        audio: { size: 0, latestDate: "" },
        other: { size: 0, latestDate: "" },
        used: 0,
        all: 2 * 1024 * 1024, // 2GB
      };

      for (const file of files.documents) {
        const fileType = file.type as TFileType;
        const latestDate = totalSpace[fileType].latestDate;

        totalSpace[fileType].size += file.size;
        totalSpace.used += file.size;

        if (!latestDate || new Date(file.$updatedAt) > new Date(latestDate)) {
          totalSpace[fileType].latestDate = file.$updatedAt;
        }
      }

      return c.json({ data: totalSpace });
    } catch {
      return c.json({ error: "Failed to get the summary" }, 400);
    }
  })
  .post(
    "/get-files",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        types: z.array(z.string()).optional(),
        searchText: z.string().optional(),
        sort: z.string().optional(),
        limit: z.number().optional(),
      })
    ),
    async (c) => {
      try {
        const databases = c.get("databases");

        const {
          types = [],
          searchText = "",
          sort = "$createdAt-desc",
          limit,
        } = c.req.valid("json");
        const currentUser = await getCurrentUser();

        if (!currentUser) return c.json({ error: "Unauthorized" }, 400);

        const queries = [
          Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email]),
          ]),
        ];

        if (types.length > 0) queries.push(Query.equal("type", types));
        if (searchText) queries.push(Query.contains("name", searchText));
        if (limit) queries.push(Query.limit(limit));

        if (sort) {
          const [sortBy, orderBy] = sort.split("-");

          queries.push(
            orderBy === "desc"
              ? Query.orderDesc(sortBy)
              : Query.orderAsc(sortBy)
          );
        }

        const files = await databases.listDocuments(
          APPWRITE_DATABASE_ID,
          APPWRITE_FILES_COLLECTION_ID,
          queries
        );

        return c.json({ data: files });
      } catch {
        return c.json({ error: "Failed to get the files" }, 400);
      }
    }
  )
  .post(
    "/upload-file",
    sessionMiddleware,
    zValidator(
      "form",
      z.object({
        file: z.instanceof(File),
        ownerId: z.string(),
        accountId: z.string(),
        path: z.string(),
      })
    ),
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const { file, ownerId, accountId, path } = c.req.valid("form");

        const inputFile = InputFile.fromBuffer(file, file.name);

        const bucketFile = await storage.createFile(
          APPWRITE_BUCKET_ID,
          ID.unique(),
          inputFile
        );

        const fileData = {
          type: getFileType({ fileName: bucketFile.name }).type,
          name: bucketFile.name,
          url: constructFileUrl({ fileId: bucketFile.$id }),
          extension: getFileType({ fileName: bucketFile.name }).extension,
          size: bucketFile.sizeOriginal,
          owner: ownerId,
          accountId,
          users: [],
          bucketFileId: bucketFile.$id,
        };

        const newFile = await databases
          .createDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_FILES_COLLECTION_ID,
            ID.unique(),
            fileData
          )
          .catch(async () => {
            await storage.deleteFile(APPWRITE_BUCKET_ID, bucketFile.$id);

            return { name: "" };
          });

        revalidatePath(path);
        return c.json({ data: newFile });
      } catch (err) {
        return c.json({ error: "Failed to upload the file", error2: err }, 400);
      }
    }
  )
  .patch(
    "/rename-file",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        fileId: z.string(),
        name: z.string(),
      })
    ),
    async (c) => {
      try {
        const databases = c.get("databases");
        const { fileId, name } = c.req.valid("json");

        const updatedFile = await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_FILES_COLLECTION_ID,
          fileId,
          {
            name,
          }
        );

        if (!updatedFile) return c.json({ error: "File not found" }, 404);

        return c.json({ data: updatedFile });
      } catch {
        return c.json({ error: "Failed to rename the file" }, 400);
      }
    }
  )
  .delete(
    "/delete-file",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        fileId: z.string(),
        bucketFileId: z.string(),
      })
    ),
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const { fileId, bucketFileId } = c.req.valid("json");

        const deletedFile = await databases.deleteDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_FILES_COLLECTION_ID,
          fileId
        );

        if (deletedFile) {
          await storage.deleteFile(APPWRITE_BUCKET_ID, bucketFileId);
        }

        return c.json({ success: true });
      } catch {
        return c.json({ error: "Failed to delete the file" }, 400);
      }
    }
  )
  .post(
    "/update-file-users",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        fileId: z.string(),
        emails: z.array(z.string()),
      })
    ),
    async (c) => {
      try {
        const databases = c.get("databases");
        const { fileId, emails } = c.req.valid("json");

        const file = await databases.getDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_FILES_COLLECTION_ID,
          fileId
        );

        if (!file) return c.json({ error: "File not found" }, 404);

        const updatedFile = await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_FILES_COLLECTION_ID,
          fileId,
          {
            users: emails.length === 0 ? [] : [...file.users, ...emails],
          }
        );

        if (!updatedFile) return c.json({ error: "File not found" }, 404);

        return c.json({ data: updatedFile });
      } catch {
        return c.json({ error: "Failed to add users" }, 400);
      }
    }
  );

export default app;
