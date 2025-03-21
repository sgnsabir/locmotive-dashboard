import React, { FC, useState, useMemo, ChangeEvent } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { formatDate } from "@/utils/dateTime";
import { API_BASE_URL, getToken, handleResponse } from "@/api/apiHelper";
import { HistoricalDataResponse } from "@/types/historicalData";
import { SensorMetricsDTO } from "@/types/sensorMetrics";
import { COLORS } from "@/constants/chartColors";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";

// Import chart components
import BasicLineChart from "@/components/charts/BasicLineChart";
import BasicAreaChart from "@/components/charts/BasicAreaChart";
import BasicBarChart from "@/components/charts/BasicBarChart";
import BasicScatterChart from "@/components/charts/BasicScatterChart";
import BasicPieChart from "@/components/charts/BasicPieChart";

const sensorCategoryMapping: Record<string, string[]> = {
  performance: ["speed", "acceleration"],
  load: ["axleLoad", "vibration"],
  track: [
    "lateralForceLeft",
    "lateralForceRight",
    "verticalForceLeft",
    "verticalForceRight",
  ],
  steering: ["angleOfAttack", "lateralVerticalRatio"],
};

const sensorCategoryOptions = [
  { value: "performance", label: "Performance" },
  { value: "load", label: "Load" },
  { value: "track", label: "Track" },
  { value: "steering", label: "Steering" },
];

export const metricOptions = [
  { value: "speed", label: "Speed (km/h)", color: COLORS[0] },
  { value: "acceleration", label: "Acceleration (m/s²)", color: COLORS[1] },
  { value: "axleLoad", label: "Axle Load (tons)", color: COLORS[2] },
  { value: "vibration", label: "Vibration (m/s²)", color: COLORS[3] },
  {
    value: "lateralForceLeft",
    label: "Lateral Force Left (kN)",
    color: COLORS[4],
  },
  {
    value: "lateralForceRight",
    label: "Lateral Force Right (kN)",
    color: COLORS[5],
  },
  {
    value: "verticalForceLeft",
    label: "Vertical Force Left (kN)",
    color: COLORS[0],
  },
  {
    value: "verticalForceRight",
    label: "Vertical Force Right (kN)",
    color: COLORS[1],
  },
  { value: "angleOfAttack", label: "Angle of Attack (°)", color: COLORS[2] },
  {
    value: "lateralVerticalRatio",
    label: "Lateral/Vertical Force Ratio",
    color: COLORS[3],
  },
];

export type ChartType = "line" | "area" | "scatter" | "bar" | "pie" | "donut";

