// src/pages/dashboard/alerts/[id].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAlertById } from "@/api/alerts";
import { AlertResponse } from "@/types/alert";

const AlertDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [alert, setAlert] = useState<AlertResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlert = async (alertId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlertById(alertId);
      setAlert(data);
    } catch (err: any) {
      setError(err.message || "Failed to load alert details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const alertId = Number(id);
      if (!isNaN(alertId)) {
        fetchAlert(alertId);
      } else {
        setError("Invalid alert ID.");
      }
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Loading alert details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Alert not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Alert #{alert.id}</h1>
      <div className="bg-white p-4 rounded-md shadow">
        <p>
          <strong>Subject:</strong> {alert.subject}
        </p>
        <p>
          <strong>Severity:</strong> {alert.severity}
        </p>
        <p>
          <strong>Message:</strong> {alert.text}
        </p>
        <p>
          <strong>Timestamp:</strong>{" "}
          {new Date(alert.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AlertDetail;
