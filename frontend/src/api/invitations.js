import api from "./axios";


export const resendInvitation = (id) => {
  return api.put(`/invitations/${id}/resend`);
};