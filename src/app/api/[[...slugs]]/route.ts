import "server-only";
import { Elysia, t } from "elysia";
import { node } from "@elysiajs/node";
import cors from "@elysiajs/cors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const error400 = { message: "Identifier required ⚠️" };
const error404 = { message: "Not found 🤔" };
const error500 = { message: "Waduh, sistemnya lagi error vibes 🫠" };
const methods = ["GET", "POST"];

const app = new Elysia({ prefix: "/api", adapter: node() })
  .use(
    cors({
      origin: (process.env.APP_URL as string) ?? "http://localhost:3000",
      methods,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .all("/auth/*", ({ request }) => auth.handler(request))
  .macro({
    auth: {
      resolve: async ({ status, request: { headers } }) => {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session) return status(401);
        return session;
      },
    },
  })
  .get("/", () => {
    return "hello Next";
  })
  .post("/", ({ body }) => body, {
    body: t.Object({
      name: t.String(),
    }),
  })
  // users
  .group("/users", (it) =>
    it
      .get("/", () => "/users")
      .get("/:identifier", async ({ params: { identifier }, set }) => {
        try {
          const user = await prisma.user.findFirst({
            where: { OR: [{ id: identifier }, { username: identifier }] },
          });

          if (!user) {
            set.status = 404;
            return error404;
          }

          set.status = 200;
          return user;
        } catch (error) {
          set.status = 500;
          return error500;
        }
      })
  );

export const GET = app.handle;
export const POST = app.handle;
export type App = typeof app;
