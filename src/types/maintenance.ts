export interface PredictiveMaintenanceResponse {
  analysisId: number;
  averageSpeed: number;
  speedVariance: number;
  averageAoa: number;
  averageVibration: number;
  averageVerticalForce: number;
  averageLateralForce: number;
  averageLateralVibration: number;
  riskScore: number;
  predictionMessage: string;
}

export interface MaintenanceRecord {
  timestamp: string;
  id: number;
  date: string;
  description: string;
}
