import axios from "axios";

// ─── Base URL ─────────────────────────────────────────────────────────────────
// Change this to your Spring Boot server URL when ready
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sc_token");
      localStorage.removeItem("sc_volunteer");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  register: (data) =>
    api.post("/volunteer/register", data),

  logout: () =>
    api.post("/auth/logout"),
};

// ─── Volunteer Profile ─────────────────────────────────────────────────────────
export const volunteerAPI = {
  getProfile: () =>
    api.get("/volunteer/profile"),

  updateProfile: (data) =>
    api.put("/volunteer/profile", data),

  updateAvailability: (availability) =>
    api.put("/volunteer/availability", availability),

  getStats: () =>
    api.get("/volunteer/stats"),

  getCertificates: () =>
    api.get("/volunteer/certificates"),

  getRatings: () =>
    api.get("/volunteer/ratings"),
};

// ─── Requests ─────────────────────────────────────────────────────────────────
export const requestsAPI = {
  getIncoming: () =>
    api.get("/requests/incoming"),

  getActive: () =>
    api.get("/requests/active"),

  getHistory: () =>
    api.get("/requests/history"),

  accept: (id) =>
    api.post(`/requests/${id}/accept`),

  decline: (id) =>
    api.post(`/requests/${id}/decline`),

  complete: (id) =>
    api.post(`/requests/${id}/complete`),

  downloadMaterial: (requestId, filename) =>
    api.get(`/requests/${requestId}/materials/${filename}`, {
      responseType: "blob",
    }),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () =>
    api.get("/notifications"),

  markRead: (id) =>
    api.put(`/notifications/${id}/read`),

  markAllRead: () =>
    api.put("/notifications/read-all"),
};

export default api;
