import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { z } from "zod";

import {
  APPWRITE_BUCKET_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_FILES_COLLECTION_ID,
} from "@/core/configs";
import { sessionMiddleware } from "@/lib/hono";
import { constructFileUrl, getFileType } from "@/lib/utils";

const app = new Hono().post(
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
        owner: [ownerId],
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
        .catch(async (error) => {
          console.log(error);
          await storage.deleteFile(APPWRITE_BUCKET_ID, bucketFile.$id);

          return { name: "" };
        });

      console.log({ newFile });
      revalidatePath(path);
      return c.json({ data: newFile });
    } catch (err) {
      return c.json({ error: "Failed to upload the file", error2: err }, 400);
    }
  }
);

export default app;
