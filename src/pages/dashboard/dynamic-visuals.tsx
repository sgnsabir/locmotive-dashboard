// src/pages/dashboard/dynamic-visuals.tsx
import React, { FC, useState, useEffect, useMemo, ChangeEvent } from "react";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { formatDate } from "@/utils/dateTime";
import BasicLineChart from "@/components/charts/BasicLineChart";
import BasicAreaChart from "@/components/charts/BasicAreaChart";
import BasicBarChart from "@/components/charts/BasicBarChart";
import BasicScatterChart from "@/components/charts/BasicScatterChart";
import BasicPieChart from "@/components/charts/BasicPieChart";
import { COLORS } from "@/constants/chartColors";

// ---------------------------
// Type Definitions
// ---------------------------

/** Historical record with dynamic keys for metrics */
interface HistoricalRecord {
  timestamp: string;
  speed: number;
  acceleration: number;
  fuelEfficiency: number;
  axleLoad: number;
  vibration: number;
  emissions: number;
  // Allow dynamic property access for metrics
  [key: string]: number | string;
}

/** Type for metric options */
interface MetricOption {
  value: string;
  label: string;
  color?: string;
}

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

export const metricOptions: MetricOption[] = [
  { value: "speed", label: "Speed (km/h)", color: COLORS[0] },
  { value: "acceleration", label: "Acceleration (m/s²)", color: COLORS[1] },
  {
    value: "fuelEfficiency",
    label: "Fuel Efficiency (km/l)",
    color: COLORS[2],
  },
  { value: "axleLoad", label: "Axle Load (tons)", color: COLORS[3] },
  { value: "vibration", label: "Vibration (m/s²)", color: COLORS[4] },
  { value: "emissions", label: "Emissions (kg CO₂)", color: COLORS[5] },
];

const chartTypeOptions: { value: ChartType; label: string }[] = [
  { value: "line", label: "Line Chart" },
  { value: "area", label: "Area Chart" },
  { value: "scatter", label: "Scatter Chart" },
  { value: "bar", label: "Bar/Column/Histogram" },
  { value: "pie", label: "Pie Chart" },
  { value: "donut", label: "Donut Chart" },
];

