import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  addNotification,
  setNotifications,
  setLoading,
} from "../Utils/notificationSlice";
import { API_URL } from "../Utils/constants";
import { toast } from "react-hot-toast";
import axios from "axios";

const NotificationManager = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);

  // Fetch initial notifications on component mount
  useEffect(() => {
    if (user?._id) {
      fetchInitialNotifications();
    }
  }, [user?._id]);

  // Function to fetch notifications from database
  const fetchInitialNotifications = async () => {
    try {
      dispatch(setLoading());
      const response = await axios.get(`${API_URL}/notifications`, {
        withCredentials: true,
      });

      // Store notifications in Redux
      if (response.data) {
        dispatch(setNotifications(response.data));
        console.log("Initial notifications loaded:", response.data);
      }
    } catch (error) {
      console.error("Error fetching initial notifications:", error);
    }
  };

  useEffect(() => {
    if (!user?._id) return; // Don't connect if no user

    console.log("Setting up notification socket with user ID:", user._id);

    // Connect to the notification socket
    const socket = io(`${API_URL.replace("/api", "")}`, {
      path: "/socket.io",
      withCredentials: true,
      query: {
        userId: user._id,
      },
    });

    // Listen for connection event
    socket.on("connect", () => {
      console.log("Connected to notification socket with ID:", socket.id);

      // Join a room with the user's ID
      socket.emit("joinRoom", user._id);
      console.log("Joined notification room for user:", user._id);
    });

    // Listen for new notifications
    socket.on("newNotification", (data) => {
      console.log("New notification received:", data);

      // Determine if notification is nested or direct
      const notification = data.notification || data;

      // Add the notification to the Redux store
      if (notification) {
        try {
          // Check if the notification has valid data before adding to Redux
          if (notification._id) {
            dispatch(addNotification(notification));

            // Show a toast notification
            const notificationType = notification.type;
            let title = "New Notification";
            let message = notification.message || "You have a new notification";

            // Customize notification display based on type
            if (notificationType === "friend_request") {
              title = "New Connection Request";
            } else if (notificationType === "CONNECTION_ACCEPTED") {
              title = "Connection Accepted";
            } else if (notificationType === "project_update") {
              title = "Project Update";
            } else if (notificationType === "project_invitation") {
              title = "Project Invitation";
            } else if (notificationType === "collaboration") {
              title = "Project Collaboration";
            }

            // Show a toast notification
            toast(
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm">{message}</p>
              </div>,
              {
                duration: 5000,
                position: "top-right",
                className:
                  "bg-white shadow-md rounded-md p-4 border-l-4 border-orange-500",
              }
            );
          } else {
            console.warn("Received notification without ID, skipping:", data);
          }
        } catch (error) {
          console.error("Error processing notification:", error);
        }
      }
    });

    // Handle disconnection and errors
    socket.on("disconnect", () => {
      console.log("Disconnected from notification socket");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Clean up function
    return () => {
      socket.disconnect();
    };
  }, [dispatch, user?._id]);

  // This component doesn't render anything
  return null;
};

export default NotificationManager;
