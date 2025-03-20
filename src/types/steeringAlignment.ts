export interface SteeringAlignmentDTO {
  trainNo: number;
  measurementTime: string; // ISO-formatted date string
  angleOfAttack: number;
  lateralForceLeft: number;
  lateralForceRight: number;
  verticalForceLeft: number;
  verticalForceRight: number;
  lateralVerticalRatio: number;
  aoaOutOfSpec: boolean;
  misalignmentDetected: boolean;
  anomalyMessage: string;
}
