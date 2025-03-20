// src/pages/dashboard/maintenance.tsx
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getPredictiveMaintenance,
  getMaintenanceSchedule,
} from "@/api/maintenance";
import MaintenanceSchedule from "@/components/maintenance/MaintenanceSchedule";
import PredictiveMaintenance from "@/components/maintenance/PredictiveMaintenance";
import HealthScore from "@/components/maintenance/HealthScore";
import {
  MaintenanceRecord,
  PredictiveMaintenanceResponse,
} from "@/types/maintenance";

const Maintenance: FC = () => {
  const router = useRouter();
  // Dynamically determine the analysisId from the URL query (default to 1 if not provided)
  const { analysisId: analysisIdQuery } = router.query;
  const analysisId =
    typeof analysisIdQuery === "string" ? parseInt(analysisIdQuery, 10) : 1;
  // Retrieve the alert email from the environment variable; fallback to a default value if missing
  const alertEmail =
    process.env.NEXT_PUBLIC_ALERT_EMAIL || "alerts@example.com";

  const [maintenanceSchedule, setMaintenanceSchedule] = useState<
    MaintenanceRecord[]
  >([]);
  const [predictiveData, setPredictiveData] =
    useState<PredictiveMaintenanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch maintenance schedule from backend
  useEffect(() => {
    async function fetchSchedule() {
      try {
        const schedule = await getMaintenanceSchedule();
        setMaintenanceSchedule(schedule);
      } catch (err: unknown) {
        console.error("Error fetching maintenance schedule:", err);
        setError("Error fetching maintenance schedule");
      }
    }
    fetchSchedule();
  }, []);

  // Fetch predictive maintenance data using dynamic analysisId and alertEmail
  useEffect(() => {
    async function fetchPredictive() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPredictiveMaintenance(analysisId, alertEmail);
        setPredictiveData(data);
      } catch (err: unknown) {
        console.error("Error fetching predictive maintenance data:", err);
        setError("Error fetching predictive maintenance data");
      } finally {
        setLoading(false);
      }
    }
    fetchPredictive();
  }, [analysisId, alertEmail]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Predictive Maintenance</h1>

      {error && <div className="text-red-600">{error}</div>}

      {/* Maintenance Schedule Section */}
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Upcoming Maintenance</h2>
        <MaintenanceSchedule items={maintenanceSchedule} />
      </section>

      {/* Predictive Maintenance Analytics Section */}
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Predictive Analytics</h2>
        {loading && <p>Loading predictive maintenance data...</p>}
        {predictiveData ? (
          <PredictiveMaintenance
            predictions={[
              { component: "Overall", probability: predictiveData.riskScore },
            ]}
          />
        ) : (
          !loading && <p>No predictive maintenance data available.</p>
        )}
      </section>

      {/* Train Health Score Section */}
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Train Health Score</h2>
        {predictiveData ? (
          // Assuming riskScore is a value between 0 and 1, we convert it to a percentage.
          <HealthScore score={predictiveData.riskScore * 100} />
        ) : (
          <p>Health score not available.</p>
        )}
      </section>
    </div>
  );
};

export default Maintenance;
