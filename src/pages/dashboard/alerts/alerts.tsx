// src/pages/dashboard/alerts/alerts.tsx
import React from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { getAlerts } from "@/api/alerts";
import { AlertResponse } from "@/types/alert";
import AlertsList, { AlertItem } from "@/components/alerts/AlertList";

const fetchAlerts = async (): Promise<AlertResponse[]> => {
  return getAlerts();
};

const Alerts: React.FC = () => {
  const router = useRouter();
  const {
    data: alerts,
    error,
    isValidating,
  } = useSWR<AlertResponse[]>("/api/alerts", fetchAlerts, {
    refreshInterval: 60000,
    dedupingInterval: 30000,
  });

  // Transform AlertResponse objects into the AlertItem type expected by AlertsList
  const transformedAlerts: AlertItem[] | undefined = alerts?.map((alert) => ({
    id: alert.id,
    type: alert.subject, // using subject as the alert type for demonstration
    severity: alert.acknowledged ? "Low" : "High",
    message: alert.text,
  }));

  const handleAlertClick = (alert: AlertItem) => {
    router.push(`/dashboard/alerts/${alert.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Alerts &amp; Anomalies</h1>

      {error && (
        <p className="text-red-600">
          Error loading alerts:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {(!alerts || isValidating) && <p>Loading alerts...</p>}

      {alerts && alerts.length === 0 && (
        <p className="text-gray-500 italic">No active alerts</p>
      )}

      {transformedAlerts && transformedAlerts.length > 0 && (
        <AlertsList
          alerts={transformedAlerts}
          onAlertClick={handleAlertClick}
        />
      )}
    </div>
  );
};

export default Alerts;
