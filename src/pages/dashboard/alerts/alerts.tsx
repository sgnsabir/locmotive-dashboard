// src/pages/dashboard/alerts.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAlerts } from "@/api/alerts";
import { AlertResponse } from "@/types/alert";
import AlertsList from "@/components/alerts/AlertList";

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err: any) {
      setError(
        err.message || "An unknown error occurred while fetching alerts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // When an alert is clicked, navigate to its detail page.
  const handleAlertClick = (alert: AlertResponse) => {
    router.push(`/dashboard/alerts/${alert.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Alerts &amp; Anomalies</h1>
      {loading && <p>Loading alerts...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && alerts.length === 0 && (
        <p className="text-gray-500 italic">No active alerts</p>
      )}
      {alerts.length > 0 && (
        <AlertsList alerts={alerts} onAlertClick={handleAlertClick} />
      )}
    </div>
  );
};

export default Alerts;
