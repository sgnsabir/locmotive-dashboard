export interface RawDataResponse {
  analysisId: number;
  createdAt: string;
  // Example sensor data fields (adjust to match backend DTO)
  spdTp1?: number;
  vfrclTp1?: number;
  vfrcrTp1?: number;
  sensorType?: string;
  value?: number;
}
