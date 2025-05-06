"use client";

import { useState, useEffect } from "react";
import { trpcClient } from "../../utils/trpc";
import { useStore } from "../../lib/store";

export default function TRPCExample() {
  const { site } = useStore();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!site) return;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await trpcClient.getEvents.query({
          siteId: site,
          count: 5,
          startDate: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // Last 7 days
          endDate: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        setEvents(result.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [site]);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;
  if (events.length === 0) return <div>No events found</div>;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Recent Events (via tRPC)</h2>
      <ul className="space-y-2">
        {events.map((event, index) => (
          <li key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="font-medium">{event.event_name}</div>
            <div className="text-sm text-gray-500">
              {new Date(event.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
