// src/components/widget/widgetPersistence.ts
import type { DashboardWidget } from "./WidgetCard";

export const loadWidgets = (): DashboardWidget[] => {
  try {
    const widgets = localStorage.getItem("dashboardWidgets");
    return widgets ? (JSON.parse(widgets) as DashboardWidget[]) : [];
  } catch (err) {
    console.error("Error loading widgets:", err);
    return [];
  }
};

export const saveWidgets = (widgets: DashboardWidget[]): void => {
  try {
    localStorage.setItem("dashboardWidgets", JSON.stringify(widgets));
  } catch (err) {
    console.error("Error saving widgets:", err);
  }
};
