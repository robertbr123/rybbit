import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { FastifyInstance } from "fastify";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";

export async function registerTRPC(app: FastifyInstance) {
  await app.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  });
}
