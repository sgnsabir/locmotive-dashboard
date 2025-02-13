export function formatDate(isoString: string): string {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
