import React, { FC } from "react";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { formatDate } from "@/utils/dateTime";
import AlertsList from "@/components/alerts/AlertList";

interface AlertItem {
  timestamp: string;
  id: number;
  type: string;
  severity: string;
  message: string;
}

const mockAlerts: AlertItem[] = [
  {
    timestamp: "2025-02-10T09:00:00.000+01:00",
    id: 1,
    type: "Overload",
    severity: "High",
    message: "Axle load exceeding normal range on Car 3.",
  },
  {
    timestamp: "2025-02-10T09:45:00.000+01:00",
    id: 2,
    type: "Brake Failure",
    severity: "Critical",
    message: "Brake pressure anomaly detected in Car 1.",
  },
];

const Alerts: FC = () => {
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter(mockAlerts);

  const finalData = filteredData.map((item) => ({
    ...item,
    date: formatDate(item.timestamp),
  }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Alerts & Anomalies</h1>

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
            onClick={() => downloadCSV(finalData, "alerts.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadJSON(finalData, "alerts.json")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <AlertsList alerts={finalData} />
      </section>
    </div>
  );
};

export default Alerts;
