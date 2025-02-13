import React, { FC } from "react";
import KPICard from "./KPICard";
import RealTimeStats from "./RealTimeStats";
import HistoricalTrends from "./HistoricalTrends";

const HomeDashboard: FC = () => {
  const kpiData = [
    { title: "Speed", value: "80 km/h", unit: "" },
    { title: "Fuel Efficiency", value: "15 km/l", unit: "" },
    { title: "Engine Temp", value: "90°C", unit: "" },
    { title: "Vibration", value: "2.5 m/s²", unit: "" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>
      </section>

      <section>
        <RealTimeStats />
      </section>

      <section>
        <HistoricalTrends />
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Maintenance</h2>
        <p>No maintenance scheduled in the next 7 days.</p>
      </section>
    </div>
  );
};

export default HomeDashboard;
