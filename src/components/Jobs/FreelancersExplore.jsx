import { useState, useEffect } from "react";
import {
  Search,
  Sliders,
  Star,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  ChevronDown,
  User,
  Award,
  Filter,
  X,
  CheckSquare,
  Square,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Utils/constants";
import { toast } from "react-hot-toast";

// Main component for freelancer search and exploration
const FreelancersExplore = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    skills: [],
    experienceLevel: "",
    location: "",
    hourlyRateRange: { min: "", max: "" },
    availability: "",
  });

  // Skills list (in real app, this would be fetched from API)
  const availableSkills = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "SEO",
    "Data Analysis",
    "Machine Learning",
    "Project Management",
  ];

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/freelancers`, {
        withCredentials: true,
        params: {
          search: searchTerm,
          ...constructQueryParams(),
        },
      });
      setFreelancers(response.data);
    } catch (err) {
      console.error("Error fetching freelancers:", err);
      setError("Failed to load freelancers. Please try again later.");
      toast.error("Failed to load freelancers");
    } finally {
      setLoading(false);
    }
  };

  const constructQueryParams = () => {
    const params = {};

    if (filters.skills.length > 0) {
      params.skills = filters.skills.join(",");
    }

    if (filters.experienceLevel) {
      params.experienceLevel = filters.experienceLevel;
    }

    if (filters.location) {
      params.location = filters.location;
    }

    if (filters.hourlyRateRange.min) {
      params.minRate = filters.hourlyRateRange.min;
    }

    if (filters.hourlyRateRange.max) {
      params.maxRate = filters.hourlyRateRange.max;
    }

    if (filters.availability) {
      params.availability = filters.availability;
    }

    return params;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      if (filterType === "skills") {
        if (newFilters.skills.includes(value)) {
          newFilters.skills = newFilters.skills.filter(
            (skill) => skill !== value
          );
        } else {
          newFilters.skills = [...newFilters.skills, value];
        }
      } else if (filterType === "hourlyRateRange") {
        newFilters.hourlyRateRange = {
          ...newFilters.hourlyRateRange,
          ...value,
        };
      } else {
        newFilters[filterType] = value;
      }

      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      experienceLevel: "",
      location: "",
      hourlyRateRange: { min: "", max: "" },
      availability: "",
    });
    setSearchTerm("");
  };

  const applyFilters = () => {
    fetchFreelancers();
    if (window.innerWidth < 1024) {
      setShowFilters(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Find Freelancers
            </h1>
            <p className="text-gray-600 mt-2">
              Discover talented professionals for your next project
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, skill, or keyword..."
                  className="block w-full pl-10 pr-3 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500"
                />
              </div>
              <div className="md:w-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <Sliders className="h-5 w-5 mr-2" />
                  <span>Filters</span>
                  {Object.values(filters).some((val) =>
                    Array.isArray(val)
                      ? val.length > 0
                      : val !== "" && val !== null && val !== undefined
                  ) && (
                    <span className="ml-2 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {filters.skills.length +
                        (filters.experienceLevel ? 1 : 0) +
                        (filters.location ? 1 : 0) +
                        (filters.hourlyRateRange.min ||
                        filters.hourlyRateRange.max
                          ? 1
                          : 0) +
                        (filters.availability ? 1 : 0)}
                    </span>
                  )}
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium px-8 py-2 rounded-lg hover:shadow-md transition-all"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <div
              className={`lg:col-span-1 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-orange-500" />
                      Filters
                    </h3>
                    {Object.values(filters).some((val) =>
                      Array.isArray(val)
                        ? val.length > 0
                        : val !== "" && val !== null && val !== undefined
                    ) && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-orange-600 hover:text-orange-800"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Skills
                    </h4>
                    <div className="space-y-2">
                      {availableSkills.map((skill) => (
                        <div key={skill} className="flex items-center">
                          <button
                            type="button"
                            onClick={() => handleFilterChange("skills", skill)}
                            className="flex items-center"
                          >
                            {filters.skills.includes(skill) ? (
                              <CheckSquare className="w-5 h-5 text-orange-500 mr-2" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400 mr-2" />
                            )}
                            <span className="text-gray-700">{skill}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Experience Level
                    </h4>
                    <div className="space-y-2">
                      {["Entry Level", "Intermediate", "Expert"].map(
                        (level) => (
                          <div key={level} className="flex items-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleFilterChange("experienceLevel", level)
                              }
                              className="flex items-center"
                            >
                              {filters.experienceLevel === level ? (
                                <CheckSquare className="w-5 h-5 text-orange-500 mr-2" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-400 mr-2" />
                              )}
                              <span className="text-gray-700">{level}</span>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Hourly Rate (USD)
                    </h4>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.hourlyRateRange.min}
                        onChange={(e) =>
                          handleFilterChange("hourlyRateRange", {
                            min: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.hourlyRateRange.max}
                        onChange={(e) =>
                          handleFilterChange("hourlyRateRange", {
                            max: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Availability
                    </h4>
                    <div className="space-y-2">
                      {["Full-time", "Part-time", "Hourly", "As needed"].map(
                        (availability) => (
                          <div key={availability} className="flex items-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleFilterChange("availability", availability)
                              }
                              className="flex items-center"
                            >
                              {filters.availability === availability ? (
                                <CheckSquare className="w-5 h-5 text-orange-500 mr-2" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-400 mr-2" />
                              )}
                              <span className="text-gray-700">
                                {availability}
                              </span>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <button
                    onClick={applyFilters}
                    className="w-full bg-orange-500 text-white font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Freelancer Results */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoaderCircle className="h-8 w-8 text-orange-500 animate-spin" />
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={fetchFreelancers}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : freelancers.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No freelancers found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Results info */}
                  <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                    <p className="text-gray-600">
                      Showing {freelancers.length} freelancers
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">
                        Sort by:
                      </span>
                      <div className="relative inline-block text-left">
                        <button className="inline-flex justify-between w-40 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                          <span>Most Relevant</span>
                          <ChevronDown
                            className="-mr-1 ml-2 h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Freelancer Cards */}
                  <div className="space-y-6">
                    {freelancers.map((freelancer) => (
                      <FreelancerCard
                        key={freelancer._id}
                        freelancer={freelancer}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Freelancer Card component
const FreelancerCard = ({ freelancer }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-orange-200 overflow-hidden">
              <img
                src={
                  freelancer.profileImage ||
                  "https://via.placeholder.com/100?text=Profile"
                }
                alt={freelancer.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100?text=Profile";
                }}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  <Link
                    to={`/freelancers/${freelancer._id}`}
                    className="hover:text-orange-500 transition-colors"
                  >
                    {freelancer.name}
                  </Link>
                </h3>
                <p className="text-gray-600 text-lg">{freelancer.title}</p>
              </div>

              <div className="flex items-center mt-2 md:mt-0">
                <div className="flex items-center text-yellow-400 mr-2">
                  <Star className="w-5 h-5 mr-1 fill-current" />
                  <span className="font-medium">
                    {freelancer.rating || "New"}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">
                  ({freelancer.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {freelancer.skills?.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
              {(freelancer.skills?.length || 0) > 5 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  +{freelancer.skills.length - 5} more
                </span>
              )}
            </div>

            <div className="text-gray-700 mb-4 line-clamp-2">
              {freelancer.bio}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                <span>
                  {freelancer.hourlyRate
                    ? `$${freelancer.hourlyRate}/hr`
                    : "Rate not specified"}
                </span>
              </div>

              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                <span>{freelancer.location || "Remote"}</span>
              </div>

              <div className="flex items-center">
                <Award className="w-4 h-4 text-gray-500 mr-1" />
                <span>{freelancer.experienceLevel || "Not specified"}</span>
              </div>

              <div className="flex items-center">
                <Briefcase className="w-4 h-4 text-gray-500 mr-1" />
                <span>{freelancer.completedJobs || 0} jobs completed</span>
              </div>

              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-1" />
                <span>{freelancer.availability || "Not specified"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <Link
          to={`/freelancers/${freelancer._id}`}
          className="text-orange-500 font-medium flex items-center hover:text-orange-600 transition-colors"
        >
          View Profile <ChevronRight className="ml-1 w-4 h-4" />
        </Link>

        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-md transition-all">
          Contact
        </button>
      </div>
    </div>
  );
};

export default FreelancersExplore;
