/* eslint-disable react/prop-types */
import {
  Search,
  Briefcase,
  Clock,
  MapPin,
  Filter,
  ChevronDown,
  Star,
  Zap,
  Users,
  BookOpen,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Job types enum
const JobTypes = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
  PROJECT: "Project-based",
};

// Sample job data (replace with your actual data)
const sampleJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechStart Inc.",
    location: "Remote",
    type: JobTypes.FULL_TIME,
    salary: "$80K - $100K",
    description:
      "Join our team to build responsive web applications using React.",
    skills: ["React", "JavaScript", "CSS", "HTML"],
    postedDate: "2 days ago",
    logo: "/api/placeholder/50/50",
  },
  {
    id: 2,
    title: "UX Research Project",
    company: "DesignHub",
    location: "Remote",
    type: JobTypes.FREELANCE,
    salary: "$4000 (Fixed)",
    description:
      "Conduct user interviews and prepare a comprehensive UX research report.",
    skills: ["User Research", "Prototype Testing", "Report Writing"],
    postedDate: "5 hours ago",
    logo: "/api/placeholder/50/50",
  },
  {
    id: 3,
    title: "Mobile App Development",
    company: "Individual Innovator",
    location: "Remote",
    type: JobTypes.PROJECT,
    salary: "$6000 - $10000",
    description:
      "Looking for a skilled mobile developer to create an iOS/Android app from scratch.",
    skills: ["Swift", "Kotlin", "UI Design", "API Integration"],
    postedDate: "1 week ago",
    logo: "/api/placeholder/50/50",
  },
  {
    id: 4,
    title: "Marketing Intern",
    company: "GrowthBoost",
    location: "New York, NY",
    type: JobTypes.INTERNSHIP,
    salary: "$20/hr",
    description:
      "Join our marketing team to learn and contribute to innovative campaigns.",
    skills: ["Social Media", "Content Creation", "Analytics"],
    postedDate: "3 days ago",
    logo: "/api/placeholder/50/50",
  },
  {
    id: 5,
    title: "AI Research Collaboration",
    company: "MindLab",
    location: "Remote",
    type: JobTypes.CONTRACT,
    salary: "Negotiable",
    description:
      "We need an AI researcher to collaborate on a groundbreaking machine learning project.",
    skills: ["Python", "TensorFlow", "Machine Learning", "Research"],
    postedDate: "1 day ago",
    logo: "/api/placeholder/50/50",
  },
];

