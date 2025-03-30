// src/pages/settings.tsx
import React, { FC, useState, useEffect, ChangeEvent } from "react";
import { fetchWithAuth, handleResponse } from "@/api/apiHelper";
import {
  UserSettings,
  GeneralSettings,
  DashboardSettings,
  NotificationSettings,
  SecuritySettings,
} from "@/types/settings";

const Settings: FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWithAuth("/api/users/settings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await handleResponse<UserSettings>(response);
        setSettings({
          general: {
            username: data.general.username || "",
            email: data.general.email || "",
            avatarUrl: data.general.avatarUrl || "/images/default-avatar.png",
          },
          dashboard: {
            showSpeedWidget: data.dashboard.showSpeedWidget,
            showFuelWidget: data.dashboard.showFuelWidget,
            showPerformanceWidget: data.dashboard.showPerformanceWidget,
          },
          notification: {
            enableNotifications: data.notification.enableNotifications,
            emailAlerts: data.notification.emailAlerts,
            smsAlerts: data.notification.smsAlerts,
          },
          security: {
            twoFactorEnabled: data.security.twoFactorEnabled,
            phoneNumber: data.security.phoneNumber || "",
          },
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching settings:", err);
          setError(err.message || "Failed to fetch user settings");
        } else {
          setError("Failed to fetch user settings");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleGeneralChange = (field: keyof GeneralSettings, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      general: { ...settings.general, [field]: value },
    });
  };

  const handleDashboardChange = (
    field: keyof DashboardSettings,
    value: boolean
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      dashboard: { ...settings.dashboard, [field]: value },
    });
  };

  const handleNotificationChange = (
    field: keyof NotificationSettings,
    value: boolean
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notification: { ...settings.notification, [field]: value },
    });
  };

  const handleSecurityChange = (
    field: keyof SecuritySettings,
    value: string | boolean
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      security: { ...settings.security, [field]: value },
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetchWithAuth("/api/users/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      const updated = await handleResponse<UserSettings>(response);
      setSettings(updated);
      alert("Settings updated successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error updating settings:", err);
        setError(err.message || "Failed to update settings");
      } else {
        setError("Failed to update settings");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || settings === null) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">User Settings &amp; Configurations</h1>
      {error && <div className="text-red-600">{error}</div>}
      <section className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={settings.general.username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleGeneralChange("username", e.target.value)
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={settings.general.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleGeneralChange("email", e.target.value)
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Avatar URL
            </label>
            <input
              type="text"
              value={settings.general.avatarUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleGeneralChange("avatarUrl", e.target.value)
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Dashboard Widgets</h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.dashboard.showSpeedWidget}
              onChange={(e) =>
                handleDashboardChange("showSpeedWidget", e.target.checked)
              }
              className="h-4 w-4"
            />
            <span>Show Speed Widget</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.dashboard.showFuelWidget}
              onChange={(e) =>
                handleDashboardChange("showFuelWidget", e.target.checked)
              }
              className="h-4 w-4"
            />
            <span>Show Fuel Widget</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.dashboard.showPerformanceWidget}
              onChange={(e) =>
                handleDashboardChange("showPerformanceWidget", e.target.checked)
              }
              className="h-4 w-4"
            />
            <span>Show Performance Widget</span>
          </label>
        </div>
      </section>

      <section className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notification.enableNotifications}
              onChange={(e) =>
                handleNotificationChange(
                  "enableNotifications",
                  e.target.checked
                )
              }
              className="h-4 w-4"
            />
            <span>Enable Notifications</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notification.emailAlerts}
              onChange={(e) =>
                handleNotificationChange("emailAlerts", e.target.checked)
              }
              className="h-4 w-4"
            />
            <span>Email Alerts</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notification.smsAlerts}
              onChange={(e) =>
                handleNotificationChange("smsAlerts", e.target.checked)
              }
              className="h-4 w-4"
            />
            <span>SMS Alerts</span>
          </label>
        </div>
      </section>

      <section className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.security.twoFactorEnabled}
              onChange={(e) =>
                handleSecurityChange("twoFactorEnabled", e.target.checked)
              }
              className="h-4 w-4"
            />
            <span>Enable Two-Factor Authentication</span>
          </div>
          {settings.security.twoFactorEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number for 2FA
              </label>
              <input
                type="text"
                value={settings.security.phoneNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleSecurityChange("phoneNumber", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
