// src/hooks/useSSE.ts
import { useState, useEffect, DependencyList } from "react";

/**
 * A custom hook to subscribe to a Server-Sent Events (SSE) endpoint.
 *
 * @param endpoint - The API endpoint (relative to NEXT_PUBLIC_API_BASE_URL) to subscribe to.
 * @param dependencies - Optional dependency array to control the subscription.
 * @returns An object containing the latest data and any error encountered.
 */
export function useSSE<T>(
  endpoint: string,
  dependencies: DependencyList = []
): { data: T | null; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;
    const eventSource = new EventSource(url, { withCredentials: false });

    eventSource.onmessage = (event) => {
      try {
        const parsedData: T = JSON.parse(event.data);
        setData(parsedData);
      } catch (e) {
        console.log(e);
        setError(new Error("Failed to parse SSE data."));
      }
    };

    eventSource.onerror = () => {
      setError(new Error("An error occurred while receiving real-time data."));
      // Optionally, close the connection on error:
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, error };
}
