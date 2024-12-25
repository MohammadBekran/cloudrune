import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  return c.json({ hello: "world" });
});

export default app;
