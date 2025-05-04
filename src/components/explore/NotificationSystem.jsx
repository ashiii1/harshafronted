import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Utils/constants";
import {
  Bell,
  X,
  Check,
  MessageSquare,
  Users,
  Briefcase,
  DollarSign,
  Handshake,
  Play,
  Lightbulb,
  Award,
  FileText,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications on component mount and set up polling
  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        withCredentials: true,
      });

      if (response.data?.notifications) {
        setNotifications(response.data.notifications);

        // Count unread notifications
        const unread = response.data.notifications.filter(
          (notif) => !notif.read
        ).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${API_URL}/notifications/mark-all-read`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        withCredentials: true,
      });

      // Update local state
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );

      // Update unread count if needed
      const isUnread =
        notifications.find((n) => n.id === notificationId)?.read === false;
      if (isUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "interaction_new":
        return <MessageSquare size={18} className="text-blue-400" />;
      case "interaction_accepted":
        return <Check size={18} className="text-green-400" />;
      case "interaction_rejected":
        return <X size={18} className="text-red-400" />;
      case "content_upvote":
        return <Handshake size={18} className="text-emerald-400" />;
      case "content_comment":
        return <MessageSquare size={18} className="text-purple-400" />;
      case "investment_interest":
        return <DollarSign size={18} className="text-yellow-400" />;
      case "mentor_request":
        return <Award size={18} className="text-blue-400" />;
      case "demo_request":
        return <Play size={18} className="text-cyan-400" />;
      case "connection_request":
        return <Users size={18} className="text-indigo-400" />;
      case "resource_share":
        return <FileText size={18} className="text-orange-400" />;
      case "partnership_offer":
        return <Briefcase size={18} className="text-pink-400" />;
      case "system":
        return <AlertCircle size={18} className="text-gray-400" />;
      default:
        return <Bell size={18} className="text-gray-400" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        className="relative p-2 rounded-full hover:bg-[#1a2236] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-[#1a2236] to-[#0d1117] rounded-lg shadow-lg overflow-hidden z-50 border border-indigo-900/30">
          <div className="p-3 border-b border-indigo-900/30 flex justify-between items-center">
            <h3 className="font-medium text-white flex items-center">
              <Bell size={16} className="mr-2 text-blue-400" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300"
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader className="animate-spin text-blue-500 mb-2" size={24} />
                <p className="text-gray-400 text-sm">
                  Loading notifications...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-6 px-4">
                <AlertCircle className="text-red-400 mb-2" size={24} />
                <p className="text-gray-300 text-sm">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto text-gray-500 mb-2" size={24} />
                <p className="text-gray-300">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  You'll be notified when someone interacts with your content
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-indigo-900/20 hover:bg-[#121a2d] transition-colors ${
                    !notification.read ? "bg-blue-900/10" : ""
                  }`}
                >
                  <div className="flex">
                    <div className="mr-3">
                      <div className="p-2 rounded-full bg-[#0d1117]">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p
                          className={`text-sm ${
                            !notification.read
                              ? "font-medium text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <div className="flex">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-blue-400 hover:text-blue-300"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-red-400 hover:text-red-300 ml-1"
                            title="Delete"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center"
                          onClick={() => markAsRead(notification.id)}
                        >
                          {notification.actionText || "View details"}
                          <ChevronRight size={14} />
                        </Link>
                      )}
                      <div className="mt-1 text-xs text-gray-500">
                        {getTimeAgo(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-[#121a2d] p-3 text-center border-t border-indigo-900/20">
            <Link
              to="/notifications"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
