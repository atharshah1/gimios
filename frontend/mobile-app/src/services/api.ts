import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({ baseURL: BASE_URL });

export function setAuthToken(token: string) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", new URLSearchParams({ username: email, password })),
  refresh: (token: string) => api.post("/auth/refresh", { token }),
  me: () => api.get("/users/me"),
};

export const workoutApi = {
  list: () => api.get("/workouts/"),
};

export const attendanceApi = {
  list: () => api.get("/attendance/"),
};

export const wearableApi = {
  sync: (data: { date: string; steps: number; calories: number; source: string }) =>
    api.post("/wearable/sync", data),
  list: () => api.get("/wearable/"),
};
