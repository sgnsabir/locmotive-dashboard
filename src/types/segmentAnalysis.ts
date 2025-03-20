export interface SegmentAnalysisDTO {
  segmentId: number | null; // If segmentId can be null, otherwise use number
  totalRecords: number;
  highVibrationCount: number;
  highLateralForceCount: number;
  highVerticalForceCount: number;
  hotSpot: boolean;
}
