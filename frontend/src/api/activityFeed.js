import api from "./axios";

export const getActivityFeed = () => {
  return api.get("/activity-feed");
};