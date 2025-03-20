export interface GeneralSettings {
  username: string;
  email: string;
  avatarUrl: string;
}

export interface DashboardSettings {
  showSpeedWidget: boolean;
  showFuelWidget: boolean;
  showPerformanceWidget: boolean;
}

export interface NotificationSettings {
  enableNotifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  phoneNumber: string;
}

export interface UserSettings {
  general: GeneralSettings;
  dashboard: DashboardSettings;
  notification: NotificationSettings;
  security: SecuritySettings;
}
