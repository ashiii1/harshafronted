import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Utils/constants";
import {
  UserCircle,
  Search,
  UserPlus,
  RefreshCw,
  Briefcase,
  MapPin,
  Filter,
  AlertCircle,
  X,
} from "lucide-react";

const UserCard = ({ user, onConnect, isPending }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <img
              src={
                user?.profileImageUrl ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <h3 className="font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              {/* <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {user.username || "Member"}
              </span> */}
            </div>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {user.about || "Hey guys, i am using innov8mate!"}
            </p>
            {(user.city || user.state) && (
              <p className="text-xs text-gray-400 mt-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {user.city && user.state
                  ? `${user.city}, ${user.state}`
                  : user.city || user.state}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={() => onConnect(user._id)}
          disabled={isPending}
          className={`w-full py-2 rounded flex items-center justify-center gap-2 text-sm font-medium ${
            isPending
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-orange-50 text-orange-600 hover:bg-orange-100"
          }`}
        >
          {isPending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Connect
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingConnects, setPendingConnects] = useState({});
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    showFilters: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // This endpoint should be created in your backend to return users that aren't already connected
      const response = await axios.get(`${API_URL}/user/discover`, {
        withCredentials: true,
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    setPendingConnects((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.post(
        `${API_URL}/connection/request/send/interested/${userId}`,
        {},
        { withCredentials: true }
      );

      // Remove user from the list after successful connection request
      setUsers((prev) => prev.filter((user) => user._id !== userId));

      // Optional: Show success notification
      // toast.success("Connection request sent");
    } catch (error) {
      console.error("Error sending connection request:", error);
      // Optional: Show error notification
      // toast.error("Failed to send connection request");
    } finally {
      setPendingConnects((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = searchQuery
      ? fullName.includes(searchQuery.toLowerCase()) ||
        (user.username &&
          user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesCity = filters.city
      ? user.city &&
        user.city.toLowerCase().includes(filters.city.toLowerCase())
      : true;

    const matchesState = filters.state
      ? user.state &&
        user.state.toLowerCase().includes(filters.state.toLowerCase())
      : true;

    return matchesSearch && matchesCity && matchesState;
  });

  const resetFilters = () => {
    setFilters({
      city: "",
      state: "",
      showFilters: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Discover People</h1>
          <p className="text-sm text-gray-500 mt-1">
            Find and connect with other users on the platform
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, username, or bio..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() =>
                  setFilters({ ...filters, showFilters: !filters.showFilters })
                }
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(filters.city || filters.state) && (
                  <span className="ml-1 bg-orange-100 text-orange-800 text-xs rounded-full px-2 py-0.5">
                    {(filters.city ? 1 : 0) + (filters.state ? 1 : 0)}
                  </span>
                )}
              </button>
              <button
                onClick={fetchUsers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {/* Filter Panel */}
            {filters.showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-orange-600 hover:text-orange-800"
                  >
                    Reset all
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      placeholder="Filter by city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      value={filters.city}
                      onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      placeholder="Filter by state"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      value={filters.state}
                      onChange={(e) =>
                        setFilters({ ...filters, state: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      setFilters({ ...filters, showFilters: false })
                    }
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
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
                    onClick={fetchUsers}
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
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onConnect={handleConnect}
                isPending={pendingConnects[user._id]}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <UserCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No users found
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              {searchQuery || filters.city || filters.state
                ? "Try adjusting your search or filters to find more people"
                : "There are no users available to connect with at the moment"}
            </p>
            {(searchQuery || filters.city || filters.state) && (
              <button
                onClick={resetFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <X className="h-4 w-4 mr-2" />
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
