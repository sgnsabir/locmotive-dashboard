import { VirtualAssetDTO } from "@/types/digitalTwin";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getDigitalTwinState(
  assetId: number
): Promise<VirtualAssetDTO> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/digital-twin/${assetId}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<VirtualAssetDTO>(response);
}

export function subscribeDigitalTwinUpdates(assetId: number): EventSource {
  const url = `${API_BASE_URL}/digital-twin/stream/${assetId}`;
  return new EventSource(url, { withCredentials: false });
}
