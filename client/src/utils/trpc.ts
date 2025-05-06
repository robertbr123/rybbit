import { httpBatchLink } from "@trpc/client";
import { createTRPCProxyClient } from "@trpc/client";
import type { AppRouter } from "../../../shared/trpc/router";
import { BACKEND_URL } from "../lib/const";

// Create a vanilla tRPC client (for direct usage)
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/trpc`,
      // You can pass any HTTP headers you wish here
      headers() {
        return {
          authorization:
            typeof window !== "undefined"
              ? localStorage.getItem("token") || ""
              : "",
        };
      },
    }),
  ],
});

// Example function to demonstrate usage
export async function fetchEvents(siteId: string | number, count: number = 10) {
  try {
    return await trpcClient.getEvents.query({
      siteId,
      count,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
      endDate: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return { data: [] };
  }
}
