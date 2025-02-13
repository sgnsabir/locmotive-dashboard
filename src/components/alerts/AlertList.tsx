import React, { FC } from "react";

interface AlertItem {
  id: number;
  type: string; // e.g. 'Overload', 'Brake Failure'
  severity: string; // e.g. 'High', 'Critical', 'Low'
  message: string;
}

interface AlertsListProps {
  alerts: AlertItem[];
}

const AlertsList: FC<AlertsListProps> = ({ alerts }) => {
  return (
    <div className="space-y-2">
      {alerts.length === 0 ? (
        <p className="text-gray-500 italic">No active alerts</p>
      ) : (
        alerts.map((alert) => (
          <div key={alert.id} className="border p-4 rounded-md shadow">
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
