import api from "./axios";

export const getTaskActivity = (taskId) => {
  return api.get(`/audit-logs/task/${taskId}`);
};