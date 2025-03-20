//src/types/historicalData.ts
import { SensorMetricsDTO } from "./sensorMetrics";

export interface HistoricalDataResponse {
  analysisId: number;
  metricsHistory: SensorMetricsDTO[];
  page: number;
  size: number;
  totalRecords: number;
  startTime: string;
  endTime: string;
}
// Define the type for each historical trend record returned from the backend
export interface HistoricalTrendDTO {
  createdAt: string;
  lastTripSpeed: number;
  currentTripSpeed: number;
}

// Define the response type from the historical endpoint
export interface HistoricalTrendsResponse {
  analysisId: number;
  metricsHistory: HistoricalTrendDTO[];
}
