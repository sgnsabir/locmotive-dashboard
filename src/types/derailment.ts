// src/types/derailment.ts

export interface DerailmentRiskDTO {
  trainNo: number;
  measurementTime: string; // ISO formatted date string
  vibrationLeft: number;
  vibrationRight: number;
  maxVibration: number;
  timeDelayDifference: number;
  riskDetected: boolean;
  anomalyMessage: string;
}
