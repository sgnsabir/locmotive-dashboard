// src/types/trackCondition.ts
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
  // Additional insights for maximum data analysis:
  /**
   * The absolute difference between the left and right lateral forces.
   */
  lateralForceDifference?: number;
  /**
   * The absolute difference between the left and right vertical forces.
   */
  verticalForceDifference?: number;
  /**
   * The average lateral force computed as the mean of lateralForceLeft and lateralForceRight.
   */
  averageLateralForce?: number;
  /**
   * The average vertical force computed as the mean of verticalForceLeft and verticalForceRight.
   */
  averageVerticalForce?: number;
  /**
   * The ratio of the absolute difference between lateral forces to their average.
   * (Computed as lateralForceDifference / averageLateralForce if averageLateralForce > 0)
   */
  forceImbalanceRatio?: number;

  trackQualityScore?: number;
}