const chartTypeOptions: { value: ChartType; label: string }[] = [
  { value: "line", label: "Line Chart" },
  { value: "area", label: "Area Chart" },
  { value: "scatter", label: "Scatter Chart" },
  { value: "bar", label: "Bar/Column Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "donut", label: "Donut Chart" },
];

const DynamicVisuals: FC = () => {
  // Use useRouter inside the component as required by hooks rules.
  const router = useRouter();
  const { analysisId: analysisIdQuery } = router.query;
  const analysisId =
    typeof analysisIdQuery === "string" ? parseInt(analysisIdQuery, 10) : 1;

  // Fetch historical data using SWR.
  const { data: historicalDataResponse, error } =
    useSWR<HistoricalDataResponse>(
      `${API_BASE_URL}/dashboard/historical/${analysisId}`,
      (url: string) =>
        fetch(url, {
          headers: { Authorization: getToken() ? `Bearer ${getToken()}` : "" },
          credentials: "include",
        }).then((res) => handleResponse<HistoricalDataResponse>(res)),
      { refreshInterval: 60000 }
    );

  // Map fetched metricsHistory to include a 'timestamp' property.
  const historicalDataWithTimestamp = useMemo(() => {
    const metricsHistory = historicalDataResponse?.metricsHistory ?? [];
    return metricsHistory.map((item: SensorMetricsDTO) => ({
      ...item,
      timestamp: item.createdAt,
    }));
  }, [historicalDataResponse]);

  // useDateRangeFilter expects objects with a 'timestamp' property.
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter(historicalDataWithTimestamp);

  const [chartType, setChartType] = useState<ChartType>("line");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["speed"]);

  const availableMetricOptions = useMemo(() => {
    if (selectedCategories.length === 0) return metricOptions;
    const allowed = selectedCategories.flatMap(
      (cat) => sensorCategoryMapping[cat] || []
    );
    return metricOptions.filter((opt) => allowed.includes(opt.value));
  }, [selectedCategories]);

  // Ensure that selectedMetrics remain valid based on availableMetricOptions.
  useMemo(() => {
    setSelectedMetrics((prev) =>
      prev.filter((m) => availableMetricOptions.some((opt) => opt.value === m))
    );
  }, [availableMetricOptions]);

  // Build multi-series chart data.
  const multiSeriesData = useMemo(() => {
    return filteredData.map((record) => {
      const entry: { date: string } & Record<string, number | string> = {
        date: formatDate(record.timestamp),
      };
      selectedMetrics.forEach((metric) => {
        let value = 0;
        switch (metric) {
          case "speed":
            value = record.averageSpeed;
            break;
          case "acceleration":
            value = record.averageAcceleration;
            break;
          case "axleLoad":
            value =
              (record.averageAxleLoadLeft + record.averageAxleLoadRight) / 2;
            break;
          case "vibration":
            value =
              (record.averageVibrationLeft + record.averageVibrationRight) / 2;
            break;
          case "lateralForceLeft":
            value = record.averageLateralForceLeft;
            break;
          case "lateralForceRight":
            value = record.averageLateralForceRight;
            break;
          case "verticalForceLeft":
            value = record.averageVerticalForceLeft;
            break;
          case "verticalForceRight":
            value = record.averageVerticalForceRight;
            break;
          case "angleOfAttack":
            value = record.averageAoa;
            break;
          case "lateralVerticalRatio": {
            const verticalSum =
              record.averageVerticalForceLeft +
              record.averageVerticalForceRight;
            value =
              verticalSum > 0
                ? (record.averageLateralForceLeft +
                    record.averageLateralForceRight) /
                  verticalSum
                : 0;
            break;
          }
          default:
            value = 0;
        }
        entry[metric] = value;
      });
      return entry;
    });
  }, [filteredData, selectedMetrics]);

  // Build pie chart data using the first selected metric.
  const pieData = useMemo(() => {
    if (selectedMetrics.length === 0) return [];
    const metric = selectedMetrics[0];
    const agg: Record<string, number> = {};
    filteredData.forEach((record) => {
      const d = formatDate(record.timestamp);
      agg[d] =
        (agg[d] || 0) +
        Number(
          (() => {
            switch (metric) {
              case "speed":
                return record.averageSpeed;
              case "acceleration":
                return record.averageAcceleration;
              case "axleLoad":
                return (
                  (record.averageAxleLoadLeft + record.averageAxleLoadRight) / 2
                );
              case "vibration":
                return (
                  (record.averageVibrationLeft + record.averageVibrationRight) /
                  2
                );
              case "lateralForceLeft":
                return record.averageLateralForceLeft;
              case "lateralForceRight":
                return record.averageLateralForceRight;
              case "verticalForceLeft":
                return record.averageVerticalForceLeft;
              case "verticalForceRight":
                return record.averageVerticalForceRight;
              case "angleOfAttack":
                return record.averageAoa;
              case "lateralVerticalRatio": {
                const verticalSum =
                  record.averageVerticalForceLeft +
                  record.averageVerticalForceRight;
                return verticalSum > 0
                  ? (record.averageLateralForceLeft +
                      record.averageLateralForceRight) /
                      verticalSum
                  : 0;
              }
              default:
                return 0;
            }
          })()
        );
    });
    return Object.entries(agg).map(([date, total]) => ({
      name: date,
      value: total,
    }));
  }, [filteredData, selectedMetrics]);

  // For donut chart, if "speed" is selected, create bins.
  const speedBins = useMemo(() => {
    if (!selectedMetrics.includes("speed")) return [];
    const bins = { "<65": 0, "65-70": 0, ">70": 0 };
    filteredData.forEach((record) => {
      const speed = Number(record.averageSpeed);
      if (speed < 65) bins["<65"] += 1;
      else if (speed <= 70) bins["65-70"] += 1;
      else bins[">70"] += 1;
    });
    return Object.entries(bins).map(([range, count]) => ({
      name: range,
      value: count,
    }));
  }, [filteredData, selectedMetrics]);

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
                      color: availableMetricOptions.find(
                        (opt) => opt.value === selectedMetrics[0]
                      )?.color,
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
            pies={[{ dataKey: "value", nameKey: "name", outerRadius: 100 }]}
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
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Dynamic Visualizations</h1>

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
            onClick={() => downloadCSV(filteredData, "dynamic_visuals.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadJSON(filteredData, "dynamic_visuals.json")}
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

      {/* Chart Type Selection */}
      <section className="bg-white p-4 rounded-md shadow">
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

      {/* Chart Display */}
      <section className="bg-white p-4 rounded-md shadow">
        {error && (
          <p className="text-red-600">
            Error loading historical data:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        )}
        {!historicalDataResponse && !error && <p>Loading historical data...</p>}
        {historicalDataResponse && renderChart()}
      </section>
    </div>
  );
};

export default DynamicVisuals;
