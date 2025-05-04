/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Utils/constants";
import {
  Briefcase,
  Users,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  BarChart2,
  Star,
  DollarSign,
  MapPin,
  Award,
  Calendar,
  Sliders,
  X,
  User,
  Coffee,
  UserCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Sample freelancer data in case API fails
const sampleFreelancers = [
  {
    _id: "f1",
    name: "Alex Johnson",
    title: "Full Stack Developer",
    bio: "Passionate developer with 5+ years of experience in building web applications using React, Node.js, and MongoDB.",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    reviewCount: 27,
    hourlyRate: 45,
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "GraphQL", "AWS"],
    location: "New York, USA",
    experienceLevel: "Senior",
    completedJobs: 34,
    availability: "Full-time",
    joinedDate: "2021-03-15T00:00:00.000Z",
    lastActive: "2023-05-10T14:30:00.000Z",
  },
  {
    _id: "f2",
    name: "Sophia Chen",
    title: "UI/UX Designer",
    bio: "Creative designer specializing in user interfaces and experiences. Skilled in Figma, Adobe XD, and prototyping.",
    profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    reviewCount: 19,
    hourlyRate: 55,
    skills: [
      "UI Design",
      "UX Research",
      "Figma",
      "Adobe XD",
      "Wireframing",
      "Prototyping",
    ],
    location: "San Francisco, USA",
    experienceLevel: "Mid-level",
    completedJobs: 21,
    availability: "Part-time",
    joinedDate: "2022-01-10T00:00:00.000Z",
    lastActive: "2023-05-11T09:45:00.000Z",
  },
  {
    _id: "f3",
    name: "Marcus Williams",
    title: "DevOps Engineer",
    bio: "DevOps specialist with expertise in CI/CD pipelines, Docker, Kubernetes, and cloud infrastructure.",
    profileImage: "https://randomuser.me/api/portraits/men/56.jpg",
    rating: 4.7,
    reviewCount: 12,
    hourlyRate: 60,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux"],
    location: "London, UK",
    experienceLevel: "Senior",
    completedJobs: 15,
    availability: "Contract",
    joinedDate: "2021-08-22T00:00:00.000Z",
    lastActive: "2023-05-09T16:20:00.000Z",
  },
  {
    _id: "f4",
    name: "Priya Patel",
    title: "Mobile App Developer",
    bio: "Specialized in developing cross-platform mobile applications using React Native and Flutter.",
    profileImage: "https://randomuser.me/api/portraits/women/67.jpg",
    rating: 4.6,
    reviewCount: 8,
    hourlyRate: 40,
    skills: ["React Native", "Flutter", "iOS", "Android", "Firebase", "Redux"],
    location: "Bangalore, India",
    experienceLevel: "Mid-level",
    completedJobs: 11,
    availability: "Full-time",
    joinedDate: "2022-04-18T00:00:00.000Z",
    lastActive: "2023-05-11T11:10:00.000Z",
  },
];

// Sample statistics in case API fails
const sampleStats = {
  totalFreelancers: 1247,
  newFreelancers: 78,
  averageRating: 4.7,
  topSkills: ["React", "JavaScript", "UI/UX Design", "Node.js", "AWS"],
};

const StatCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">
            {value}
          </h3>
          {change !== undefined && (
            <p
              className={`text-xs flex items-center mt-1 ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? (
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`p-2.5 sm:p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${color}-500`} />
        </div>
      </div>
    </div>
  );
};

const FilterBadge = ({ label, onRemove }) => (
  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mr-2 mb-2">
    {label}
    <button
      onClick={onRemove}
      className="ml-1.5 text-gray-500 hover:text-gray-700"
    >
      ×
    </button>
  </div>
);

const FreelancerCard = ({ freelancer }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={
              freelancer.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                freelancer.name
              )}&background=random`
            }
            alt={freelancer.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-semibold text-lg text-gray-900">
            {freelancer.name}
          </h3>
          <p className="text-orange-600 font-medium">{freelancer.title}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
            {freelancer.location && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" /> {freelancer.location}
              </span>
            )}
            {freelancer.hourlyRate && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <DollarSign className="w-3 h-3 mr-1" /> {freelancer.hourlyRate}
                /hr
              </span>
            )}
            <span className="inline-flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" /> {freelancer.availability}
            </span>
            {freelancer.rating && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <Star
                  className="w-3 h-3 mr-1 text-yellow-400"
                  fill="currentColor"
                />
                {freelancer.rating} ({freelancer.reviewCount} reviews)
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
              {freelancer.skills &&
                freelancer.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              {freelancer.skills && freelancer.skills.length > 4 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  +{freelancer.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 text-center sm:text-right">
          <Link
            to={`/freelancers/${freelancer._id}`}
            className="inline-block px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-orange-600 border border-orange-600 hover:bg-orange-50 transition-colors"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ type, onCreate }) => {
  return (
    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6 sm:p-10 text-center">
      <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <User className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
        No Freelancers Found
      </h3>
      <p className="text-gray-500 mb-4 sm:mb-6 text-sm">
        {type === "empty"
          ? "No freelancers match your current filter criteria."
          : "There are no freelancers to display at this time."}
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
      >
        <Filter className="w-4 h-4 mr-2" />
        Clear Filters
      </button>
    </div>
  );
};

const FreelancersDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    totalFreelancers: 0,
    activeFreelancers: 0,
    avgRating: 0,
    completedProjects: 0,
  });
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    skills: [],
    experience: [],
    hourlyRate: null,
    availability: null,
    search: "",
  });
  const [appliedFilters, setAppliedFilters] = useState([]);

  // Available skills for filtering
  const availableSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "UI/UX Design",
    "Marketing",
    "Content Writing",
    "Data Analysis",
    "Project Management",
    "Mobile Development",
    "DevOps",
    "Graphic Design",
  ];

  // Experience levels
  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "intermediate", label: "Intermediate (3-5 years)" },
    { value: "experienced", label: "Experienced (5-10 years)" },
    { value: "expert", label: "Expert (10+ years)" },
  ];

  // Hourly rate ranges
  const hourlyRateRanges = [
    { value: "0-25", label: "$0-$25/hr" },
    { value: "25-50", label: "$25-$50/hr" },
    { value: "50-100", label: "$50-$100/hr" },
    { value: "100+", label: "$100+/hr" },
  ];

  // Availability options
  const availabilityOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "hourly", label: "Hourly" },
  ];

  // Fetch stats
  const fetchStats = async () => {
    try {
      // Simulate API call for stats
      // In a real app, you would fetch this data from an API
      setTimeout(() => {
        setStats({
          totalFreelancers: 584,
          activeFreelancers: 325,
          avgRating: 4.8,
          completedProjects: 2580,
        });
      }, 500);
    } catch (error) {
      console.error("Error fetching freelancer stats:", error);
      toast.error("Failed to load freelancer statistics");
    }
  };

  // Fetch freelancers
  const fetchFreelancers = async () => {
    try {
      setIsLoading(true);
      // In a real application, you would fetch this from your API
      // For demo purposes, we'll use a timeout to simulate an API call
      setTimeout(() => {
        // Sample freelancer data
        const sampleFreelancers = [
          {
            _id: "1",
            name: "Alex Johnson",
            title: "Full Stack Developer",
            profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
            location: "San Francisco, CA",
            hourlyRate: "$65",
            availability: "Full-time",
            rating: 4.9,
            reviewCount: 48,
            skills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
            experience: "expert",
          },
          {
            _id: "2",
            name: "Sophia Martinez",
            title: "UI/UX Designer",
            profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
            location: "New York, NY",
            hourlyRate: "$75",
            availability: "Part-time",
            rating: 4.8,
            reviewCount: 36,
            skills: ["Figma", "Adobe XD", "Sketch", "UI Design", "UX Research"],
            experience: "experienced",
          },
          {
            _id: "3",
            name: "Michael Chen",
            title: "Mobile Developer",
            profileImage: "https://randomuser.me/api/portraits/men/67.jpg",
            location: "Austin, TX",
            hourlyRate: "$70",
            availability: "Contract",
            rating: 4.7,
            reviewCount: 29,
            skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
            experience: "intermediate",
          },
          {
            _id: "4",
            name: "Priya Sharma",
            title: "Data Scientist",
            profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
            location: "Seattle, WA",
            hourlyRate: "$85",
            availability: "Full-time",
            rating: 4.9,
            reviewCount: 42,
            skills: ["Python", "R", "Machine Learning", "SQL", "TensorFlow"],
            experience: "expert",
          },
          {
            _id: "5",
            name: "David Wilson",
            title: "DevOps Engineer",
            profileImage: "https://randomuser.me/api/portraits/men/43.jpg",
            location: "Chicago, IL",
            hourlyRate: "$80",
            availability: "Contract",
            rating: 4.6,
            reviewCount: 31,
            skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
            experience: "experienced",
          },
          {
            _id: "6",
            name: "Emma Rodriguez",
            title: "Content Strategist",
            profileImage: "https://randomuser.me/api/portraits/women/11.jpg",
            location: "Miami, FL",
            hourlyRate: "$55",
            availability: "Part-time",
            rating: 4.8,
            reviewCount: 24,
            skills: [
              "Content Writing",
              "SEO",
              "Marketing",
              "Social Media",
              "Copywriting",
            ],
            experience: "intermediate",
          },
          {
            _id: "7",
            name: "James Taylor",
            title: "Blockchain Developer",
            profileImage: "https://randomuser.me/api/portraits/men/91.jpg",
            location: "Boston, MA",
            hourlyRate: "$90",
            availability: "Contract",
            rating: 4.7,
            reviewCount: 19,
            skills: [
              "Solidity",
              "Ethereum",
              "Smart Contracts",
              "Web3.js",
              "DApps",
            ],
            experience: "experienced",
          },
          {
            _id: "8",
            name: "Olivia Lee",
            title: "Project Manager",
            profileImage: "https://randomuser.me/api/portraits/women/33.jpg",
            location: "Denver, CO",
            hourlyRate: "$70",
            availability: "Full-time",
            rating: 4.9,
            reviewCount: 51,
            skills: [
              "Agile",
              "Scrum",
              "JIRA",
              "Risk Management",
              "Team Leadership",
            ],
            experience: "expert",
          },
        ];

        setFreelancers(sampleFreelancers);
        setFilteredFreelancers(sampleFreelancers);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      toast.error("Failed to load freelancers");
      setIsLoading(false);
    }
  };

  // Effect to fetch data on component mount
  useEffect(() => {
    fetchStats();
    fetchFreelancers();
  }, []);

  // Effect to filter freelancers when filters change
  useEffect(() => {
    if (freelancers.length > 0) {
      filterFreelancers();
    }
  }, [activeTab, filters]);

  // Filter freelancers based on current filters
  const filterFreelancers = () => {
    let filtered = [...freelancers];

    // Filter by tab
    if (activeTab === "top-rated") {
      filtered = filtered.filter((f) => f.rating >= 4.8);
    } else if (activeTab === "new") {
      // In a real app, you would filter by join date
      filtered = filtered.slice(0, 4); // Just take first 4 for demo
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(searchLower) ||
          f.title.toLowerCase().includes(searchLower) ||
          f.skills.some((skill) => skill.toLowerCase().includes(searchLower))
      );
    }

    // Filter by skills
    if (filters.skills.length > 0) {
      filtered = filtered.filter((f) =>
        filters.skills.some((skill) => f.skills.includes(skill))
      );
    }

    // Filter by experience
    if (filters.experience.length > 0) {
      filtered = filtered.filter((f) =>
        filters.experience.includes(f.experience)
      );
    }

    // Filter by hourly rate
    if (filters.hourlyRate) {
      const rate = parseFloat(f.hourlyRate.replace("$", ""));

      switch (filters.hourlyRate) {
        case "0-25":
          filtered = filtered.filter(
            (f) => parseFloat(f.hourlyRate.replace("$", "")) <= 25
          );
          break;
        case "25-50":
          filtered = filtered.filter((f) => {
            const rate = parseFloat(f.hourlyRate.replace("$", ""));
            return rate > 25 && rate <= 50;
          });
          break;
        case "50-100":
          filtered = filtered.filter((f) => {
            const rate = parseFloat(f.hourlyRate.replace("$", ""));
            return rate > 50 && rate <= 100;
          });
          break;
        case "100+":
          filtered = filtered.filter(
            (f) => parseFloat(f.hourlyRate.replace("$", "")) > 100
          );
          break;
      }
    }

    // Filter by availability
    if (filters.availability) {
      filtered = filtered.filter(
        (f) => f.availability.toLowerCase() === filters.availability
      );
    }

    setFilteredFreelancers(filtered);
  };

  // Update search filter
  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  // Toggle skill filter
  const toggleSkillFilter = (skill) => {
    const updatedSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];

    setFilters({ ...filters, skills: updatedSkills });

    // Update applied filters
    updateAppliedFilters("skill", skill, !filters.skills.includes(skill));
  };

  // Toggle experience filter
  const toggleExperienceFilter = (exp) => {
    const updatedExperience = filters.experience.includes(exp.value)
      ? filters.experience.filter((e) => e !== exp.value)
      : [...filters.experience, exp.value];

    setFilters({ ...filters, experience: updatedExperience });

    // Update applied filters
    updateAppliedFilters(
      "experience",
      exp.label,
      !filters.experience.includes(exp.value)
    );
  };

  // Set hourly rate filter
  const setHourlyRateFilter = (rate) => {
    const newRate = filters.hourlyRate === rate.value ? null : rate.value;
    setFilters({ ...filters, hourlyRate: newRate });

    // Update applied filters
    const existingIndex = appliedFilters.findIndex(
      (f) => f.type === "hourlyRate"
    );
    if (existingIndex >= 0) {
      const newFilters = [...appliedFilters];
      newFilters.splice(existingIndex, 1);
      if (newRate) {
        newFilters.push({ type: "hourlyRate", value: rate.label });
      }
      setAppliedFilters(newFilters);
    } else if (newRate) {
      setAppliedFilters([
        ...appliedFilters,
        { type: "hourlyRate", value: rate.label },
      ]);
    }
  };

  // Set availability filter
  const setAvailabilityFilter = (availability) => {
    const newAvailability =
      filters.availability === availability.value ? null : availability.value;
    setFilters({ ...filters, availability: newAvailability });

    // Update applied filters
    const existingIndex = appliedFilters.findIndex(
      (f) => f.type === "availability"
    );
    if (existingIndex >= 0) {
      const newFilters = [...appliedFilters];
      newFilters.splice(existingIndex, 1);
      if (newAvailability) {
        newFilters.push({ type: "availability", value: availability.label });
      }
      setAppliedFilters(newFilters);
    } else if (newAvailability) {
      setAppliedFilters([
        ...appliedFilters,
        { type: "availability", value: availability.label },
      ]);
    }
  };

  // Helper to update applied filters
  const updateAppliedFilters = (type, value, isAdding) => {
    if (isAdding) {
      setAppliedFilters([...appliedFilters, { type, value }]);
    } else {
      setAppliedFilters(
        appliedFilters.filter((f) => !(f.type === type && f.value === value))
      );
    }
  };

  // Remove a specific filter
  const removeFilter = (index) => {
    const filterToRemove = appliedFilters[index];
    const newAppliedFilters = [...appliedFilters];
    newAppliedFilters.splice(index, 1);
    setAppliedFilters(newAppliedFilters);

    // Update the actual filters
    if (filterToRemove.type === "skill") {
      setFilters({
        ...filters,
        skills: filters.skills.filter((s) => s !== filterToRemove.value),
      });
    } else if (filterToRemove.type === "experience") {
      const expValue = experienceLevels.find(
        (e) => e.label === filterToRemove.value
      )?.value;
      setFilters({
        ...filters,
        experience: filters.experience.filter((e) => e !== expValue),
      });
    } else if (filterToRemove.type === "hourlyRate") {
      setFilters({ ...filters, hourlyRate: null });
    } else if (filterToRemove.type === "availability") {
      setFilters({ ...filters, availability: null });
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      skills: [],
      experience: [],
      hourlyRate: null,
      availability: null,
      search: "",
    });
    setAppliedFilters([]);
    setActiveTab("all");
  };

  // Navigate to freelancer registration
  const handleBecomeFreelancer = () => {
    navigate("/freelancer/register");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Freelancers
          </h1>
          <p className="text-gray-600 mt-2">
            Find skilled professionals for your projects
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Navigation Cards */}
            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Quick Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <Link
                  to="/jobs/create"
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  </div>
                  <h3 className="font-medium text-gray-900">Post a Job</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Hire talent for your project
                  </p>
                </Link>

                <Link
                  to="/freelancers"
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                  <h3 className="font-medium text-gray-900">
                    Browse Freelancers
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Find skilled professionals
                  </p>
                </Link>

                <button
                  onClick={handleBecomeFreelancer}
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  </div>
                  <h3 className="font-medium text-gray-900">
                    Become a Freelancer
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Register & showcase your skills
                  </p>
                </button>

                <Link
                  to="/jobs"
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                  </div>
                  <h3 className="font-medium text-gray-900">Browse Jobs</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Find work opportunities
                  </p>
                </Link>
              </div>
            </section>

            {/* Stats Overview */}
            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <StatCard
                  title="Total Freelancers"
                  value={stats.totalFreelancers}
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Active Freelancers"
                  value={stats.activeFreelancers}
                  icon={UserCheck}
                  color="green"
                  change={12}
                />
                <StatCard
                  title="Average Rating"
                  value={stats.avgRating}
                  icon={Star}
                  color="yellow"
                />
                <StatCard
                  title="Completed Projects"
                  value={stats.completedProjects}
                  icon={Award}
                  color="purple"
                  change={8}
                />
              </div>
            </section>

            {/* Tabs & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="bg-white rounded-xl shadow-sm mb-4 sm:mb-0 p-1 inline-flex">
                <TabButton
                  active={activeTab === "all"}
                  onClick={() => setActiveTab("all")}
                >
                  All Freelancers
                </TabButton>
                <TabButton
                  active={activeTab === "top-rated"}
                  onClick={() => setActiveTab("top-rated")}
                >
                  Top Rated
                </TabButton>
                <TabButton
                  active={activeTab === "new"}
                  onClick={() => setActiveTab("new")}
                >
                  Newly Joined
                </TabButton>
              </div>

              <div className="w-full sm:w-auto relative">
                <input
                  type="text"
                  placeholder="Search freelancers, skills..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-orange-500 focus:border-orange-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Filters & Results */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters Sidebar */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    {appliedFilters.length > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-orange-600 hover:text-orange-700"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Skills Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </h4>
                    <div className="space-y-2">
                      {availableSkills.slice(0, 8).map((skill) => (
                        <label key={skill} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.skills.includes(skill)}
                            onChange={() => toggleSkillFilter(skill)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            {skill}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </h4>
                    <div className="space-y-2">
                      {experienceLevels.map((exp) => (
                        <label key={exp.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.experience.includes(exp.value)}
                            onChange={() => toggleExperienceFilter(exp)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            {exp.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate
                    </h4>
                    <div className="space-y-2">
                      {hourlyRateRanges.map((rate) => (
                        <label key={rate.value} className="flex items-center">
                          <input
                            type="radio"
                            checked={filters.hourlyRate === rate.value}
                            onChange={() => setHourlyRateFilter(rate)}
                            className="rounded-full border-gray-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            {rate.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </h4>
                    <div className="space-y-2">
                      {availabilityOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            checked={filters.availability === option.value}
                            onChange={() => setAvailabilityFilter(option)}
                            className="rounded-full border-gray-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1">
                {/* Applied Filters */}
                {appliedFilters.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap">
                      {appliedFilters.map((filter, index) => (
                        <FilterBadge
                          key={index}
                          label={filter.value}
                          onRemove={() => removeFilter(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Freelancer List */}
                {filteredFreelancers.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredFreelancers.map((freelancer) => (
                      <FreelancerCard
                        key={freelancer._id}
                        freelancer={freelancer}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="empty" onCreate={clearAllFilters} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FreelancersDashboard;
