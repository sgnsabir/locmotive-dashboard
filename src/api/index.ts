// src/api/index.ts

import {
  LoginResponse,
  AlertResponse,
  PerformanceDTO,
  PredictiveMaintenanceResponse,
  HistoricalDataResponse,
  TrackConditionDTO,
  VirtualAssetDTO,
} from "../types/apiTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// Generic API fetch function with token injection and error handling
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.error(e);
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// API Functions

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
  localStorage.removeItem("authToken");
  localStorage.removeItem("username");
}

export async function getAlerts(): Promise<AlertResponse[]> {
  return apiFetch<AlertResponse[]>("/alerts");
}

export async function getPerformanceData(
  startDate: string,
  endDate: string
): Promise<PerformanceDTO[]> {
  const endpoint = `/performance?startDate=${encodeURIComponent(
    startDate
  )}&endDate=${encodeURIComponent(endDate)}`;
  return apiFetch<PerformanceDTO[]>(endpoint);
}

export async function getPredictiveMaintenance(
  analysisId: number,
  alertEmail: string = "alerts@example.com"
): Promise<PredictiveMaintenanceResponse> {
  const endpoint = `/predictive/${analysisId}?alertEmail=${encodeURIComponent(
    alertEmail
  )}`;
  return apiFetch<PredictiveMaintenanceResponse>(endpoint);
}

export async function getHistoricalData(
  analysisId: number
): Promise<HistoricalDataResponse> {
  const endpoint = `/dashboard/historical/${analysisId}`;
  return apiFetch<HistoricalDataResponse>(endpoint);
}

export async function getTrackConditionData(
  trainNo: number,
  startDate: string,
  endDate: string
): Promise<TrackConditionDTO[]> {
  const endpoint = `/track?trainNo=${trainNo}&startDate=${encodeURIComponent(
    startDate
  )}&endDate=${encodeURIComponent(endDate)}`;
  return apiFetch<TrackConditionDTO[]>(endpoint);
}

export async function getDigitalTwinState(
  assetId: number
): Promise<VirtualAssetDTO> {
  const endpoint = `/digital-twin/${assetId}`;
  return apiFetch<VirtualAssetDTO>(endpoint);
}

// Re-export type definitions so other modules can import them from "@/api"
export type {
  SensorMetricsDTO,
  VirtualAssetDTO,
  LoginResponse,
  AlertResponse,
  PerformanceDTO,
  PredictiveMaintenanceResponse,
  HistoricalDataResponse,
  TrackConditionDTO,
} from "../types/apiTypes";

// Assign API functions to a named constant to fix the anonymous default export rule.
const api = {
  login,
  logout,
  getAlerts,
  getPerformanceData,
  getPredictiveMaintenance,
  getHistoricalData,
  getTrackConditionData,
  getDigitalTwinState,
};

export default api;
