import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/core/configs";
import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import {
  Account,
  Client,
  Databases,
  Storage,
  Avatars,
  type Account as TAccount,
  type Databases as TDatabases,
  type Storage as TStorage,
  type Users as TUsers,
  type Avatars as TAvatars,
  Models,
} from "node-appwrite";

import { AUTH_COOKIE } from "@/features/auth/core/constants";
import { hc } from "hono/client";
import { TApp } from "@/app/api/[[...route]]/route";

export const client = hc<TApp>(process.env.NEXT_PUBLIC_APP_URL!);

type TAdditionalContext = {
  Variables: {
    account: TAccount;
    databases: TDatabases;
    storage: TStorage;
    users: TUsers;
    avatars: TAvatars;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<TAdditionalContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);

    const session = getCookie(c, AUTH_COOKIE);

    if (!session) return c.json({ error: "UnAuthorized" }, 401);

    client.setSession(session);

    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    const avatars = new Avatars(client);

    const user = await account.get();

    c.set("account", account);
    c.set("databases", databases);
    c.set("storage", storage);
    c.set("user", user);
    c.set("avatars", avatars);

    await next();
  }
);
