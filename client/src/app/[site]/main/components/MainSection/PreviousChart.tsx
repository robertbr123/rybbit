"use client";
import { nivoTheme } from "@/lib/nivo";
import { useStore } from "@/lib/store";
import { ResponsiveLine } from "@nivo/line";
import { Theme } from "@nivo/theming";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { GetOverviewBucketedResponse } from "../../../../../api/analytics/useGetOverviewBucketed";
import { APIResponse } from "../../../../../api/types";
import { Time } from "../../../../../components/DateSelector/types";

const getMin = (time: Time) => {
  if (time.mode === "day") {
    const dayDate = DateTime.fromISO(time.day).startOf("day");
    return dayDate.toJSDate();
  } else if (time.mode === "week") {
    const weekDate = DateTime.fromISO(time.week).startOf("week");
    return weekDate.toJSDate();
  } else if (time.mode === "month") {
    const monthDate = DateTime.fromISO(time.month).startOf("month");
    return monthDate.toJSDate();
  } else if (time.mode === "year") {
    const yearDate = DateTime.fromISO(time.year).startOf("year");
    return yearDate.toJSDate();
  } else if (time.mode === "range") {
    const startDate = DateTime.fromISO(time.startDate).startOf("day");
    const endDate = DateTime.fromISO(time.endDate).startOf("day");
    return startDate.toJSDate();
  }
  return undefined;
};

export function PreviousChart({
  data,
  max,
}: {
  data: APIResponse<GetOverviewBucketedResponse> | undefined;
  max: number;
}) {
  const { previousTime: time, selectedStat } = useStore();

  const formattedData = data?.data?.map((e) => ({
    x: DateTime.fromSQL(e.time).toUTC().toFormat("yyyy-MM-dd HH:mm:ss"),
    y: e[selectedStat],
  }));

  const min = useMemo(() => getMin(time), [data]);

  return (
    <ResponsiveLine
      data={[
        {
          id: "1",
          data: formattedData ?? [],
        },
      ]}
      theme={nivoTheme as Theme}
      margin={{ top: 10, right: 10, bottom: 25, left: 35 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d %H:%M:%S",
        precision: "second",
        useUTC: true,
        min,
      }}
      yScale={{
        type: "linear",
        min: 0,
        stacked: false,
        reverse: false,
        max: Math.max(max, 1),
      }}
      enableGridX={false}
      enableGridY={false}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        truncateTickAt: 0,
        tickValues: 0,
        format: (value) => {
          if (time.mode === "day") {
            return DateTime.fromJSDate(value).toFormat("ha");
          } else if (time.mode === "range") {
            return DateTime.fromJSDate(value).toFormat("MMM d");
          } else if (time.mode === "week") {
            return DateTime.fromJSDate(value).toFormat("MMM d");
          } else if (time.mode === "month") {
            return DateTime.fromJSDate(value).toFormat("MMM d");
          }
        },
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        truncateTickAt: 0,
        tickValues: 0,
      }}
      enableTouchCrosshair={true}
      enablePoints={false}
      useMesh={true}
      animate={false}
      // motionConfig="stiff"
      enableSlices={"x"}
      colors={["hsl(var(--neutral-700))"]}
    />
  );
}
