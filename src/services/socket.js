import { io } from "socket.io-client";
import { API_URL } from "../Utils/constants";

//create a socket connections for different namespaces

export const projectChatSocket = (projectId, userId, type) => {
  const socket = io(`${API_URL}/chatSocket`, {
    withCredentials: true,
    query: {
      projectId,
      userId,
      type,
    },
  });

  // Add support for joining custom rooms
  socket.on("connect", () => {
    console.log(`Socket connected: ${socket.id}`);

    // Join project room if projectId is provided
    if (projectId) {
      socket.emit("joinRoom", `project_${projectId}`);
    }

    // Join user-specific room
    if (userId) {
      socket.emit("joinRoom", `user_${userId}`);
    }
  });

  return socket;
};

// export const chatSocket = (receiverid) => {
//   return io(`${API_URL}/chatSocket`, {
//     withCredentials: true,
//     query: {
//       receiverid,
//     },
//   });
// };

export const notificationSocket = (userId) => {
  return io(`${API_URL}/notification`, {
    withCredentials: true,
    query: {
      userId,
    },
  });
};

export const userStatusSocket = (userId) => {
  return io(`${API_URL}/user-status`, {
    withCredentials: true,
    query: {
      userId,
    },
  });
};
