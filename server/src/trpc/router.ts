import { router } from "../../../shared/trpc/router.js";
import { getEventsProcedure } from "./procedures/events.js";

// Create the application router with all procedures
export const appRouter = router({
  // Events
  getEvents: getEventsProcedure,

  // Add more procedures here as they are implemented
  // getEventNames: getEventNamesProcedure,
  // getEventProperties: getEventPropertiesProcedure,
  // etc.
});

// Export type definition of API
export type AppRouter = typeof appRouter;
