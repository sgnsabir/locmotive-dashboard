// pages/dashboard/alerts.tsx
import React, { useEffect, useState } from "react";
import { getAlerts, acknowledgeAlert } from "@/api/alerts";
import { AlertResponse } from "@/types/alert";

interface AlertItem {
  id: number;
  subject: string;
  text: string;
  timestamp: string;
  acknowledged: boolean;
}

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: AlertResponse[] = await getAlerts();
      const mappedAlerts: AlertItem[] = data.map((alert) => ({
        id: alert.id,
        subject: alert.subject,
        text: alert.text,
        timestamp: alert.timestamp,
        acknowledged: alert.acknowledged,
      }));
      setAlerts(mappedAlerts);
    } catch (err: unknown) {
      console.error("Error fetching alerts:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching alerts.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (alertId: number) => {
    try {
      await acknowledgeAlert({ alertId });
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      );
    } catch (err: unknown) {
      console.error("Error acknowledging alert:", err);
      alert(
        "Failed to acknowledge alert: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Alerts & Anomalies</h1>
      {loading && <p>Loading alerts...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && alerts.length === 0 && (
        <p className="text-gray-500 italic">No active alerts</p>
      )}
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border p-4 rounded-md shadow flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h3 className="font-bold">
                {alert.subject} ({alert.acknowledged ? "Low" : "High"})
              </h3>
              <p>{alert.text}</p>
              <p className="text-sm text-gray-500">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
            {!alert.acknowledged && (
              <button
                onClick={() => handleAcknowledge(alert.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2 md:mt-0"
              >
                Acknowledge
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
