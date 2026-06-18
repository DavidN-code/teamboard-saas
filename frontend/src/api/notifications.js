import api from "./axios";

export const getNotifications = () => {
  return api.get("/notifications");
};

export const markNotificationRead = (id) => {
  return api.put(`/notifications/${id}/read`);
};