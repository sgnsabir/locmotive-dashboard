// src/pages/dashboard/historical.tsx
import React, { FC, useState, useMemo, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import useSWR from "swr";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { API_BASE_URL, getToken, handleResponse } from "@/api/apiHelper";
import { SensorMetricsDTO } from "@/types/sensorMetrics";
import { HistoricalDataResponse } from "@/types/historicalData";
import { formatDate } from "@/utils/dateTime";
import {
  HistoricalRecord,
  DashboardWidget,
} from "@/components/widget/WidgetCard";
import WidgetCard from "@/components/widget/WidgetCard";

// Define a union type for valid sensor categories.
type SensorCategory = "performance" | "load" | "track" | "steering";

// Default widget configuration remains unchanged.
const defaultWidget: DashboardWidget = {
  id: "widget-1",
  chartType: "line",
  selectedMetrics: ["speed"],
  x: 0,
  y: 0,
  w: 6,
  h: 10,
};

// SWR fetcher function
const fetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: getToken() ? `Bearer ${getToken()}` : "" },
    credentials: "include",
  }).then((res) => handleResponse<HistoricalDataResponse>(res));

const Historical: FC = () => {
  // Derive dynamic analysisId from the URL query parameters using useRouter
  const router = useRouter();
  const { analysisId: analysisIdQuery } = router.query;
  const analysisId =
    typeof analysisIdQuery === "string" ? parseInt(analysisIdQuery, 10) : 1;

  // Fetch historical data dynamically using the derived analysisId
  const { data: historicalResponse, error } = useSWR<HistoricalDataResponse>(
    `${API_BASE_URL}/dashboard/historical/${analysisId}`,
    fetcher,
    { refreshInterval: 60000 }
  );

  // Convert fetched metricsHistory into historical records with a formatted date property
  const historicalRecords: HistoricalRecord[] = useMemo(() => {
    const metricsHistory = historicalResponse?.metricsHistory ?? [];
    return metricsHistory.map((item: SensorMetricsDTO) => {
      const record: Record<string, number | string> = {
        date: formatDate(item.createdAt),
      };
      (Object.keys(item) as (keyof SensorMetricsDTO)[]).forEach((key) => {
        const value = item[key];
        if (typeof value === "number") {
          record[key] = value;
        }
      });
      return record as HistoricalRecord;
    });
  }, [historicalResponse]);

  // Use date range filter hook (expects objects with a 'date' property)
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter<HistoricalRecord>(historicalRecords);

  // Memoize sensor category mapping with an explicit type.
  const sensorCategoryMapping = useMemo<Record<SensorCategory, string[]>>(
    () => ({
      performance: ["speed", "acceleration"],
      load: ["axleLoad", "vibration"],
      track: [
        "lateralForceLeft",
        "lateralForceRight",
        "verticalForceLeft",
        "verticalForceRight",
      ],
      steering: ["angleOfAttack", "lateralVerticalRatio"],
    }),
    []
  );

  // Memoize sensor category options.
  const sensorCategoryOptions = useMemo<
    { value: SensorCategory; label: string }[]
  >(
    () => [
      { value: "performance", label: "Performance" },
      { value: "load", label: "Load" },
      { value: "track", label: "Track" },
      { value: "steering", label: "Steering" },
    ],
    []
  );

  // Memoize metric options.
  const metricOptions = useMemo(
    () => [
      { value: "speed", label: "Speed (km/h)", color: "#8884d8" },
      { value: "acceleration", label: "Acceleration (m/s²)", color: "#82ca9d" },
      { value: "axleLoad", label: "Axle Load (tons)", color: "#ffc658" },
      { value: "vibration", label: "Vibration (m/s²)", color: "#ff8042" },
      {
        value: "lateralForceLeft",
        label: "Lateral Force Left (kN)",
        color: "#8dd1e1",
      },
      {
        value: "lateralForceRight",
        label: "Lateral Force Right (kN)",
        color: "#a4de6c",
      },
      {
        value: "verticalForceLeft",
        label: "Vertical Force Left (kN)",
        color: "#8884d8",
      },
      {
        value: "verticalForceRight",
        label: "Vertical Force Right (kN)",
        color: "#82ca9d",
      },
      {
        value: "angleOfAttack",
        label: "Angle of Attack (°)",
        color: "#ffc658",
      },
      {
        value: "lateralVerticalRatio",
        label: "Lateral/Vertical Ratio",
        color: "#ff8042",
      },
    ],
    []
  );

  // Define selected sensor categories.
  const [selectedCategories, setSelectedCategories] = useState<
    SensorCategory[]
  >([]);
  const availableMetricOptions = useMemo(() => {
    if (selectedCategories.length === 0) return metricOptions;
    const allowedMetrics = selectedCategories.flatMap(
      (cat) => sensorCategoryMapping[cat] || []
    );
    return metricOptions.filter((opt) => allowedMetrics.includes(opt.value));
  }, [selectedCategories, metricOptions, sensorCategoryMapping]);

  // Widget grid state
  const [widgets, setWidgets] = useState<DashboardWidget[]>([defaultWidget]);
  const ResponsiveGridLayout = WidthProvider(Responsive);

  const onLayoutChange = (layout: Layout[]) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) => {
        const found = layout.find((l) => l.i === widget.id);
        return found
          ? { ...widget, x: found.x, y: found.y, w: found.w, h: found.h }
          : widget;
      })
    );
  };

  const updateWidget = (id: string, updated: Partial<DashboardWidget>) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, ...updated } : widget
      )
    );
  };

  const removeWidget = (id: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.filter((widget) => widget.id !== id)
    );
  };

  const addWidget = () => {
    const newId = `widget-${widgets.length + 1}`;
    setWidgets([...widgets, { ...defaultWidget, id: newId }]);
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStartDate(e.target.value)
              }
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEndDate(e.target.value)
              }
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

      {/* Sensor Category Filter */}
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <h2 className="text-xl font-semibold">Filter by Sensor Category</h2>
        <div className="flex flex-wrap items-center gap-4">
          {sensorCategoryOptions.map((opt) => (
            <label key={opt.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(opt.value)}
                onChange={(e) =>
                  setSelectedCategories(
                    e.target.checked
                      ? [...selectedCategories, opt.value]
                      : selectedCategories.filter((cat) => cat !== opt.value)
                  )
                }
                className="h-4 w-4"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Widget Grid Layout */}
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
              allWidgets={widgets}
              setAllWidgets={setWidgets}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
      <section className="flex justify-end">
        <button
          onClick={addWidget}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Widget
        </button>
      </section>
      {error && (
        <p className="text-red-600">
          Error loading historical data:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}
    </div>
  );
};

export default Historical;
