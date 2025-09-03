import "server-only";
import { Elysia, t } from "elysia";
import cors from "@elysiajs/cors";
import { auth } from "@/lib/auth";

const methods = ["GET", "POST"];

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: "http://localhost:3000",
      methods,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .all("/auth/*", ({ request }) => auth.handler(request))
  .get("/", () => "hello Next")
  .post("/", ({ body }) => body, {
    body: t.Object({
      name: t.String(),
    }),
  });

export const GET = app.handle;
export const POST = app.handle;
export type App = typeof app;
