import api from "./axios";

export const getActivityFeed = (boardId) => {
  return api.get("/activity-feed", {
    params: {
      boardId,
    },
  });
};