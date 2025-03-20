// src/types/auth.ts

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
  avatar?: string;
  twoFactorEnabled?: boolean;
  phone?: string;
}

export interface RegistrationRequest {
  username: string;
  password: string;
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  // Optionally, confirmNewPassword is not sent to the backend if it equals newPassword.
  confirmNewPassword?: string;
}

export interface PasswordResetRequest {
  email: string;
  newPassword: string;
}

export interface UserUpdateRequest {
  username: string;
  email: string;
}

export interface AdminDashboardDTO {
  averageSpeed?: number;
  averageAoa?: number;
  averageVibration?: number;
  averageVerticalForceLeft?: number;
  averageVerticalForceRight?: number;
  averageLateralForceLeft?: number;
  averageLateralForceRight?: number;
  averageLateralVibrationLeft?: number;
  averageLateralVibrationRight?: number;
  alertHistory?: unknown[]; // Adjust type as needed
  systemStatus?: string;
}
