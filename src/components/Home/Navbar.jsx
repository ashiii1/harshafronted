import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { navItems } from "../../Utils/constants";
import { removeUser } from "../../Utils/userSlice";
import { incrementUnreadCount, resetUnreadCount } from "../../Utils/chatSlice";
import {
  LogOut,
  ChevronDown,
  MessageSquare,
  Menu,
  X,
  Bell,
  User,
  Clock,
  UserCheck,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { userLogout } from "../../apiServices";
import axios from "axios";
import { API_URL } from "../../Utils/constants";
import {
  setNotifications,
  setLoading,
  setError,
  addNotification,
  markAsRead,
  markAllAsRead,
} from "../../Utils/notificationSlice";
import { projectChatSocket } from "../../Services/socket.js";

// --- Notification Dropdown Component ---
const NotificationDropdown = ({ closeDropdown }) => {
  const dispatch = useDispatch();
  const {
    items: notifications,
    unreadCount,
    loading,
  } = useSelector((state) => state.notifications);
  const navigate = useNavigate();

  // Function to format timestamps
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
    return date.toLocaleDateString();
  };

  // Function to handle notification click
  const handleNotificationClick = async (notification) => {
    // If not read, mark as read
    if (!notification.isRead) {
      try {
        await axios.put(
          `${API_URL}/notifications/${notification._id}/read`,
          {},
          {
            withCredentials: true,
          }
        );
        dispatch(markAsRead(notification._id));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "friend_request":
        navigate("/connections");
        break;
      case "CONNECTION_ACCEPTED":
        navigate("/connections");
        break;
      default:
        navigate("/notifications");
        break;
    }

    closeDropdown();
  };

  // Get appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "friend_request":
        return <User className="h-4 w-4 text-blue-500" />;
      case "CONNECTION_ACCEPTED":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(
        `${API_URL}/notifications/mark-all-read`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(markAllAsRead());
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div
      className="absolute right-0 mt-2 w-72 sm:w-80 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="notification-menu-button"
      tabIndex="-1"
    >
      <div className="p-2 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800 px-2">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-orange-100 text-orange-800 text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-orange-600 hover:text-orange-800 px-2"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="py-1 max-h-80 overflow-y-auto" role="none">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <Clock className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <button
              key={notification._id}
              className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                !notification.isRead ? "bg-orange-50" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start">
                <span className="flex-shrink-0 mt-0.5 mr-3">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      !notification.isRead ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="ml-2 bg-orange-500 w-2 h-2 rounded-full flex-shrink-0"></span>
                )}
              </div>
            </button>
          ))
        ) : (
          <p className="px-4 py-3 text-sm text-gray-500 text-center">
            No notifications to display.
          </p>
        )}
      </div>
      <div className="border-t border-gray-100 p-2">
        <Link
          to="/notifications"
          className="block w-full text-center px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
          role="menuitem"
          tabIndex="-1"
          onClick={closeDropdown}
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
};

