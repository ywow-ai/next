import { Elysia, t } from "elysia";
import { node } from "@elysiajs/node";
import cors from "@elysiajs/cors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// const error400 = { message: "Identifier required ⚠️" };
// const error404 = { message: "Not found 🤔" };
// const error500 = { message: "Waduh, sistemnya lagi error vibes 🫠" };
const methods = ["GET", "POST", "DELETE", "PATCH"];

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
  .group("/user", (it) =>
    it.get(
      "/:userIdentifier",
      async ({ params: { userIdentifier }, status }) => {
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [{ id: userIdentifier }, { username: userIdentifier }],
            },
          });

          if (!user) return status(404);

          return user;
        } catch (error) {
          console.log(error);
          return status(500);
        }
      },
      { params: t.Object({ userIdentifier: t.String() }) }
    )
  )
  .group("/ticket", (it) =>
    it
      .get(
        "/event/:eventId",
        async ({ params: { eventId }, status }) => {
          try {
            return await prisma.ticket.findMany({
              where: { eventId, deletedAt: null },
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ eventId: t.String() }),
        }
      )
      .get(
        "/:ticketId",
        async ({ params: { ticketId }, status }) => {
          try {
            const ticket = await prisma.ticket.findFirst({
              where: { id: ticketId, deletedAt: null },
            });
            if (!ticket) return status(404);
            return ticket;
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ ticketId: t.String() }),
        }
      )

      .guard({ auth: true })
      .post(
        "/",
        async ({ body, status }) => {
          try {
            return await prisma.ticket.create({
              data: body,
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          body: t.Object({
            eventId: t.String(),
            name: t.String(),
            price: t.Number(),
            description: t.Optional(t.String()),
            stock: t.Optional(t.Number()),
            maxPerUser: t.Optional(t.Number()),
            saleStart: t.Optional(t.Date()),
            saleEnd: t.Optional(t.Date()),
            isPublished: t.Optional(t.Boolean()),
          }),
        }
      )
      .patch(
        "/:ticketId",
        async ({ body, params: { ticketId }, status }) => {
          try {
            return await prisma.ticket.update({
              where: { id: ticketId },
              data: body,
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ ticketId: t.String() }),
          body: t.Object({
            name: t.String(),
            price: t.Number(),
            description: t.Optional(t.String()),
            stock: t.Optional(t.Number()),
            maxPerUser: t.Optional(t.Number()),
            saleStart: t.Optional(t.Date()),
            saleEnd: t.Optional(t.Date()),
            isPublished: t.Optional(t.Boolean()),
          }),
        }
      )
      .delete(
        "/:ticketId",
        async ({ params: { ticketId }, status }) => {
          try {
            return await prisma.ticket.update({
              where: { id: ticketId },
              data: { deletedAt: new Date() },
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ ticketId: t.String() }),
        }
      )
  )
  .group("/event", (it) =>
    it
      .get("/upcoming", async ({ status }) => {
        try {
          return await prisma.event.findMany({
            where: {
              OR: [
                { startTime: { gte: new Date() } },
                { endTime: { gte: new Date() } },
              ],
              deletedAt: null,
            },
            orderBy: { startTime: "asc" },
          });
        } catch (error) {
          console.log(error);
          return status(500);
        }
      })
      .get("/today", async ({ status }) => {
        try {
          const now = new Date(),
            startOfDay = new Date(now),
            endOfDay = new Date(now);

          startOfDay.setHours(0, 0, 0, 0);
          endOfDay.setHours(23, 59, 59, 999);

          return await prisma.event.findMany({
            where: {
              startTime: { lte: endOfDay },
              endTime: { gte: startOfDay },
              deletedAt: null,
            },
            orderBy: { startTime: "asc" },
          });
        } catch (error) {
          console.log(error);
          return status(500);
        }
      })
      .get(
        "/q/:userIdentifier/:eventSlug",
        async ({ params: { userIdentifier, eventSlug }, status }) => {
          try {
            const event = await prisma.event.findFirst({
              where: {
                createdById: userIdentifier,
                slug: eventSlug,
                deletedAt: null,
              },
            });
            if (!event) return status(404);
            return event;
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({
            userIdentifier: t.String(),
            eventSlug: t.String(),
          }),
        }
      )

      .guard({ auth: true })
      .get("/own", async ({ user, status }) => {
        try {
          if (!user.isVerified) return status(403);
          return await prisma.event.findMany({
            where: {
              OR: [
                { createdById: user.id },
                { collaborators: { some: { userId: user.id } } },
              ],
              deletedAt: null,
            },
            orderBy: { startTime: "asc" },
          });
        } catch (error) {
          console.log(error);
          return status(500);
        }
      })
      .post(
        "/",
        async ({ body, user, status }) => {
          try {
            if (!user.isVerified) return status(403);
            return await prisma.event.create({
              data: { ...body, createdById: user.id },
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          body: t.Object({
            title: t.String(),
            slug: t.String(),
            startTime: t.Date(),
            endTime: t.Date(),
            isFree: t.Boolean(),
            description: t.Optional(t.String()),
            important: t.Optional(t.Array(t.String())),
            terms: t.Optional(t.Record(t.String(), t.Array(t.String()))),
            additional: t.Optional(t.Array(t.String())),
            coverImage: t.Optional(t.String()),
            images: t.Optional(t.Array(t.String())),
            location: t.Optional(t.String()),
            lat: t.Optional(t.Number()),
            lng: t.Optional(t.Number()),
          }),
        }
      )
      .patch(
        "/:eventId",
        async ({ body, params: { eventId }, user, status }) => {
          try {
            if (!user.isVerified) return status(403);
            const event = await prisma.event.findFirst({
              where: { id: eventId, createdById: user.id, deletedAt: null },
            });
            if (!event) return status(404);
            return await prisma.event.update({
              where: { id: eventId, createdById: user.id },
              data: body,
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ eventId: t.String() }),
          body: t.Object({
            title: t.String(),
            slug: t.String(),
            startTime: t.Date(),
            endTime: t.Date(),
            isFree: t.Boolean(),
            description: t.Optional(t.String()),
            important: t.Optional(t.Array(t.String())),
            terms: t.Optional(t.Record(t.String(), t.Array(t.String()))),
            additional: t.Optional(t.Array(t.String())),
            coverImage: t.Optional(t.String()),
            images: t.Optional(t.Array(t.String())),
            location: t.Optional(t.String()),
            lat: t.Optional(t.Number()),
            lng: t.Optional(t.Number()),
          }),
        }
      )
      .delete(
        "/:eventId",
        async ({ params: { eventId }, user, status }) => {
          try {
            if (!user.isVerified) return status(403);
            const event = await prisma.event.findFirst({
              where: { id: eventId, createdById: user.id, deletedAt: null },
            });
            if (!event) return status(404);
            return await prisma.event.update({
              where: { id: eventId, createdById: user.id },
              data: { deletedAt: new Date() },
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ eventId: t.String() }),
        }
      )
      .get(
        "/:eventId/collaborator",
        async ({ params: { eventId }, user, status }) => {
          try {
            const event = await prisma.event.findFirst({
              where: {
                id: eventId,
                deletedAt: null,
                OR: [
                  {
                    collaborators: { some: { userId: user.id } },
                  },
                  { createdById: user.id },
                ],
              },
            });
            if (!event) return status(404);
            return await prisma.eventCollaborator.findMany({
              where: { eventId },
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ eventId: t.String() }),
        }
      )
      .patch(
        "/:eventId/collaborator",
        async ({ body, params: { eventId }, user, status }) => {
          try {
            if (!user.isVerified) return status(403);
            const event = await prisma.event.findFirst({
              where: { id: eventId, createdById: user.id, deletedAt: null },
            });
            if (!event) return status(404);

            await prisma.eventCollaborator.createMany({
              data: body.userIds.map((uuid) => ({ eventId, userId: uuid })),
              skipDuplicates: true,
            });

            return await prisma.eventCollaborator.findMany({
              where: { eventId },
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ eventId: t.String() }),
          body: t.Object({ userIds: t.Array(t.String()) }),
        }
      )
  )
  .group("/cart", (it) =>
    it
      .guard({ auth: true })
      .get("/", async ({ user, status }) => {
        try {
          return await prisma.cartItem.findMany({
            where: { userId: user.id, quantity: { gt: 0 } },
          });
        } catch (error) {
          console.log(error);
          return status(500);
        }
      })
      .patch(
        "/",
        async ({ body: { ticketId, ticketQuantity }, user, status }) => {
          try {
            await prisma.cartItem.upsert({
              where: { userId_ticketId: { userId: user.id, ticketId } },
              update: { quantity: ticketQuantity },
              create: {
                userId: user.id,
                ticketId,
                quantity: ticketQuantity,
              },
            });
            return status(200);
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        { body: t.Object({ ticketId: t.String(), ticketQuantity: t.Number() }) }
      )
      .delete(
        "/:ticketId",
        async ({ params: { ticketId }, user, status }) => {
          try {
            await prisma.cartItem.delete({
              where: { userId_ticketId: { ticketId, userId: user.id } },
            });
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ ticketId: t.String() }),
        }
      )
  )
  .group("/transaction", (it) =>
    it
      .get(
        "/public/:transactionId",
        async ({ params: { transactionId }, status }) => {
          try {
            const transaction = await prisma.transaction.findUnique({
              where: { id: transactionId, userId: null },
            });
            if (!transaction) return status(404);
            return transaction;
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          params: t.Object({ transactionId: t.String() }),
        }
      )
      .post(
        "/public",
        async ({ body: { ticketId, ticketQuantity, ...data }, status }) => {
          try {
            const transaction = await prisma.$transaction(async (tx) => {
              // nanti, buat transaksi xendit

              const ticket = await tx.ticket.findUnique({
                where: { id: ticketId },
              });
              if (!ticket) throw new Error("Ticket not found");

              const transaction = await tx.transaction.create({
                data,
              });

              await tx.transactionItem.create({
                data: {
                  ticketId,
                  quantity: ticketQuantity,
                  snapshotTicketName: ticket.name,
                  snapshotTicketPrice: ticket.price,
                  transactionId: transaction.id,
                },
              });

              return await tx.transaction.findUnique({
                where: { id: transaction.id },
                include: { transactionItem: true },
              });
            });

            if (!transaction) throw new Error("Transaction failed");

            return transaction;
          } catch (error) {
            console.log(error);
            return status(500);
          }
        },
        {
          body: t.Object({
            ticketId: t.String(),
            ticketQuantity: t.Number({ minimum: 1 }),
            email: t.String({ format: "email" }),
            phone: t.Optional(t.String()),
          }),
        }
      )

      .guard({ auth: true })
      .get("/own", async () => {})
      .get("/:transactionId", async () => {}, {
        params: t.Object({ transactionId: t.String() }),
      })
      .post("/", async () => {})
  )
  .group("/webhook/xendit", (it) => it);

export const GET = app.handle;
export const POST = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
export type App = typeof app;
