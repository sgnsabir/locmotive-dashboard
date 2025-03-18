// src/api/apiTypes.ts

export interface LoginResponse {
  token: string;
  username: string;
  expiresIn: number;
}

export interface AlertResponse {
  id: number;
  subject: string;
  text: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface PerformanceDTO {
  timestamp: string;
  speed: number;
  acceleration: number | null;
}

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

/**
 * SensorMetricsDTO defines the structure for aggregated sensor metrics.
 * This must match the backend DTO exactly.
 */
export interface SensorMetricsDTO {
  analysisId: number;
  averageSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  speedVariance: number;
  averageAcceleration: number;
  minAcceleration: number;
  maxAcceleration: number;
  accelerationVariance: number;
  averageAoa: number;
  minAoa: number;
  maxAoa: number;
  aoaVariance: number;
  averageVibrationLeft: number;
  minVibrationLeft: number;
  maxVibrationLeft: number;
  vibrationLeftVariance: number;
  averageVibrationRight: number;
  minVibrationRight: number;
  maxVibrationRight: number;
  vibrationRightVariance: number;
  averageVerticalForceLeft: number;
  minVerticalForceLeft: number;
  maxVerticalForceLeft: number;
  verticalForceLeftVariance: number;
  averageVerticalForceRight: number;
  minVerticalForceRight: number;
  maxVerticalForceRight: number;
  verticalForceRightVariance: number;
  averageLateralForceLeft: number;
  minLateralForceLeft: number;
  maxLateralForceLeft: number;
  lateralForceLeftVariance: number;
  averageLateralForceRight: number;
  minLateralForceRight: number;
  maxLateralForceRight: number;
  lateralForceRightVariance: number;
  averageLateralVibrationLeft: number;
  minLateralVibrationLeft: number;
  maxLateralVibrationLeft: number;
  lateralVibrationLeftVariance: number;
  averageLateralVibrationRight: number;
  minLateralVibrationRight: number;
  maxLateralVibrationRight: number;
  lateralVibrationRightVariance: number;
  averageLngL: number;
  averageLngR: number;
  minLngL: number;
  maxLngL: number;
  lngLVariance: number;
  minLngR: number;
  maxLngR: number;
  lngRVariance: number;
  averageAxleLoadLeft: number;
  minAxleLoadLeft: number;
  maxAxleLoadLeft: number;
  axleLoadLeftVariance: number;
  averageAxleLoadRight: number;
  minAxleLoadRight: number;
  maxAxleLoadRight: number;
  axleLoadRightVariance: number;
  averageEmissions: number;
  minEmissions: number;
  maxEmissions: number;
  emissionsVariance: number;
  riskScore: number;
  predictionMessage: string;
  createdAt: string;
}

export interface HistoricalDataResponse {
  analysisId: number;
  metricsHistory: SensorMetricsDTO[];
  page: number;
  size: number;
  totalRecords: number;
  startTime: string;
  endTime: string;
}

export interface TrackConditionDTO {
  trainNo: number;
  measurementTime: string;
  lateralForceLeft: number;
  lateralForceRight: number;
  verticalForceLeft: number;
  verticalForceRight: number;
  highLateralForce: boolean;
  highVerticalForce: boolean;
  anomalyMessage: string;
}

/**
 * VirtualAssetDTO represents the digital twin state.
 */
export interface VirtualAssetDTO {
  assetId: number;
  status: string;
  updatedAt: string;
  sensorSummary: string;
}
