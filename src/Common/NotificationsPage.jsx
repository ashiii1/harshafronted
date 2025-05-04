import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Utils/constants";
import {
  setNotifications,
  setLoading,
  setError,
  markAsRead,
  markAllAsRead,
} from "../Utils/notificationSlice";
import {
  Bell,
  User,
  UserCheck,
  Clock,
  Filter,
  X,
  CheckCircle,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: notifications,
    loading,
    error,
  } = useSelector((state) => state.notifications);

  // Local state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    showFilters: false,
  });
  const [deleting, setDeleting] = useState({});

  // Notification types for filtering
  const notificationTypes = [
    { value: "", label: "All" },
    { value: "friend_request", label: "Connection Requests" },
    { value: "CONNECTION_ACCEPTED", label: "Accepted Connections" },
    { value: "system", label: "System" },
    { value: "message", label: "Messages" },
  ];

  // Fetch notifications when page loads or filters change
  useEffect(() => {
    fetchNotifications();
  }, [page, filters.type]);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      dispatch(setLoading());

      // Build query params
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 10);
      if (filters.type) {
        params.append("type", filters.type);
      }

      const response = await axios.get(
        `${API_URL}/notifications?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        dispatch(setNotifications(response.data));
        // Set pagination info
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      dispatch(setError("Failed to load notifications"));
    }
  };

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(markAsRead(notificationId));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/mark-all-read`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(markAllAsRead());
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Handle deleting a notification
  const handleDeleteNotification = async (notificationId) => {
    setDeleting((prev) => ({ ...prev, [notificationId]: true }));
    try {
      const response = await axios.delete(
        `${API_URL}/notifications/${notificationId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        // Refresh notifications after deletion
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    } finally {
      setDeleting((prev) => ({ ...prev, [notificationId]: false }));
    }
  };

  // Handle notification click (navigation)
  const handleNotificationClick = async (notification) => {
    // If not read, mark as read
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }

    // Check if the related entity is available
    if (notification.relatedId && notification.relatedId.unavailable) {
      // If the related entity is unavailable, just mark as read but don't navigate
      toast.error("The related content is no longer available", {
        duration: 3000,
      });
      return;
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "friend_request":
        navigate("/connections");
        break;
      case "CONNECTION_ACCEPTED":
        navigate("/connections");
        break;
      case "message":
        if (notification.sender?._id) {
          navigate(`/chat/${notification.sender._id}`);
        } else {
          navigate("/chat");
        }
        break;
      case "project_update":
      case "project_invitation":
        if (notification.relatedId?._id) {
          navigate(`/collaboration/projects/${notification.relatedId._id}`);
        } else {
          navigate("/collaboration");
        }
        break;
      default:
        // No navigation needed
        break;
    }
  };

  // Format time function
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than a minute
    if (diff < 60000) {
      return "Just now";
    }

    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // Less than a week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }

    // Format as date
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Get appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "friend_request":
        return <User className="h-5 w-5 text-blue-500" />;
      case "CONNECTION_ACCEPTED":
        return <UserCheck className="h-5 w-5 text-green-500" />;
      case "message":
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Filter handlers
  const handleFilterChange = (type) => {
    setFilters({ ...filters, type });
    setPage(1); // Reset to first page on filter change
  };

  const toggleFilters = () => {
    setFilters({ ...filters, showFilters: !filters.showFilters });
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Stay updated with your connections and activities
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={toggleFilters}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All As Read
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {filters.showFilters && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">
                  Filter Notifications
                </h3>
                <button
                  onClick={toggleFilters}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {notificationTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange(type.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                      filters.type === type.value
                        ? "bg-orange-100 text-orange-700 border border-orange-200"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notifications List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md">
                You don't have any notifications at the moment. Check back later
                or interact with other users to receive notifications.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`py-4 ${
                      !notification.isRead ? "bg-orange-50" : ""
                    } hover:bg-gray-50 transition-colors rounded-lg mb-1`}
                  >
                    <div className="flex items-start px-4">
                      <div className="flex-shrink-0 pt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div
                        className={`ml-3 flex-1 ${
                          notification.relatedId?.unavailable
                            ? "cursor-not-allowed opacity-75"
                            : "cursor-pointer"
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <p
                          className={`text-sm ${
                            !notification.isRead
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                          {notification.relatedId?.unavailable && (
                            <span className="ml-1 text-xs text-red-500 italic">
                              (Content unavailable)
                            </span>
                          )}
                        </p>
                        <div className="mt-1 flex items-center">
                          {notification.sender && (
                            <div className="flex items-center">
                              <img
                                src={
                                  notification.sender.profileImageUrl ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    notification.sender.firstName || "User"
                                  )}`
                                }
                                alt="User"
                                className="h-5 w-5 rounded-full mr-1"
                              />
                              <span className="text-xs text-gray-500 mr-2">
                                {notification.sender.firstName || ""}{" "}
                                {notification.sender.lastName || ""}
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification._id)
                          }
                          className="p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none"
                          disabled={deleting[notification._id]}
                        >
                          {deleting[notification._id] ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 border-t border-gray-200 pt-4">
              <div className="flex-1 flex justify-between items-center">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                    page === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  } border border-gray-300`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                    page === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  } border border-gray-300`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
