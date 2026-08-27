import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// --- JWT token management ---
const TOKEN_KEY = 'geoshield_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token so user is logged out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken();
      // Only redirect if not already on login (avoid redirect loops)
      if (!window.location.pathname.includes('/login')) {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export interface Station {
  id: number;
  station_id: string;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  district: string;
  village: string;
  elevation: number;
  slope_angle: number;
  soil_type: string;
  vegetation_cover: number;
  is_active: boolean;
  latest_reading: {
    rainfall_mm: number;
    soil_moisture: number;
    ground_displacement: number;
    timestamp: string;
  } | null;
  risk: {
    level: string;
    score: number;
    probability: number;
  } | null;
}

export interface DashboardStats {
  total_stations: number;
  active_stations: number;
  risk_distribution: {
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  active_alerts: number;
  pending_reports: number;
  recent_reports_24h: number;
  road_status: {
    open: number;
    partially_blocked: number;
    blocked: number;
  };
  affected_population: number;
  total_villages: number;
  high_risk_villages: number;
  average_risk_score: number;
  last_updated: string;
}

export interface Alert {
  id: number;
  station_id: string;
  risk_level: string;
  title: string;
  message: string;
  status: string;
  affected_population: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  risk_score: number;
  risk_level: string;
  station_name: string;
  station_id: string;
  state: string;
  district: string;
}

export interface Road {
  id: number;
  road_name: string;
  road_type: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  status: string;
  blockage_reason: string | null;
  alternative_route: string | null;
}

export interface Village {
  id: number;
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  population: number;
  risk_zone: string;
  nearest_hospital_km: number;
  nearest_police_km: number;
}

export interface Report {
  id: number;
  report_type: string;
  description: string;
  latitude: number;
  longitude: number;
  image_path: string | null;
  reporter_name: string | null;
  status: string;
  created_at: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall_1h: number;
  rainfall_24h: number;
  rainfall_7d: number;
  wind_speed: number;
  wind_direction: number;
  pressure: number;
  visibility: number;
  forecast_rainfall_24h: number;
  forecast_rainfall_48h: number;
  timestamp: string;
}

// Auth
export const loginAPI = (email: string, password: string) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  return api.post<{ token: string; user: { email: string; name: string; role: string } }>(
    '/auth/login',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

// Dashboard
export const getDashboardStats = () => api.get<DashboardStats>('/dashboard/stats');
export const getRiskHeatmap = () => api.get<HeatmapPoint[]>('/dashboard/risk-heatmap');
export const getRainfallTrend = () => api.get<{ timestamp: string; avg_rainfall: number }[]>('/dashboard/rainfall-trend');
export const getRiskTrend = () => api.get<{ timestamp: string; avg_risk: number }[]>('/dashboard/risk-trend');
export const getStateSummary = () => api.get<{ state: string; stations: number; avg_risk_score: number; critical_count: number }[]>('/dashboard/state-summary');

// Sensors
export const getStations = () => api.get<Station[]>('/sensors/stations');
export const getStation = (id: string) => api.get(`/sensors/stations/${id}`);
export const getStationHistory = (id: string, hours = 24) => api.get(`/sensors/stations/${id}/history?hours=${hours}`);

// Alerts
export const getAlerts = (params?: { status?: string; risk_level?: string }) =>
  api.get<Alert[]>('/alerts', { params });
export const getActiveAlerts = () => api.get<Alert[]>('/alerts/active');
export const getAlertStats = () => api.get<{ total: number; active: number; acknowledged: number; resolved: number; critical_active: number; high_active: number }>('/alerts/stats');
export const acknowledgeAlert = (id: number) => api.put(`/alerts/${id}/acknowledge`);
export const resolveAlert = (id: number) => api.put(`/alerts/${id}/resolve`);

// Reports
export const getReports = (params?: { status?: string }) => api.get<Report[]>('/reports', { params });
export const submitReport = (formData: FormData) => api.post('/reports', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Roads & Villages
export const getRoads = () => api.get<Road[]>('/roads');
export const getVillages = (riskZone?: string) => api.get<Village[]>('/villages', { params: riskZone ? { risk_zone: riskZone } : {} });

// Weather
export const getWeather = (stationId: string) => api.get<{ data: WeatherData }>(`/weather/${stationId}`);

// Simulator
export interface SimulationResult {
  status: string;
  simulation: {
    station: { id: string; name: string; state: string; district: string };
    intensity: string;
    sensor_reading: { rainfall_mm: number; soil_moisture: number; ground_displacement: number; pore_pressure: number };
  };
  risk_assessment: {
    risk_score: number;
    risk_level: string;
    landslide_probability: number;
    contributing_factors: string[];
    time_window_hours: number;
    recommendation: string;
  };
  alert: {
    id: number;
    title: string;
    affected_population: number;
  } | null;
}
export const simulateLandslide = (data: { station_id?: string; intensity?: string }) =>
  api.post<SimulationResult>('/simulate/landslide', data);
export const simulateBatch = (count: number = 5) =>
  api.post(`/simulate/batch?count=${count}`);

// Satellite
export interface SatelliteStation {
  id: string;
  name: string;
  state: string;
  real_elevation: number;
  real_soil_moisture_0_7cm: number;
  real_soil_moisture_7_28cm: number;
  real_soil_moisture_28_100cm: number;
  real_soil_temperature: number;
  real_rainfall_current: number;
  real_rainfall_24h: number;
  real_rainfall_7d: number;
  real_temperature: number;
  real_humidity: number;
  real_wind_speed: number;
  estimated_ndvi: number;
}
export interface SatelliteSummary {
  total_stations: number;
  elevation: { min: number; max: number; avg: number; unit: string };
  soil_moisture_surface: { min: number; max: number; avg: number; unit: string };
  rainfall_24h: { min: number; max: number; avg: number; total: number; unit: string };
  rainfall_7d: { min: number; max: number; avg: number; total: number; unit: string };
  ndvi: { min: number; max: number; avg: number; description: string };
  temperature: { min: number; max: number; avg: number; unit: string };
  humidity: { min: number; max: number; avg: number; unit: string };
  data_source: string;
}
export const getSatelliteData = () => api.get<{ stations: SatelliteStation[]; total_stations: number }>('/satellite/data');
export const getStationSatelliteData = (id: string) => api.get<SatelliteStation>(`/satellite/data/${id}`);
export const getSatelliteSummary = () => api.get<SatelliteSummary>('/satellite/summary');

export default api;
