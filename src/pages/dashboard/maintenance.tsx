// src/pages/dashboard/maintenance.tsx
import React, { FC } from "react";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import MaintenanceSchedule from "@/components/maintenance/MaintenanceSchedule";
import PredictiveMaintenance from "@/components/maintenance/PredictiveMaintenance";
import HealthScore from "@/components/maintenance/HealthScore";

interface MaintenanceRecord {
  timestamp: string;
  id: number;
  date: string;
  description: string;
}

const mockSchedule: MaintenanceRecord[] = [
  {
    timestamp: "2025-02-10T00:00:00.000+01:00",
    id: 1,
    date: "2025-02-10",
    description: "Wheel alignment for Car 2",
  },
  {
    timestamp: "2025-02-15T00:00:00.000+01:00",
    id: 2,
    date: "2025-02-15",
    description: "Brake inspection for Car 1",
  },
];

const Maintenance: FC = () => {
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter<MaintenanceRecord>(mockSchedule);

  const predictions = [
    { component: "Brake Pads - Car 1", probability: 0.8 },
    { component: "Axle Bearing - Car 3", probability: 0.55 },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Predictive Maintenance</h1>

      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <button
            onClick={() =>
              downloadCSV(filteredData, "maintenance_schedule.csv")
            }
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() =>
              downloadJSON(filteredData, "maintenance_schedule.json")
            }
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Upcoming Maintenance</h2>
        <MaintenanceSchedule items={filteredData} />
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Predictive Analytics</h2>
        <PredictiveMaintenance predictions={predictions} />
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Train Health Score</h2>
        <HealthScore score={78} />
      </section>
    </div>
  );
};

export default Maintenance;
