import { publicProcedure } from "../../../../shared/trpc/router.js";
import { z } from "zod";
import { getEvents } from "../../api/analytics/getEvents.js";

// Export the getEvents procedure implementation
export const getEventsProcedure = publicProcedure
  .input(
    z.object({
      siteId: z.union([z.string(), z.number()]),
      count: z.number().optional(),
      page: z.number().optional(),
      pageSize: z.number().optional(),
      filters: z
        .array(
          z.object({
            parameter: z.string(),
            value: z.string(),
            operator: z.string(),
          })
        )
        .optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      timezone: z.string().default("UTC"),
      pastMinutes: z.number().optional(),
    })
  )
  .query(async ({ input, ctx }: { input: any; ctx: any }) => {
    // Create a mock request and response object for the existing handler
    const req = {
      params: {
        site: input.siteId.toString(),
      },
      query: {
        count: input.count?.toString(),
        page: input.page?.toString(),
        pageSize: input.pageSize?.toString(),
        startDate: input.startDate,
        endDate: input.endDate,
        timezone: input.timezone,
        pastMinutes: input.pastMinutes?.toString(),
        filters: input.filters ? JSON.stringify(input.filters) : undefined,
      },
      user: ctx.user,
    };

    const res = {
      send: (data: any) => data,
      status: (code: number) => ({
        send: (data: any) => data,
      }),
    };

    // Call the existing handler
    return await getEvents(req as any, res as any);
  });
