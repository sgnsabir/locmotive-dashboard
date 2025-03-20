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
