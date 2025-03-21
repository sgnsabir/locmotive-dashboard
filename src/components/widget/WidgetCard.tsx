import React, { useState, ChangeEvent } from "react";
import { COLORS } from "@/constants/chartColors";
import { formatDate } from "@/utils/dateTime";
import BasicLineChart from "@/components/charts/BasicLineChart";
import BasicAreaChart from "@/components/charts/BasicAreaChart";
import BasicBarChart from "@/components/charts/BasicBarChart";
import BasicScatterChart from "@/components/charts/BasicScatterChart";
import BasicPieChart from "@/components/charts/BasicPieChart";
import { saveWidgets } from "./widgetPersistence";

// Types used in the widget
export type ChartType = "line" | "area" | "scatter" | "bar" | "pie" | "donut";

export interface DashboardWidget {
  id: string;
  chartType: ChartType;
  selectedMetrics: string[];
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HistoricalRecord {
  timestamp: string;
  [key: string]: unknown;
}

export interface WidgetCardProps {
  widget: DashboardWidget;
  updateWidget: (id: string, updated: Partial<DashboardWidget>) => void;
  removeWidget: (id: string) => void;
  availableMetricOptions: { value: string; label: string; color?: string }[];
  filteredData: HistoricalRecord[];
  // New props for complete widget configuration management
  allWidgets: DashboardWidget[];
  setAllWidgets: (widgets: DashboardWidget[]) => void;
}

const WidgetCard = ({
  widget,
  updateWidget,
  removeWidget,
  availableMetricOptions,
  filteredData,
  allWidgets,
  setAllWidgets,
}: WidgetCardProps): React.ReactElement => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempChartType, setTempChartType] = useState<ChartType>(
    widget.chartType
  );
  const [tempSelectedMetrics, setTempSelectedMetrics] = useState<string[]>(
    widget.selectedMetrics
  );
  const [isSaving, setIsSaving] = useState(false);

  // When user confirms changes, update widget configuration and persist via API
  const handleConfirm = async () => {
    setIsSaving(true);
    // Create updated widget object
    const updatedWidget: Partial<DashboardWidget> = {
      chartType: tempChartType,
      selectedMetrics: tempSelectedMetrics,
    };
    // Update local widget via the provided callback
    updateWidget(widget.id, updatedWidget);
    // Update complete widget configuration array
    const newWidgets = allWidgets.map((w) =>
      w.id === widget.id ? { ...w, ...updatedWidget } : w
    );
    setAllWidgets(newWidgets);
    try {
      // Persist updated configuration to the backend
      await saveWidgets(newWidgets);
    } catch (err) {
      console.error("Error saving widget configuration:", err);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempChartType(widget.chartType);
    setTempSelectedMetrics(widget.selectedMetrics);
    setIsEditing(false);
  };

  // Transform filteredData into chart data format (each record gets a 'date' field)
  const multiSeriesData = filteredData.map((record) => {
    const entry: { date: string } & Record<string, unknown> = {
      date: formatDate(record.timestamp),
    };
    tempSelectedMetrics.forEach((metric) => {
      entry[metric] = record[metric];
    });
    return entry;
  });

  const chartHeight = widget.h * 30;

  const renderChartPreview = (): React.ReactElement | null => {
    switch (tempChartType) {
      case "line":
        return (
          <BasicLineChart
            data={multiSeriesData}
            xKey="date"
            lines={tempSelectedMetrics.map((metric, i) => ({
              dataKey: metric,
              name: metric,
              color:
                availableMetricOptions.find((opt) => opt.value === metric)
                  ?.color || COLORS[i % COLORS.length],
            }))}
            height={chartHeight}
          />
        );
      case "area":
        return (
          <BasicAreaChart
            data={multiSeriesData}
            xKey="date"
            areas={tempSelectedMetrics.map((metric, i) => ({
              dataKey: metric,
              name: metric,
              color:
                availableMetricOptions.find((opt) => opt.value === metric)
                  ?.color || COLORS[i % COLORS.length],
            }))}
            height={chartHeight}
          />
        );
      case "bar":
        return (
          <BasicBarChart
            data={multiSeriesData}
            xKey="date"
            bars={tempSelectedMetrics.map((metric, i) => ({
              dataKey: metric,
              name: metric,
              color:
                availableMetricOptions.find((opt) => opt.value === metric)
                  ?.color || COLORS[i % COLORS.length],
            }))}
            height={chartHeight}
          />
        );
      case "scatter": {
        // For scatter, need at least two metrics
        const xMetric = tempSelectedMetrics[0] || "";
        const yMetric = tempSelectedMetrics[1] || "";
        return (
          <BasicScatterChart
            data={multiSeriesData}
            scatterSeries={[
              {
                dataKeyX: xMetric,
                dataKeyY: yMetric,
                name: `${xMetric} vs ${yMetric}`,
                color:
                  availableMetricOptions.find((opt) => opt.value === xMetric)
                    ?.color || COLORS[0],
              },
            ]}
            height={chartHeight}
          />
        );
      }
      case "pie":
        return (
          <BasicPieChart
            data={multiSeriesData}
            pies={[
              {
                dataKey: tempSelectedMetrics[0] || "",
                nameKey: "date",
                outerRadius: 80,
              },
            ]}
            height={chartHeight}
          />
        );
      case "donut":
        return (
          <BasicPieChart
            data={multiSeriesData}
            pies={[
              {
                dataKey: tempSelectedMetrics[0] || "",
                nameKey: "date",
                outerRadius: 80,
                innerRadius: 40,
              },
            ]}
            height={chartHeight}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <div className="flex flex-col space-y-2">
            <select
              value={tempChartType}
              onChange={(e) => setTempChartType(e.target.value as ChartType)}
              className="border rounded p-1 text-sm"
            >
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
              <option value="scatter">Scatter Chart</option>
              <option value="bar">Bar/Column Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="donut">Donut Chart</option>
            </select>
            <div className="flex flex-wrap gap-2">
              {availableMetricOptions.map((opt) => (
                <label key={opt.value} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={tempSelectedMetrics.includes(opt.value)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        setTempSelectedMetrics([
                          ...tempSelectedMetrics,
                          opt.value,
                        ]);
                      } else {
                        setTempSelectedMetrics(
                          tempSelectedMetrics.filter((m) => m !== opt.value)
                        );
                      }
                    }}
                  />
                  <span className="ml-1">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm font-semibold">
            {widget.chartType} - {widget.selectedMetrics.join(", ")}
          </div>
        )}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleConfirm}
                disabled={isSaving}
                className="bg-green-600 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Confirm"}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-2 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => removeWidget(widget.id)}
                className="bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1">{renderChartPreview()}</div>
    </div>
  );
};

export default WidgetCard;
