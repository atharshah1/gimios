import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({ baseURL: BASE_URL });

export function setAuthToken(token: string) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const adminApi = {
  listGyms: () => api.get("/admin/gyms"),
  activateTrial: (gymId: string) => api.post(`/admin/gyms/${gymId}/activate-trial`),
  stats: () => api.get("/admin/stats"),
};
