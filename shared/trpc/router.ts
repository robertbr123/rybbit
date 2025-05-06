import { initTRPC } from "@trpc/server";
import { z } from "zod";
import type {
  Event,
  EventName,
  EventProperty,
  FunnelStep,
  Goal,
  Filter,
} from "./types";

// This is a placeholder for the actual context type
// You'll need to define this based on your authentication needs
export type Context = {
  user?: {
    id: string;
    email: string;
  };
};

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Define input schemas for procedures
const timeParamsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  timezone: z.string().default("UTC"),
  pastMinutes: z.number().optional(),
});

const filterSchema = z
  .array(
    z.object({
      parameter: z.string(),
      value: z.string(),
      operator: z.string(),
    })
  )
  .optional();

// Define the router with procedures
export const appRouter = router({
  // Events - This will be implemented in the server
  getEvents: publicProcedure
    .input(
      z.object({
        siteId: z.union([z.string(), z.number()]),
        count: z.number().optional(),
        page: z.number().optional(),
        pageSize: z.number().optional(),
        filters: filterSchema,
        ...timeParamsSchema.shape,
      })
    )
    .query(async ({ input }) => {
      // This is just a placeholder - the actual implementation will be in the server
      return { data: [] as Event[] };
    }),

  getEventNames: publicProcedure
    .input(
      z.object({
        siteId: z.union([z.string(), z.number()]),
        filters: filterSchema,
        ...timeParamsSchema.shape,
      })
    )
    .query(async ({ input }) => {
      // This will be implemented in the server
      return { data: [] as EventName[] };
    }),

  getEventProperties: publicProcedure
    .input(
      z.object({
        siteId: z.union([z.string(), z.number()]),
        eventName: z.string(),
        filters: filterSchema,
        ...timeParamsSchema.shape,
      })
    )
    .query(async ({ input }) => {
      // This will be implemented in the server
      return { data: [] as EventProperty[] };
    }),

  // Goals
  getGoals: publicProcedure
    .input(
      z.object({
        siteId: z.union([z.string(), z.number()]),
        page: z.number().optional(),
        pageSize: z.number().optional(),
        sort: z.string().optional(),
        order: z.enum(["asc", "desc"]).optional(),
        filters: filterSchema,
        ...timeParamsSchema.shape,
      })
    )
    .query(async ({ input }) => {
      // This will be implemented in the server
      return {
        data: [] as Goal[],
        meta: {
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
        },
      };
    }),

  createGoal: publicProcedure
    .input(
      z.object({
        siteId: z.number(),
        name: z.string().optional(),
        goalType: z.enum(["path", "event"]),
        config: z.object({
          pathPattern: z.string().optional(),
          eventName: z.string().optional(),
          eventPropertyKey: z.string().optional(),
          eventPropertyValue: z
            .union([z.string(), z.number(), z.boolean()])
            .optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      // This will be implemented in the server
      return { success: true, goalId: 1 };
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;
