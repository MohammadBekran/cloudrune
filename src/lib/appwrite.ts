import "server-only";

import { Account, Client, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

import { AUTH_COOKIE } from "@/features/auth/core/constants";

const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const session = (await cookies()).get(AUTH_COOKIE);

  if (!session || !session.value) throw new Error("Unauthorized");

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get databases() {
      return new Databases(client);
    },
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
  };
};

export { createAdminClient, createSessionClient };
