import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedChatUser } from "../Utils/chatSlice";
import {
  MessageCircle,
  UserX,
  Check,
  XCircle,
  Bell,
  UserPlus,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// Connection Card Component - For desktop/laptop view
export const ConnectionCard = ({ connection, handleAction, type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extract user data based on connection type
  // For active connections, we need to determine which user is the other person
  const userData =
    type === "active"
      ? connection.fromUserId || connection.toUserId
      : type === "received"
      ? connection.fromUserId
      : connection.toUserId;

  if (!userData) {
    return null; // Skip rendering if no user data
  }

  const handleMessageClick = () => {
    // Save the selected user to Redux
    dispatch(setSelectedChatUser(userData));

    // Navigate to the main chat page without user ID in the URL
    navigate("/chat");
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex p-4">
        {/* User Avatar */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <img
            src={
              userData?.profileImageUrl ||
              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            }
            alt={`${userData.firstName} ${userData.lastName}`}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
            <div className="bg-green-500 w-3 h-3 rounded-full"></div>
          </div>
        </div>

        {/* User Info */}
        <div className="ml-4 flex-1">
          <div className="flex justify-between flex-col">
            <h3 className="font-semibold text-gray-900">
              {userData.firstName} {userData.lastName}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full">
              {"@"}
              {userData.username || "Member"}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {userData.about || "Hey, i am joined in innov8mate"}
          </p>
          <div className="flex items-center mt-1">
            <p className="text-xs text-gray-400 flex items-center mr-2">
              {userData.city && userData.state ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {userData.city}, {userData.state}
                </>
              ) : (
                userData.city || userData.state || "Location not specified"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Connection Status Badge */}
      {type === "received" && (
        <div className="px-4 pb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Bell className="w-3 h-3 mr-1" />
            Wants to connect with you
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex border-t border-gray-100">
        {type === "active" && (
          <>
            <button
              onClick={handleMessageClick}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-gray-600 hover:bg-gray-50 text-sm border-r border-gray-100"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
            <button
              onClick={() => handleAction(connection._id, "remove")}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 hover:bg-red-50 text-sm"
            >
              <UserX className="w-4 h-4" />
              Remove
            </button>
          </>
        )}

        {type === "received" && (
          <>
            <button
              onClick={() => handleAction(connection._id, "accepted")}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-green-600 hover:bg-green-50 text-sm border-r border-gray-100"
            >
              <Check className="w-4 h-4" />
              Accept
            </button>
            <button
              onClick={() => handleAction(connection._id, "rejected")}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 hover:bg-red-50 text-sm"
            >
              <XCircle className="w-4 h-4" />
              Decline
            </button>
          </>
        )}

        {type === "sent" && (
          <button
            onClick={() => handleAction(connection._id, "cancel")}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-orange-600 hover:bg-orange-50 text-sm"
          >
            <XCircle className="w-4 h-4" />
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
};

// Mobile Connection Card - Optimized for smaller screens
export const MobileConnectionCard = ({ connection, handleAction, type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extract user data based on connection type
  const userData =
    type === "active"
      ? connection.fromUserId || connection.toUserId
      : type === "received"
      ? connection.fromUserId
      : connection.toUserId;

  if (!userData) {
    return null; // Skip rendering if no user data
  }

  const handleMessageClick = () => {
    // Save the selected user to Redux
    dispatch(setSelectedChatUser(userData));

    // Navigate to the main chat page without user ID in the URL
    navigate("/chat");
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 mb-3">
      <div className="p-3 flex items-center">
        <img
          src={userData.profileImageUrl || "https://via.placeholder.com/50"}
          alt={`${userData.firstName} ${userData.lastName}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 text-sm">
              {userData.firstName} {userData.lastName}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
              {userData.username || "Member"}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            {userData.city
              ? `${userData.city}${userData.state ? `, ${userData.state}` : ""}`
              : "Location not specified"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-gray-100 text-xs">
        {type === "active" && (
          <>
            <button
              onClick={handleMessageClick}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-gray-600 hover:bg-gray-50 border-r border-gray-100"
            >
              <MessageCircle className="w-3 h-3" />
              Message
            </button>
            <button
              onClick={() => handleAction(connection._id, "remove")}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 hover:bg-red-50"
            >
              <UserX className="w-3 h-3" />
              Remove
            </button>
          </>
        )}

        {type === "received" && (
          <>
            <button
              onClick={() => handleAction(connection._id, "accepted")}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-green-600 hover:bg-green-50 border-r border-gray-100"
            >
              <Check className="w-3 h-3" />
              Accept
            </button>
            <button
              onClick={() => handleAction(connection._id, "rejected")}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-3 h-3" />
              Decline
            </button>
          </>
        )}

        {type === "sent" && (
          <button
            onClick={() => handleAction(connection._id, "cancel")}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-orange-600 hover:bg-orange-50"
          >
            <XCircle className="w-3 h-3" />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ type }) => {
  let title, description, icon;

  switch (type) {
    case "active":
      title = "No connections yet";
      description = "Start connecting with other users to grow your network";
      icon = <Users className="w-12 h-12 text-gray-300" />;
      break;
    case "received":
      title = "No pending requests";
      description = "You don't have any connection requests to review";
      icon = <UserPlus className="w-12 h-12 text-gray-300" />;
      break;
    case "sent":
      title = "No sent requests";
      description = "You haven't sent any connection requests yet";
      icon = <Clock className="w-12 h-12 text-gray-300" />;
      break;
    default:
      title = "No data to display";
      description = "There's nothing here yet";
      icon = <UserCircle className="w-12 h-12 text-gray-300" />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-lg">
      <div className="bg-white p-4 rounded-full mb-4 shadow-sm">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md">{description}</p>
      {type === "active" && (
        <Link
          to="/discover"
          className="mt-4 flex items-center text-sm font-medium text-orange-600 hover:text-orange-500"
        >
          Discover people
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      )}
    </div>
  );
};
