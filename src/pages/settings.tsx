// pages/settings.tsx

import React, { FC, useState } from "react";

interface GeneralSettings {
  username: string;
  email: string;
  avatarUrl: string;
}

interface DashboardSettings {
  showSpeedWidget: boolean;
  showFuelWidget: boolean;
  showPerformanceWidget: boolean;
}

interface NotificationSettings {
  enableNotifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  phoneNumber: string;
}

interface SettingsState {
  general: GeneralSettings;
  dashboard: DashboardSettings;
  notification: NotificationSettings;
  security: SecuritySettings;
}

const initialSettings: SettingsState = {
  general: {
    username: "John Doe",
    email: "john@example.com",
    avatarUrl: "/images/default-avatar.png",
  },
  dashboard: {
    showSpeedWidget: true,
    showFuelWidget: true,
    showPerformanceWidget: true,
  },
  notification: {
    enableNotifications: true,
    emailAlerts: true,
    smsAlerts: false,
  },
  security: {
    twoFactorEnabled: false,
    phoneNumber: "",
  },
};

const Settings: FC = () => {
  const [settings, setSettings] = useState<SettingsState>(initialSettings);

  const handleGeneralChange = (field: keyof GeneralSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, [field]: value },
    }));
  };

  const handleDashboardChange = (
    field: keyof DashboardSettings,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      dashboard: { ...prev.dashboard, [field]: value },
    }));
  };

  const handleNotificationChange = (
    field: keyof NotificationSettings,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      notification: { ...prev.notification, [field]: value },
    }));
  };

  const handleSecurityChange = (
    field: keyof SecuritySettings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, [field]: value },
    }));
  };

  const handleSave = () => {
    // In real app, dispatch or call API
    console.log("Settings saved:", settings);
    alert("Settings saved (mock)!");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings & Configurations</h1>

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
              onChange={(e) => handleGeneralChange("username", e.target.value)}
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
              onChange={(e) => handleGeneralChange("email", e.target.value)}
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
              onChange={(e) => handleGeneralChange("avatarUrl", e.target.value)}
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
                onChange={(e) =>
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
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