// Job card component
const JobCard = ({ job }) => {
  // Function to determine tag color based on job type
  const getTagColor = (type) => {
    switch (type) {
      case JobTypes.FULL_TIME:
        return "bg-blue-100 text-blue-800";
      case JobTypes.PART_TIME:
        return "bg-purple-100 text-purple-800";
      case JobTypes.CONTRACT:
        return "bg-teal-100 text-teal-800";
      case JobTypes.FREELANCE:
        return "bg-orange-100 text-orange-800";
      case JobTypes.INTERNSHIP:
        return "bg-green-100 text-green-800";
      case JobTypes.PROJECT:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
      <div className="flex items-start gap-4">
        <img
          src={job.logo}
          alt={`${job.company} logo`}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-xl text-gray-900">{job.title}</h3>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${getTagColor(
                job.type
              )}`}
            >
              {job.type}
            </span>
          </div>
          <p className="text-gray-700 mt-1">{job.company}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.postedDate}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.salary}
            </span>
          </div>
          <p className="mt-3 text-gray-600 line-clamp-2">{job.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Link
              to={`/jobs/${job.id}`}
              className="text-orange-600 font-medium hover:text-orange-700 text-sm"
            >
              View Details
            </Link>
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-full transition-colors duration-300">
              {job.type === JobTypes.PROJECT || job.type === JobTypes.FREELANCE
                ? "Apply & Bid"
                : "Quick Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter sidebar component
const FilterSidebar = ({ setFilters }) => {
  const [jobTypes, setJobTypes] = useState([]);
  const [locationTypes, setLocationTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);

  // Toggle job type selection
  const toggleJobType = (type) => {
    if (jobTypes.includes(type)) {
      setJobTypes(jobTypes.filter((t) => t !== type));
    } else {
      setJobTypes([...jobTypes, type]);
    }
  };

  // Toggle location type selection
  const toggleLocationType = (type) => {
    if (locationTypes.includes(type)) {
      setLocationTypes(locationTypes.filter((t) => t !== type));
    } else {
      setLocationTypes([...locationTypes, type]);
    }
  };

  // Toggle experience level selection
  const toggleExperienceLevel = (level) => {
    if (experienceLevels.includes(level)) {
      setExperienceLevels(experienceLevels.filter((l) => l !== level));
    } else {
      setExperienceLevels([...experienceLevels, level]);
    }
  };

  // Apply filters
  const applyFilters = () => {
    setFilters({
      jobTypes,
      locationTypes,
      experienceLevels,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
      <h3 className="font-semibold text-xl text-gray-900 mb-6">Filters</h3>

      {/* Job Type Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Job Type</h4>
        <div className="space-y-2">
          {Object.values(JobTypes).map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={() => toggleJobType(type)}
                checked={jobTypes.includes(type)}
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Type Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Location</h4>
        <div className="space-y-2">
          {["Remote", "On-site", "Hybrid"].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={() => toggleLocationType(type)}
                checked={locationTypes.includes(type)}
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Experience Level</h4>
        <div className="space-y-2">
          {["Entry-level", "Intermediate", "Senior", "Expert"].map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={() => toggleExperienceLevel(level)}
                checked={experienceLevels.includes(level)}
              />
              <span className="text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filter Button */}
      <button
        onClick={applyFilters}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors duration-300 flex items-center justify-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Apply Filters
      </button>
    </div>
  );
};

// Featured statistics component
const StatisticCard = ({ icon: Icon, title, value }) => (
  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
      <Icon className="w-6 h-6 text-orange-600" />
    </div>
    <div>
      <p className="text-gray-700 text-sm">{title}</p>
      <h4 className="font-semibold text-xl text-gray-900">{value}</h4>
    </div>
  </div>
);

// Main Jobs Section Component
const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Latest");
  const [filters, setFilters] = useState({
    jobTypes: [],
    locationTypes: [],
    experienceLevels: [],
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle sort selection change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 pt-16 pb-16">
        <div className="absolute inset-0 opacity-10 bg-pattern-dots"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
              Find Your Next Opportunity
            </h1>
            <p className="text-lg text-orange-100 mb-8">
              Browse job listings, freelance gigs, and collaboration
              opportunities all in one place
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="flex bg-white rounded-full shadow-xl overflow-hidden p-1">
                <div className="flex-grow">
                  <div className="relative">
                    <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs, skills, or companies..."
                      className="w-full pl-12 pr-4 py-3 rounded-full border-none focus:ring-0 text-gray-800"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-full transition-colors duration-300">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatisticCard
              icon={Briefcase}
              title="Total Opportunities"
              value="1,200+"
            />
            <StatisticCard icon={Zap} title="Freelance Projects" value="450+" />
            <StatisticCard icon={Users} title="Hiring Companies" value="300+" />
            <StatisticCard icon={BookOpen} title="New This Week" value="85+" />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Opportunities
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-gray-700 text-sm">
                Sort by:
              </label>
              <select
                id="sortBy"
                className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="Latest">Latest</option>
                <option value="Relevance">Relevance</option>
                <option value="Salary-high">Salary: High to Low</option>
                <option value="Salary-low">Salary: Low to High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <FilterSidebar setFilters={setFilters} />
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {sampleJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Post New Job/Project CTA */}
              <div className="mt-10 p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white text-center">
                <h3 className="text-xl font-bold mb-2">
                  Need to hire talent or post a project?
                </h3>
                <p className="mb-4">
                  Join thousands of companies and innovators posting
                  opportunities on Innov8mate
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-6 py-3 bg-white text-orange-600 font-medium rounded-full hover:bg-gray-100 transition-colors duration-300">
                    Post a Job
                  </button>
                  <button className="px-6 py-3 bg-orange-600 text-white font-medium rounded-full border border-white hover:bg-orange-700 transition-colors duration-300">
                    Post a Freelance Project
                  </button>
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100">
                    &laquo;
                  </button>
                  <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    1
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100">
                    2
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100">
                    3
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100">
                    &raquo;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Jobs;
