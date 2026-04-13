import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({ baseURL: BASE_URL });

export function setAuthToken(token: string) {
  if (!token) {
    delete api.defaults.headers.common["Authorization"];
    return;
  }
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const gymApi = {
  get: (gymId: string) => api.get(`/gyms/${gymId}`),
  update: (gymId: string, data: object) => api.patch(`/gyms/${gymId}`, data),
};

export const hrmsApi = {
  listTrainers: () => api.get("/hrms/"),
  addTrainer: (data: object) => api.post("/hrms/", data),
  deactivate: (id: string) => api.delete(`/hrms/${id}`),
};

export const usersApi = {
  list: () => api.get("/users/"),
  create: (data: object) => api.post("/users/", data),
};

export const timeslotApi = {
  list: () => api.get("/timeslots/"),
  create: (data: object) => api.post("/timeslots/", data),
  delete: (id: string) => api.delete(`/timeslots/${id}`),
};

export const attendanceApi = {
  list: () => api.get("/attendance/"),
  mark: (data: object) => api.post("/attendance/", data),
};
