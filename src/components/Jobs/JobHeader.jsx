import { useState } from "react";
import { API_URL } from "../../Utils/constants";
import axios from "axios";
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { FaLaptopCode } from "react-icons/fa";

const JobHeader = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "India",
    dateSincePosted: "",
    jobType: "",
    remoteFilter: "",
    salary: "",
    experienceLevel: "",
    limit: "10",
    page: "0",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    console.log("search is calling");
    console.log(filters);
    const searchData = await axios.post(
      `${API_URL}/job/search`,
      { filters },
      { withCredientials: true }
    );
    console.log(filters);
    setJobs(searchData.data.response);
  };

  return (
    <div className="bg-orange-50 shadow-sm">
      {/* Main Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Search jobs (e.g., Software Engineer)"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {/* Location Input */}
          <div className="relative w-full lg:w-72">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {/* Search Button */}
          <button
            className="w-full lg:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
            Search Jobs
          </button>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full lg:w-auto px-4 py-3 border border-orange-200 hover:border-orange-300 rounded-lg text-orange-600 flex items-center justify-center gap-2 bg-white transition-all"
          >
            {showFilters ? (
              <X className="h-5 w-5" />
            ) : (
              <SlidersHorizontal className="h-5 w-5" />
            )}
            {showFilters ? "Close Filters" : "More Filters"}
          </button>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-orange-100">
            {/* Job Type */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Briefcase className="w-4 h-4 mr-2 text-orange-500" />
                Job Type
              </label>
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">All Types</option>
                <option value="full time">Full Time</option>
                <option value="part time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Building2 className="w-4 h-4 mr-2 text-orange-500" />
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">All Levels</option>
                <option value="internship">Internship</option>
                <option value="entry level">Entry Level</option>
                <option value="associate">Associate</option>
                <option value="senior">Senior</option>
                <option value="director">Director</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            {/* Remote Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaLaptopCode className="w-4 h-4 mr-2 text-orange-500" />
                Work Type
              </label>
              <select
                name="remoteFilter"
                value={filters.remoteFilter}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="on site">On Site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Date Posted */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                Date Posted
              </label>
              <select
                name="dateSincePosted"
                value={filters.dateSincePosted}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">All Time</option>
                <option value="24hr">Last 24 hours</option>
                <option value="past week">Past Week</option>
                <option value="past month">Past Month</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobHeader;
