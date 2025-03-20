export interface AlertResponse {
  id: number;
  subject: string;
  text: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface AlertAcknowledgeRequest {
  alertId: number;
}
