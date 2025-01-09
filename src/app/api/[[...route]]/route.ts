import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/core/server/route";
import files from "@/features/files/core/server/route";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/auth", auth).route("/files", files);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type TApp = typeof routes;
