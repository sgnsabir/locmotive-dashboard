// src/components/alerts/AlertList.tsx

import React, { FC } from "react";

export interface AlertItem {
  id: number;
  type: string; // e.g., 'Overload', 'Brake Failure'
  severity: string; // e.g., 'High', 'Critical', 'Low'
  message: string;
}

export interface AlertsListProps {
  alerts: AlertItem[];
  onAlertClick?: (alert: AlertItem) => void;
}

const AlertsList: FC<AlertsListProps> = ({ alerts, onAlertClick }) => {
  return (
    <div className="space-y-2">
      {alerts.length === 0 ? (
        <p className="text-gray-500 italic">No active alerts</p>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            className="border p-4 rounded-md shadow cursor-pointer hover:bg-gray-100"
            onClick={() => onAlertClick && onAlertClick(alert)}
            role={onAlertClick ? "button" : undefined}
            tabIndex={onAlertClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onAlertClick && (e.key === "Enter" || e.key === " ")) {
                onAlertClick(alert);
              }
            }}
          >
            <h3 className="font-bold">
              {alert.type} ({alert.severity})
            </h3>
            <p>{alert.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AlertsList;
