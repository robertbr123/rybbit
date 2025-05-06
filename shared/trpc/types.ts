import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./router";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

// Re-export common types used in both frontend and backend
export type Event = {
  timestamp: string;
  event_name: string;
  properties: string;
  user_id: string;
  hostname: string;
  pathname: string;
  querystring: string;
  page_title: string;
  referrer: string;
  browser: string;
  operating_system: string;
  country: string;
  device_type: string;
  type: string;
};

export type EventName = {
  eventName: string;
  count: number;
};

export type EventProperty = {
  propertyKey: string;
  propertyValue: string;
  count: number;
};

export type FunnelStep = {
  value: string;
  name?: string;
  type: "page" | "event";
  eventPropertyKey?: string;
  eventPropertyValue?: string | number | boolean;
};

export type Goal = {
  goalId: number;
  name: string | null;
  goalType: "path" | "event";
  config: {
    pathPattern?: string;
    eventName?: string;
    eventPropertyKey?: string;
    eventPropertyValue?: string | number | boolean;
  };
  createdAt: string;
  total_conversions: number;
  total_sessions: number;
  conversion_rate: number;
};

export type Filter = {
  parameter: string;
  value: string;
  operator: string;
};

export type Time = {
  type: string;
  from?: string;
  to?: string;
  value?: string;
};

export type TimeBucket = "minute" | "hour" | "day" | "week" | "month";
