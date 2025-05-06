import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { FastifyRequest, FastifyReply } from "fastify";

// Create context for tRPC requests
export async function createContext({ req, res }: CreateFastifyContextOptions) {
  // Get user from request if authenticated
  const user = req.user || null;

  return {
    req,
    res,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
