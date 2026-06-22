import api from "./axios";

export const getDashboardMetrics = () => {
  return api.get("/metrics/dashboard");
};