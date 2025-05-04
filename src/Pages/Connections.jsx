import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Utils/constants";
import {
  UserCircle,
  MessageCircle,
  XCircle,
  UserPlus,
  Clock,
  Users,
  Check,
  Briefcase,
  Mail,
  RefreshCw,
  Search,
  ChevronRight,
  UserX,
  UserCheck,
  Bell,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { projectChatSocket } from "../services/socket";
import { useDispatch } from "react-redux";
import { setSelectedChatUser } from "../Utils/chatSlice";
import {
  ConnectionCard,
  MobileConnectionCard,
  EmptyState,
} from "./ConnectionCards";

// Using component imports from ConnectionCards.jsx for better state management with Redux

const Connections = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [connections, setConnections] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, [activeTab]);

  const fetchConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint;
      switch (activeTab) {
        case "active":
          endpoint = `${API_URL}/connection/connections`;
          break;
        case "received":
          endpoint = `${API_URL}/connection/received`;
          break;
        case "sent":
          // This endpoint may need to be implemented on the backend
          endpoint = `${API_URL}/connection/sent`;
          break;
        default:
          endpoint = `${API_URL}/connection/connections`;
      }

      const response = await axios.get(endpoint, { withCredentials: true });

      // Handle different response structures from the API
      if (activeTab === "active") {
        setConnections(response.data.connections || []);
      } else if (activeTab === "received") {
        setReceivedRequests(response.data.data || []);
      } else if (activeTab === "sent") {
        setSentRequests(response.data.data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} connections:`, error);
      setError(`Failed to load ${activeTab} connections. Please try again.`);

      // If toast is available in your project
      // toast.error(`Failed to load ${activeTab} connections`);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionAction = async (connectionId, action) => {
    try {
      let endpoint;
      let method = "post";

      switch (action) {
        case "accepted":
        case "rejected":
          endpoint = `${API_URL}/connection/request/review/${action}/${connectionId}`;
          method = "patch";
          break;
        case "cancel":
          // Endpoint to be implemented on backend
          endpoint = `${API_URL}/connection/request/cancel/${connectionId}`;
          break;
        case "remove":
          // Endpoint to be implemented on backend
          endpoint = `${API_URL}/connection/remove/${connectionId}`;
          break;
        default:
          return;
      }

      await axios({
        method,
        url: endpoint,
        withCredentials: true,
      });

      // Show success message based on action
      const actionMessages = {
        accepted: "Connection request accepted",
        rejected: "Connection request declined",
        cancel: "Connection request canceled",
        remove: "Connection removed",
      };

      // If toast is available in your project
      // toast.success(actionMessages[action] || "Action completed");

      // Refresh the data
      fetchConnections();
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);

      // If toast is available in your project
      // toast.error(`Failed to ${action} connection`);
    }
  };

  const filteredData = () => {
    if (!searchQuery.trim()) {
      if (activeTab === "active") return connections;
      if (activeTab === "received") return receivedRequests;
      if (activeTab === "sent") return sentRequests;
      return [];
    }

    const query = searchQuery.toLowerCase();
    const data =
      activeTab === "active"
        ? connections
        : activeTab === "received"
        ? receivedRequests
        : sentRequests;

    return data.filter((item) => {
      const userData =
        activeTab === "active"
          ? item.fromUserId || item.toUserId
          : activeTab === "received"
          ? item.fromUserId
          : item.toUserId;

      if (!userData) return false;

      return (
        `${userData.firstName} ${userData.lastName}`
          .toLowerCase()
          .includes(query) ||
        (userData.username &&
          userData.username.toLowerCase().includes(query)) ||
        (userData.city && userData.city.toLowerCase().includes(query)) ||
        (userData.state && userData.state.toLowerCase().includes(query))
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Network</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your connections and requests
            </p>
          </div>
          <Link
            to="/discover"
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Find Connections
          </Link>
        </div>

        {/* Search and Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search connections..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === "active"
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex justify-center items-center">
                <UserCheck className="w-4 h-4 mr-2" />
                Connections
                {connections.length > 0 && (
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {connections.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === "received"
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex justify-center items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Received
                {receivedRequests.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                    {receivedRequests.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === "sent"
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex justify-center items-center">
                <Clock className="w-4 h-4 mr-2" />
                Sent
                {sentRequests.length > 0 && (
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {sentRequests.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={fetchConnections}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Desktop/Tablet View */}
            <div className="hidden sm:block">
              {filteredData().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData().map((item) => (
                    <ConnectionCard
                      key={item._id}
                      connection={item}
                      handleAction={handleConnectionAction}
                      type={activeTab}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type={activeTab} />
              )}
            </div>

            {/* Mobile View */}
            <div className="sm:hidden">
              {filteredData().length > 0 ? (
                <div className="space-y-3">
                  {filteredData().map((item) => (
                    <MobileConnectionCard
                      key={item._id}
                      connection={item}
                      handleAction={handleConnectionAction}
                      type={activeTab}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type={activeTab} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Connections;
