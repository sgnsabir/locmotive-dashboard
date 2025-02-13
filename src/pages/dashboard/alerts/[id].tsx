import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Type definition for a single alert
interface AlertItem {
  id: number;
  type: string;
  severity: string;
  message: string;
  timestamp?: string; // optional extra fields for demonstration
}

const AlertDetail: FC = () => {
  const router = useRouter();
  const { id } = router.query; // e.g. "/dashboard/alerts/2" => id = "2"

  const [alert, setAlert] = useState<AlertItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // wait until `id` is defined

    // Simulate fetching from a mock endpoint or data array
    const mockAlerts: AlertItem[] = [
      {
        id: 1,
        type: "Overload",
        severity: "High",
        message: "Axle load exceeding normal range on Car 3.",
        timestamp: "2025-02-10 10:15:00",
      },
      {
        id: 2,
        type: "Brake Failure",
        severity: "Critical",
        message: "Brake pressure anomaly detected in Car 1.",
        timestamp: "2025-02-10 09:47:12",
      },
    ];

    // Convert `id` to number and find the matching alert
    const numericId = Number(id);
    const foundAlert = mockAlerts.find((item) => item.id === numericId) || null;

    setAlert(foundAlert);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Loading alert details...</p>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-500">Alert not found for ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Alert #{alert.id}</h1>
      <div className="bg-white p-4 rounded-md shadow">
        <p>
          <strong>Type:</strong> {alert.type}
        </p>
        <p>
          <strong>Severity:</strong> {alert.severity}
        </p>
        <p>
          <strong>Message:</strong> {alert.message}
        </p>
        {alert.timestamp && (
          <p>
            <strong>Timestamp:</strong> {alert.timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default AlertDetail;