// --- Updated NavbarChat ---
const NavbarChat = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.user);
  const unreadCount = useSelector((state) => state.chat.unreadCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Listen for new messages via socket
  useEffect(() => {
    if (!user?._id) return;

    // Set up socket for message notifications
    const socket = projectChatSocket(null, user._id, "notification");

    const handleNewMessage = (message) => {
      // Increment unread count
      dispatch(incrementUnreadCount());
    };

    socket.on("receivePrivateMessage", handleNewMessage);

    return () => {
      socket.off("receivePrivateMessage", handleNewMessage);
      socket.disconnect();
    };
  }, [user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click target is outside the dropdown itself
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if the click target is NOT the button that opens the dropdown
        const button = dropdownRef.current.querySelector("button");
        if (button && !button.contains(event.target)) {
          setShowDropdown(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // Empty dependency array

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  const handleChatClick = () => {
    navigate("/chat");
    closeDropdown();
    // Reset unread count when navigating to chat
    dispatch(resetUnreadCount());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-label="Messages"
        id="chat-menu-button" // Added ID for aria-labelledby
        aria-haspopup="true"
        aria-expanded={showDropdown}
        onClick={toggleDropdown}
        className="relative p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
        {unreadCount > 0 && (
          // Show count badge for unread messages
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {/* Simple dropdown with just a link to messages */}
      <div
        className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transition ease-out duration-100 z-50 ${
          showDropdown
            ? "transform opacity-100 scale-100"
            : "transform opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {showDropdown && (
          <div className="py-1" role="menu" aria-labelledby="chat-menu-button">
            <button
              onClick={handleChatClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              View Messages {unreadCount > 0 && `(${unreadCount} new)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Updated NavbarNotification ---
const NavbarNotification = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown]);

  // Fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      dispatch(setLoading());
      const response = await axios.get(`${API_URL}/notifications`, {
        withCredentials: true,
      });
      dispatch(setNotifications(response.data));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      dispatch(setError("Failed to load notifications"));
    }
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="relative p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
        id="notification-menu-button"
        aria-expanded="false"
        aria-haspopup="true"
        onClick={toggleDropdown}
      >
        <span className="sr-only">View notifications</span>
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/4 bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && <NotificationDropdown closeDropdown={closeDropdown} />}
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    userLogout()
      .then(() => {
        dispatch(removeUser());
        navigate("/signin");
        setShowProfileMenu(false); // Ensure profile menu closes on logout
        setShowMobileMenu(false); // Ensure mobile menu closes on logout
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        // Maybe show error to user
      });
  };

  // Combined useEffect for closing menus/dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close Profile Menu
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        // Ensure click wasn't on the profile button itself
        const profileButton = profileMenuRef.current.querySelector("button");
        if (profileButton && !profileButton.contains(event.target)) {
          setShowProfileMenu(false);
        }
      }
      // Close Mobile Menu
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('[aria-label*="main menu"]') // Ensure clicking menu button itself doesn't close it
      ) {
        setShowMobileMenu(false);
      }
      // Note: Notification/Chat dropdowns handle their own outside clicks
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array: runs once on mount, cleans up on unmount

  // --- Render Logic (Uses updated NavbarNotification/Chat) ---
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/home" className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Innov<span className="text-gray-900">8</span>mate
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            {user && (
              <div className="flex items-center space-x-1">
                <NavbarNotification />
                <NavbarChat />
              </div>
            )}
            <button
              type="button"
              className="ml-2 p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle main menu"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            <ul className="flex space-x-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`px-2.5 sm:px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
                      location.pathname === item.path ||
                      (item.path !== "/home" &&
                        location.pathname.startsWith(item.path))
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side: Icons, Profile/Auth */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
            {/* --- Notification and Chat Icons (Desktop) --- */}
            {user && (
              <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
                <NavbarNotification />
                <NavbarChat />
              </div>
            )}

            {/* --- Profile Menu / Auth Buttons (Desktop) --- */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    className="flex items-center space-x-1.5 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={showProfileMenu}
                  >
                    <img
                      src={
                        user.profileImageUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          // Ensure name is encoded
                          user.firstName || user.username || "User" // Added default 'User'
                        )}&background=random`
                      }
                      alt="User Avatar"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200"
                    />
                    <ChevronDown
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 ${
                        showProfileMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown with Transition */}
                  <div
                    className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 ${
                      showProfileMenu
                        ? "transform opacity-100 scale-100"
                        : "transform opacity-0 scale-95 pointer-events-none"
                    }`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p
                          className="text-sm font-semibold text-gray-800 truncate"
                          role="none"
                        >
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username || "User"}{" "}
                          {/* Added default */}
                        </p>
                        <p
                          className="text-xs text-gray-500 truncate"
                          role="none"
                        >
                          {user.email || "No email provided"}
                        </p>
                      </div>
                      {/* Links */}
                      <Link
                        to={`/profile/${user._id}`}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                        tabIndex="-1"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        {" "}
                        View Profile{" "}
                      </Link>
                      <Link
                        to="/settings" // TODO: Verify settings route
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                        tabIndex="-1"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        {" "}
                        Settings{" "}
                      </Link>
                      {/* Logout Button */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                        role="menuitem"
                        tabIndex="-1"
                      >
                        <LogOut
                          className="inline w-4 h-4 mr-2"
                          aria-hidden="true"
                        />{" "}
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Auth Buttons (Not logged in)
                <div className="flex items-center space-x-2">
                  <Link to="/signin">
                    <button className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition-opacity shadow-sm">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden transition-all duration-200 ease-in-out overflow-hidden ${
          showMobileMenu ? "max-h-screen pb-4" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path ||
                (item.path !== "/home" &&
                  location.pathname.startsWith(item.path))
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Auth/Profile Section */}
        {user ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-3">
              <div className="flex-shrink-0">
                <img
                  src={
                    user.profileImageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.firstName || user.username || "User"
                    )}&background=random`
                  }
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username || "User"}
                </div>
                <div className="text-sm font-medium text-gray-500 truncate max-w-[200px]">
                  {user.email || "No email provided"}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <Link
                to={`/profile/${user._id}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowMobileMenu(false)}
              >
                Your Profile
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowMobileMenu(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="inline w-4 h-4 mr-2" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 px-5 border-t border-gray-200 flex flex-col space-y-2">
            <Link
              to="/signin"
              className="w-full py-2 text-center rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="w-full py-2 text-center rounded-md text-white bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
