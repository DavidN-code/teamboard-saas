import Pusher from "pusher-js";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5050";

const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,

  channelAuthorization: {
    endpoint: `${API_URL}/pusher/auth`,
    transport: "ajax",

    headersProvider: () => ({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
  },
});

export default pusher;