// ---------------------------
// Chart Type
// ---------------------------
export type ChartType = "line" | "area" | "scatter" | "bar" | "pie" | "donut";

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
// Main Component
// ---------------------------
const DynamicVisuals: FC = () => {
  // Chart type selection state
  const [chartType, setChartType] = useState<ChartType>("line");
  // Sensor category filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Metric selection state – default to "speed"
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["speed"]);

  // Date filtering via custom hook
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter<HistoricalRecord>(mockHistoricalData);

  // Compute available metric options based on sensor category selection.
  const availableMetricOptions = useMemo<MetricOption[]>(() => {
    if (selectedCategories.length === 0) return metricOptions;
    const allowedMetrics = selectedCategories.flatMap(
      (cat) => sensorCategoryMapping[cat] || []
    );
    return metricOptions.filter((opt) => allowedMetrics.includes(opt.value));
  }, [selectedCategories]);

  // Ensure selectedMetrics remain valid.
  useEffect(() => {
    setSelectedMetrics((prev) =>
      prev.filter((m) => availableMetricOptions.some((opt) => opt.value === m))
    );
  }, [availableMetricOptions]);

  // Prepare multi-series data with a "date" field.
  const multiSeriesData = useMemo(() => {
    return filteredData.map((record) => {
      const formatted: Record<string, number | string> = {
        date: formatDate(record.timestamp),
      };
      selectedMetrics.forEach((metric) => {
        formatted[metric] = record[metric] as number;
      });
      return formatted;
    });
  }, [filteredData, selectedMetrics]);

  // Prepare aggregated data for pie charts using the first selected metric.
  const pieData = useMemo(() => {
    if (selectedMetrics.length === 0) return [];
    const metric = selectedMetrics[0];
    const aggregation: Record<string, number> = {};
    filteredData.forEach((record) => {
      const date = formatDate(record.timestamp);
      aggregation[date] = (aggregation[date] || 0) + (record[metric] as number);
    });
    return Object.entries(aggregation).map(([date, total]) => ({
      name: date,
      value: total,
    }));
  }, [filteredData, selectedMetrics]);

  // For donut chart: group "speed" into bins if 'speed' is selected.
  const speedBins = useMemo(() => {
    if (!selectedMetrics.includes("speed")) return [];
    const bins = { "<65": 0, "65-70": 0, ">70": 0 };
    filteredData.forEach((record) => {
      const speed = record.speed as number;
      if (speed < 65) bins["<65"] += 1;
      else if (speed <= 70) bins["65-70"] += 1;
      else bins[">70"] += 1;
    });
    return Object.entries(bins).map(([range, count]) => ({
      name: range,
      value: count,
    }));
  }, [filteredData, selectedMetrics]);

  // ---------------------------
  // Render Chart Based on Chart Type
  // ---------------------------
  const renderChart = (): React.ReactElement | null => {
    switch (chartType) {
      case "line":
        return (
          <BasicLineChart
            data={multiSeriesData}
            xKey="date"
            lines={selectedMetrics.map((metric) => ({
              dataKey: metric,
              name: metric,
              color: availableMetricOptions.find((opt) => opt.value === metric)
                ?.color,
            }))}
            height={300}
          />
        );
      case "area":
        return (
          <BasicAreaChart
            data={multiSeriesData}
            xKey="date"
            areas={selectedMetrics.map((metric) => ({
              dataKey: metric,
              name: metric,
              color: availableMetricOptions.find((opt) => opt.value === metric)
                ?.color,
            }))}
            height={300}
          />
        );
      case "bar":
        return (
          <BasicBarChart
            data={multiSeriesData}
            xKey="date"
            bars={selectedMetrics.map((metric) => ({
              dataKey: metric,
              name: metric,
              color: availableMetricOptions.find((opt) => opt.value === metric)
                ?.color,
            }))}
            height={300}
          />
        );
      case "scatter":
        return (
          <BasicScatterChart
            data={multiSeriesData}
            scatterSeries={
              selectedMetrics.length >= 2
                ? [
                    {
                      dataKeyX: selectedMetrics[0],
                      dataKeyY: selectedMetrics[1],
                      name: `${selectedMetrics[0]} vs ${selectedMetrics[1]}`,
                    },
                  ]
                : []
            }
            height={300}
          />
        );
      case "pie":
        return (
          <BasicPieChart
            data={pieData}
            pies={[
              {
                dataKey: "value",
                nameKey: "name",
                outerRadius: 100,
              },
            ]}
            height={300}
          />
        );
      case "donut":
        return (
          <BasicPieChart
            data={speedBins}
            pies={[
              {
                dataKey: "value",
                nameKey: "name",
                outerRadius: 100,
                innerRadius: 50,
              },
            ]}
            height={300}
          />
        );
      default:
        return <p>Chart type not supported.</p>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Dynamic Visualizations</h1>

      {/* Date Filter & Export */}
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <h2 className="text-xl font-semibold">Filter Data by Date</h2>
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
            onClick={() => downloadCSV(filteredData, "dynamic_visuals.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadJSON(filteredData, "dynamic_visuals.json")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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

      {/* Metric Selection */}
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <h2 className="text-xl font-semibold">Select Metrics</h2>
        <div className="flex flex-wrap gap-4">
          {availableMetricOptions.map((opt) => (
            <label key={opt.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedMetrics.includes(opt.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMetrics([...selectedMetrics, opt.value]);
                  } else {
                    setSelectedMetrics(
                      selectedMetrics.filter((m) => m !== opt.value)
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

      {/* Chart Type Selection */}
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <h2 className="text-xl font-semibold">Select Chart Type</h2>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as ChartType)}
          className="mt-1 block w-full border rounded p-2"
        >
          {chartTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {/* Render Dynamic Chart */}
      <section className="bg-white p-4 rounded-md shadow">
        {renderChart()}
      </section>
    </div>
  );
};

export default DynamicVisuals;
