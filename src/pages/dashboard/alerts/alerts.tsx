// src/pages/dashboard/alerts/alerts.tsx

import React from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { getAlerts } from "@/api/alerts";
import { AlertResponse } from "@/types/alert";
import AlertsList from "@/components/alerts/AlertList";

// Define the type expected by AlertsList
interface AlertItem {
  id: number;
  type: string;
  severity: string;
  message: string;
}

// SWR fetcher function that calls our shared getAlerts API
const fetchAlerts = async (): Promise<AlertResponse[]> => {
  return getAlerts();
};

const Alerts: React.FC = () => {
  const router = useRouter();

  // Use SWR for data fetching with automatic revalidation
  const {
    data: alerts,
    error,
    isValidating,
  } = useSWR<AlertResponse[]>("/alerts", fetchAlerts, {
    refreshInterval: 60000, // refresh every 60 seconds
    dedupingInterval: 30000,
  });

  // Transform the backend AlertResponse objects to AlertItem objects required by AlertsList.
  const transformedAlerts: AlertItem[] | undefined = alerts?.map((alert) => ({
    id: alert.id,
    // Map subject to type. In a production app, you might determine the alert type based on more logic.
    type: alert.subject,
    // For demonstration, if an alert is acknowledged, we set severity to "Low", otherwise "High"
    severity: alert.acknowledged ? "Low" : "High",
    // Map text to message
    message: alert.text,
  }));

  // Navigate to the alert detail page when an alert is clicked
  const handleAlertClick = (alert: AlertItem) => {
    router.push(`/dashboard/alerts/${alert.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Alerts &amp; Anomalies</h1>

      {error && (
        <p className="text-red-600">
          Error loading alerts: {error instanceof Error ? error.message : error}
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
