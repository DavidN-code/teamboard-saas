import api from "./axios";

export const getComments = (taskId) => {
  return api.get(`/comments/task/${taskId}`);
};

export const createComment = (data) => {
  return api.post("/comments", data);
};

export const updateComment = (id, data) => {
  return api.put(`/comments/${id}`, data);
};

export const deleteComment = (id) => {
  return api.delete(`/comments/${id}`);
};