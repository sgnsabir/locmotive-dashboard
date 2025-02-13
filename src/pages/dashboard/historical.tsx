// src/pages/dashboard/historical.tsx
import React, { FC, useState, useMemo } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import WidgetCard, {
  DashboardWidget,
  HistoricalRecord,
} from "@/components/widget/WidgetCard";

// ---------------------------
// Sensor Category & Metric Options
// ---------------------------
const sensorCategoryMapping: Record<string, string[]> = {
  performance: ["speed", "acceleration"],
  energy: ["fuelEfficiency", "emissions"],
  load: ["axleLoad", "vibration"],
};

const sensorCategoryOptions = [
  { value: "performance", label: "Performance" },
  { value: "energy", label: "Energy" },
  { value: "load", label: "Load" },
];

const metricOptions = [
  { value: "speed", label: "Speed (km/h)" },
  { value: "acceleration", label: "Acceleration (m/s²)" },
  { value: "fuelEfficiency", label: "Fuel Efficiency (km/l)" },
  { value: "axleLoad", label: "Axle Load (tons)" },
  { value: "vibration", label: "Vibration (m/s²)" },
  { value: "emissions", label: "Emissions (kg CO₂)" },
];

// ---------------------------
// Extended Mock Historical Data
// ---------------------------
const mockHistoricalData: HistoricalRecord[] = [
  {
    timestamp: "2025-01-01T08:00:00.000+01:00",
    speed: 60,
    acceleration: 1.2,
    fuelEfficiency: 15,
    axleLoad: 12,
    vibration: 2.3,
    emissions: 30,
  },
  {
    timestamp: "2025-01-02T08:00:00.000+01:00",
    speed: 65,
    acceleration: 1.1,
    fuelEfficiency: 14,
    axleLoad: 13,
    vibration: 2.5,
    emissions: 32,
  },
  {
    timestamp: "2025-01-03T08:00:00.000+01:00",
    speed: 62,
    acceleration: 1.3,
    fuelEfficiency: 15.5,
    axleLoad: 11,
    vibration: 2.4,
    emissions: 31,
  },
  {
    timestamp: "2025-01-04T08:00:00.000+01:00",
    speed: 68,
    acceleration: 1.0,
    fuelEfficiency: 14.8,
    axleLoad: 12.5,
    vibration: 2.6,
    emissions: 33,
  },
  {
    timestamp: "2025-01-05T08:00:00.000+01:00",
    speed: 70,
    acceleration: 1.4,
    fuelEfficiency: 15.2,
    axleLoad: 13,
    vibration: 2.7,
    emissions: 34,
  },
  {
    timestamp: "2025-01-06T08:00:00.000+01:00",
    speed: 66,
    acceleration: 1.2,
    fuelEfficiency: 15.0,
    axleLoad: 12,
    vibration: 2.5,
    emissions: 32,
  },
];

// ---------------------------
// Default Widget Settings
// ---------------------------
const defaultWidget: DashboardWidget = {
  id: "widget-1",
  chartType: "line",
  selectedMetrics: ["speed"],
  x: 0,
  y: 0,
  w: 6,
  h: 10,
};

const Historical: FC = () => {
  // Date range filter hook using our extended mock data
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter<HistoricalRecord>(mockHistoricalData);

  // Sensor category selection state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Compute available metric options based on sensor categories selected
  const availableMetricOptions = useMemo(() => {
    if (selectedCategories.length === 0) return metricOptions;
    const allowedMetrics = selectedCategories.flatMap(
      (cat) => sensorCategoryMapping[cat] || []
    );
    return metricOptions.filter((opt) => allowedMetrics.includes(opt.value));
  }, [selectedCategories]);

  const [widgets, setWidgets] = useState<DashboardWidget[]>([defaultWidget]);

  const ResponsiveGridLayout = WidthProvider(Responsive);

  const onLayoutChange = (layout: Layout[]) => {
    setWidgets((prev) =>
      prev.map((widget) => {
        const found = layout.find((l) => l.i === widget.id);
        return found
          ? { ...widget, x: found.x, y: found.y, w: found.w, h: found.h }
          : widget;
      })
    );
  };

  const addWidget = () => {
    const newId = `widget-${widgets.length + 1}`;
    setWidgets([...widgets, { ...defaultWidget, id: newId }]);
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const updateWidget = (id: string, updated: Partial<DashboardWidget>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updated } : w))
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">
        Customizable Historical Dashboard
      </h1>

      {/* Global Filters & Export */}
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <h2 className="text-xl font-semibold">Global Filters & Export</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block border rounded p-2"
            />
          </div>
          <button
            onClick={() => downloadCSV(filteredData, "historical.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadJSON(filteredData, "historical.json")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>

      {/* Global Sensor Category Filter */}
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <h2 className="text-xl font-semibold">Filter by Sensor Category</h2>
        <div className="flex flex-wrap items-center gap-4">
          {sensorCategoryOptions.map((opt) => (
            <label key={opt.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(opt.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, opt.value]);
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((cat) => cat !== opt.value)
                    );
                  }
                }}
                className="h-4 w-4"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Widget Controls */}
      <section className="bg-white p-4 rounded-md shadow flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chart Widgets</h2>
        <button
          onClick={addWidget}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Widget
        </button>
      </section>

      {/* Render Widgets in Grid Layout */}
      <ResponsiveGridLayout
        layouts={{
          lg: widgets.map((w) => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h })),
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        onLayoutChange={onLayoutChange}
        draggableCancel="button, input, select, textarea"
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="bg-white p-2 rounded shadow">
            <WidgetCard
              widget={widget}
              updateWidget={updateWidget}
              removeWidget={removeWidget}
              availableMetricOptions={availableMetricOptions}
              filteredData={filteredData}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Historical;
