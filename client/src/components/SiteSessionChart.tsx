import { nivoTheme } from "@/lib/nivo";
import { ResponsiveLine } from "@nivo/line";
import { Theme } from "@nivo/theming";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { GetOverviewBucketedResponse } from "../api/analytics/useGetOverviewBucketed";
import { formatter } from "../lib/utils";

interface SiteSessionChartProps {
  data: GetOverviewBucketedResponse;
  height?: number | string;
}

export function SiteSessionChart({
  data,
  height = 100,
}: SiteSessionChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [{ id: "sessions", data: [] }];
    }

    return [
      {
        id: "sessions",
        data: data.map((point) => {
          return {
            x: DateTime.fromSQL(point.time)
              .toUTC()
              .toFormat("yyyy-MM-dd HH:mm:ss"),
            y: point.sessions,
            currentTime: DateTime.fromSQL(point.time),
          };
        }),
      },
    ];
  }, [data]);

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 10, right: 10, bottom: 20, left: 25 }}
        xScale={{
          type: "time",
          format: "%Y-%m-%d %H:%M:%S",
          precision: "second",
          useUTC: true,
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
        }}
        curve="linear"
        enableSlices={"x"}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: 3,
          format: (value) => {
            return DateTime.fromJSDate(value).toFormat("ha");
          },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: 2,
          format: formatter,
        }}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        enableArea={true}
        areaOpacity={0.3}
        colors={["hsl(var(--accent-400))"]}
        theme={nivoTheme as Theme}
        defs={[
          {
            id: "gradientA",
            type: "linearGradient",
            colors: [
              { offset: 0, color: "hsl(var(--accent-400))", opacity: 1 },
              { offset: 100, color: "hsl(var(--accent-400))", opacity: 0 },
            ],
          },
        ]}
        fill={[{ match: "*", id: "gradientA" }]}
        sliceTooltip={({ slice }: any) => {
          const currentY = Number(slice.points[0].data.yFormatted);
          const currentTime = slice.points[0].data.currentTime as DateTime;

          return (
            <div className="bg-neutral-800 border-neutral-700 border p-2 rounded-md">
              <div className="text-xs mb-1">Sessions</div>
              <div className="flex justify-between text-xs w-20">
                <div className="text-muted-foreground">
                  {currentTime.toFormat("ha")}
                </div>
                <div className="font-medium">{currentY.toLocaleString()}</div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
