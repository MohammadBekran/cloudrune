"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";

import { AUTH_COOKIE } from "@/features/auth/core/constants";

import {
  APPWRITE_DATABASE_ID,
  APPWRITE_USERS_COLLECTION_ID,
} from "@/core/configs";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";

export const handleError = async ({
  error,
  message,
}: {
  error: unknown;
  message: string;
}) => {
  console.error(message);

  throw error;
};

export const getUserByEmail = async ({ email }: { email: string }) => {
  try {
    const { databases } = await createAdminClient();

    const users = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USERS_COLLECTION_ID!,
      [Query.equal("email", [email])]
    );

    return users.total > 0 ? users.documents[0] : null;
  } catch (error) {
    handleError({ message: "Failed to get the user", error });
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError({ message: "Failed to send email OTP", error });
  }
};

export const createAccount = async ({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    const user = await getUserByEmail({ email });

    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send email OTP");

    if (!user && Object.keys(user ?? {}).length === 0) {
      await databases.createDocument(
        APPWRITE_DATABASE_ID!,
        APPWRITE_USERS_COLLECTION_ID,
        ID.unique(),
        {
          accountId,
          email,
          fullName,
          avatar: "/images/avatar.png",
        }
      );

      return parseStringify({ accountId });
    }

    return parseStringify({ error: "User already exists" });
  } catch (error) {
    handleError({ message: "Failed to create an account", error });
  }
};

export const verifyOTP = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set(AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: true,
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError({ message: "Failed to verify OTP", error });
  }
};

export const signIn = async ({ email }: { email: string }) => {
  try {
    const user = await getUserByEmail({ email });

    if (user) {
      await sendEmailOTP({ email });

      return parseStringify({ accountId: user.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError({ message: "Failed to sign in", error });
  }
};

export const signOut = async () => {
  try {
    const { account } = await createAdminClient();

    await account.deleteSession("current");
    (await cookies()).delete(AUTH_COOKIE);
  } catch (error) {
    handleError({ message: "Failed to sign out", error });
  } finally {
    redirect("/sign-in");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const userAccount = await account.get();

    const users = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      [Query.equal("accountId", userAccount.$id)]
    );

    if (users.total > 0) return parseStringify({ user: users.documents[0] });

    return parseStringify({});
  } catch (error) {
    handleError({ message: "Failed to get the current user", error });
  }
};
