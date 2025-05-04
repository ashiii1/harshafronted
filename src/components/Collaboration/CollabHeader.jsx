import { BiSearch, BiPlus, BiSort } from "react-icons/bi";
import { FiFilter, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { IDEA_CATEGORIES } from "../../Utils/constants";

const CollabHeader = ({
  onFilterChange,
  toggleViewMode,
  activeViewMode = "all",
  searchTerm = "",
}) => {
  const [viewMode, setViewMode] = useState(activeViewMode);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    sortBy: "latest",
    status: "all",
    searchTerm: searchTerm || "",
  });

  // Update local view mode when prop changes
  useEffect(() => {
    setViewMode(activeViewMode);
  }, [activeViewMode]);

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    // Debounce search to avoid too many requests
    const debounceTimeout = setTimeout(() => {
      handleFilterChange("searchTerm", value);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  };

  const handleViewModeToggle = (mode) => {
    setViewMode(mode);
    if (toggleViewMode) toggleViewMode(mode);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <header className="sticky top-0 z-10 py-2.5 sm:py-3.5 bg-white border-b border-gray-200 shadow-sm transition-all">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4">
        {/* Main Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Left Section: Title and Search */}
          <div className="flex items-center flex-grow max-w-full sm:max-w-md gap-2.5 sm:gap-3.5">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block whitespace-nowrap">
              <span className="text-orange-500">Collaboration</span> Hub
            </h1>
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={
                  isMobile ? "Search..." : "Search projects, skills, teams..."
                }
                value={localSearchTerm}
                onChange={handleSearchInput}
                className="w-full py-2 pl-8 pr-3 text-sm rounded-lg bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all placeholder-gray-500"
              />
              <BiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              {localSearchTerm && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setLocalSearchTerm("");
                    handleFilterChange("searchTerm", "");
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg ${
                showFilters
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition-colors text-sm`}
            >
              <FiFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {(filters.category !== "all" ||
                filters.status !== "all" ||
                filters.sortBy !== "latest") && (
                <span className="ml-1 w-2 h-2 rounded-full bg-orange-500"></span>
              )}
            </button>

            <div className="bg-gray-100 rounded-lg p-0.5 flex">
              <button
                onClick={() => handleViewModeToggle("all")}
                className={`px-2.5 py-1.5 text-xs sm:text-sm rounded-md transition-all ${
                  viewMode === "all"
                    ? "bg-white shadow-sm text-orange-600 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => handleViewModeToggle("your")}
                className={`px-2.5 py-1.5 text-xs sm:text-sm rounded-md transition-all ${
                  viewMode === "your"
                    ? "bg-white shadow-sm text-orange-600 font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Your Projects
              </button>
            </div>

            <Link to="/collaboration/new-project">
              <button className="flex items-center gap-1 py-1.5 px-2.5 sm:px-3.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm">
                <BiPlus className="w-4 h-4" />
                <span className="hidden sm:inline">New Project</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Expanded Filters (Conditional) */}
        {showFilters && (
          <div className="mt-3 p-3 sm:p-4 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn shadow-sm">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onChange={(e) => handleFilterChange("category", e.target.value)}
                value={filters.category}
              >
                <option value="all">All Categories</option>
                {IDEA_CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category.toLowerCase().replace(/\s+/g, "-")}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                value={filters.sortBy}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending Now</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onChange={(e) => handleFilterChange("status", e.target.value)}
                value={filters.status}
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="ongoing">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CollabHeader;
