import { ID, Query } from "node-appwrite";

import {
  APPWRITE_DATABASE_ID,
  APPWRITE_USERS_COLLECTION_ID,
} from "@/core/configs";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { handleError } from "@/lib/utils";

export const getCurrent = async () => {
  try {
    const { account } = await createSessionClient();

    return await account.get();
  } catch {
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const userAccount = await account.get();

    const users = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      [Query.equal("accountId", userAccount.$id)]
    );

    const userToReturn = users.total > 0 ? users.documents[0] : null;

    return userToReturn;
  } catch {
    return null;
  }
};

export const getUserByEmail = async ({ email }: { email: string }) => {
  try {
    const { databases } = await createAdminClient();

    const users = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      [Query.equal("email", email)]
    );

    return users.total > 0 ? users.documents[0] : null;
  } catch (error) {
    handleError({ message: "Failed to find user", error });
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError({ message: "Failed to send an OTP", error });
  }
};
