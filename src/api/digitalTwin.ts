import { fetchWithAuth, handleResponse } from "@/api/apiHelper";
import { VirtualAssetDTO } from "@/types/digitalTwin";

/**
 * Retrieves the current state of the digital twin for the given assetId.
 * Uses a relative URL so that Next.js rewrites proxy the request.
 */
export async function getDigitalTwinState(
  assetId: number
): Promise<VirtualAssetDTO> {
  try {
    const response = await fetchWithAuth(`/api/digital-twin/${assetId}`, {
      method: "GET",
      credentials: "include",
    });
    return await handleResponse<VirtualAssetDTO>(response);
  } catch (error) {
    console.error("Error fetching digital twin state:", error);
    throw error;
  }
}

/**
 * Subscribes to real-time digital twin updates for the given assetId.
 * Uses a relative URL so that Next.js rewrites proxy the request.
 * EventSource is configured with withCredentials for browsers that support it.
 */
export function subscribeDigitalTwinUpdates(assetId: number): EventSource {
  const url = `/api/digital-twin/stream/${assetId}`;
  const eventSource = new EventSource(url, { withCredentials: true });
  eventSource.onerror = (error) => {
    console.error("Digital Twin SSE error:", error);
  };
  return eventSource;
}
