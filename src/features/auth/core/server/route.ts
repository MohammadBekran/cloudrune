import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import { getUserByEmail, sendEmailOTP } from "@/features/auth/core/queries";
import { AUTH_COOKIE } from "@/features/auth/core/constants";

import {
  APPWRITE_DATABASE_ID,
  APPWRITE_USERS_COLLECTION_ID,
} from "@/core/configs";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/hono";
import { parseStringify } from "@/lib/utils";

const app = new Hono()
  .get("/get-current-user", sessionMiddleware, async (c) => {
    try {
      const account = c.get("account");
      const databases = c.get("databases");

      const userAccount = await account.get();

      const users = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        [Query.equal("accountId", userAccount.$id)]
      );

      const userToReturn =
        users.total > 0 ? { user: users.documents[0] } : { user: null };

      return parseStringify(userToReturn);
    } catch {
      return c.json({ error: "Failed to find user" }, 400);
    }
  })
  .post(
    "/send-email-otp",
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
      })
    ),
    async (c) => {
      try {
        const { account } = await createSessionClient();
        const { email } = c.req.valid("json");

        const session = await account.createEmailToken(ID.unique(), email);

        return c.json({ accountId: session.userId });
      } catch (error) {
        return c.json({ error: "Failed to send an OTP", error2: error }, 400);
      }
    }
  )
  .post(
    "/verify-email-otp",
    zValidator(
      "json",
      z.object({
        accountId: z.string().min(1),
        password: z.string().min(1),
      })
    ),
    async (c) => {
      try {
        const { accountId, password } = c.req.valid("json");
        const { account } = await createAdminClient();

        const session = await account.createSession(accountId, password);

        (await cookies()).set(AUTH_COOKIE, session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: true,
          secure: true,
        });

        return c.json({ sessionId: session.$id });
      } catch (error) {
        return c.json({ error: "Failed to verify OTP", error2: error }, 400);
      }
    }
  )
  .post(
    "/create-account",
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
        fullName: z.string().min(1),
      })
    ),
    async (c) => {
      try {
        const { databases } = await createAdminClient();
        const { email, fullName } = c.req.valid("json");

        const existingUser = await getUserByEmail({ email });

        const accountId = await sendEmailOTP({ email });
        if (!accountId) throw new Error("Failed to send an OTP");

        if (!existingUser?.documents || existingUser?.documents.length === 0) {
          await databases.createDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_USERS_COLLECTION_ID,
            ID.unique(),
            {
              accountId,
              email,
              fullName,
              avatar: "/images/avatar.png",
            }
          );

          return c.json({ accountId });
        }

        return c.json({ error: "User already exists" }, 400);
      } catch {
        return c.json({ error: "Failed to create account" }, 400);
      }
    }
  )
  .post(
    "/sign-in",
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
      })
    ),
    async (c) => {
      try {
        const { email } = c.req.valid("json");
        const user = await getUserByEmail({ email });

        if (user) {
          await sendEmailOTP({ email });

          return c.json({ accountId: user.accountId });
        }

        return c.json({ error: "User not found" }, 400);
      } catch {
        return c.json({ error: "Failed to sign in" }, 400);
      }
    }
  )
  .post("/sign-out", async (c) => {
    try {
      const { account } = await createSessionClient();

      await account.deleteSession("current");
      (await cookies()).delete(AUTH_COOKIE);

      return c.json({ success: true });
    } catch {
      return c.json({ error: "Failed to log out" }, 400);
    }
  });

export default app;
