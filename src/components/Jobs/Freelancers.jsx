/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Search,
  Code,
  Star,
  MapPin,
  Filter,
  Briefcase,
  Award,
  ThumbsUp,
  Clock,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Settings,
  User,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

// Sample freelancer data (replace with your actual data)
const sampleFreelancers = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Full Stack Developer",
    avatar: "/api/placeholder/80/80",
    rating: 4.9,
    reviews: 37,
    hourlyRate: "$45/hr",
    location: "Toronto, Canada",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
    bio: "Passionate full-stack developer with 5+ years experience building scalable web applications. Specialized in React ecosystem.",
    completedProjects: 28,
    responseTime: "< 2 hours",
    availability: "Available now",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "UX/UI Designer",
    avatar: "/api/placeholder/80/80",
    rating: 5.0,
    reviews: 24,
    hourlyRate: "$55/hr",
    location: "Remote",
    skills: ["UI Design", "User Research", "Figma", "Adobe XD", "Prototyping"],
    bio: "Award-winning designer creating intuitive digital experiences that solve real problems for users. Former lead designer at DesignCraft.",
    completedProjects: 42,
    responseTime: "< 1 hour",
    availability: "Available in 1 week",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "Mobile App Developer",
    avatar: "/api/placeholder/80/80",
    rating: 4.8,
    reviews: 19,
    hourlyRate: "$60/hr",
    location: "Berlin, Germany",
    skills: ["Swift", "Kotlin", "Flutter", "Firebase", "RESTful APIs"],
    bio: "iOS and Android developer with a passion for creating sleek, high-performance mobile applications that deliver exceptional user experiences.",
    completedProjects: 15,
    responseTime: "< 4 hours",
    availability: "Available now",
  },
  {
    id: 4,
    name: "Alex Patel",
    title: "Data Scientist & ML Engineer",
    avatar: "/api/placeholder/80/80",
    rating: 4.7,
    reviews: 12,
    hourlyRate: "$70/hr",
    location: "Remote",
    skills: ["Python", "TensorFlow", "PyTorch", "Data Analysis", "NLP"],
    bio: "Helping companies leverage data to drive decision making and innovation. Specialized in predictive analytics and machine learning models.",
    completedProjects: 22,
    responseTime: "< 12 hours",
    availability: "Available in 3 days",
  },
  {
    id: 5,
    name: "Jordan Williams",
    title: "Marketing Strategist",
    avatar: "/api/placeholder/80/80",
    rating: 4.9,
    reviews: 31,
    hourlyRate: "$50/hr",
    location: "New York, USA",
    skills: [
      "Content Strategy",
      "SEO",
      "Social Media",
      "Analytics",
      "Email Marketing",
    ],
    bio: "Strategic marketer helping startups and growing businesses reach their target audience effectively and efficiently.",
    completedProjects: 34,
    responseTime: "< 3 hours",
    availability: "Available now",
  },
];

// Skill categories for filtering
const skillCategories = [
  { name: "Software Development", icon: Code },
  { name: "Design & Creative", icon: Settings },
  { name: "Marketing", icon: ExternalLink },
  { name: "Data Science", icon: ThumbsUp },
  { name: "Writing & Content", icon: MessageCircle },
  { name: "Business & Finance", icon: Briefcase },
];

// FreelancerCard component
const FreelancerCard = ({ freelancer }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
      <div className="flex gap-5">
        {/* Avatar and basic info */}
        <div className="flex flex-col items-center">
          <img
            src={freelancer.avatar}
            alt={freelancer.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-800 ml-1">
              {freelancer.rating}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({freelancer.reviews})
            </span>
          </div>
          <button className="mt-3 text-orange-600 hover:text-orange-700 text-sm font-medium">
            View Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-xl text-gray-900">
                {freelancer.name}
              </h3>
              <p className="text-gray-700">{freelancer.title}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{freelancer.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-xl text-gray-900">
                {freelancer.hourlyRate}
              </p>
              <div className="text-sm text-gray-600">
                {freelancer.availability}
              </div>
            </div>
          </div>

          <p className="mt-3 text-gray-600 line-clamp-2">{freelancer.bio}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {freelancer.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
            {freelancer.skills.length > 5 && (
              <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-md">
                +{freelancer.skills.length - 5} more
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-between items-center border-t border-gray-100 pt-4">
            <div className="flex gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {freelancer.completedProjects} projects
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {freelancer.responseTime} response
              </span>
            </div>

            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-300">
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
              <button className="px-5 py-2 bg-white border border-orange-500 text-orange-600 rounded-full hover:bg-orange-50 transition-colors duration-300 text-sm font-medium">
                Message
              </button>
              <button className="px-5 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300 text-sm font-medium">
                Hire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FreelancerDetailModal component - for when a user clicks on a freelancer
const FreelancerDetailModal = ({ freelancer, onClose }) => {
  // Sample projects data for the freelancer
  const freelancerProjects = [
    {
      id: 1,
      title: "E-commerce Mobile App",
      clientName: "RetailTech Inc.",
      duration: "3 months",
      completedDate: "Nov 2024",
      description:
        "Designed and developed a full-featured e-commerce mobile application with payment integration.",
      testimonial:
        "Exceeded our expectations. The app increased our mobile sales by 32%.",
    },
    {
      id: 2,
      title: "Dashboard UI Redesign",
      clientName: "AnalyticsPro",
      duration: "6 weeks",
      completedDate: "Sep 2024",
      description:
        "Complete UI/UX overhaul of an analytics dashboard to improve data visualization and user experience.",
      testimonial:
        "Transformed our product. User engagement increased dramatically after the redesign.",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-2xl text-gray-900">
            Freelancer Profile
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex gap-6 items-start">
            <img
              src={freelancer.avatar}
              alt={freelancer.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-2xl text-gray-900">
                {freelancer.name}
              </h3>
              <p className="text-gray-700 text-lg">{freelancer.title}</p>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{freelancer.location}</span>
                <span className="mx-2">•</span>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{freelancer.rating}</span>
                <span className="text-gray-500">
                  ({freelancer.reviews} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl text-gray-900">
                {freelancer.hourlyRate}
              </p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mt-1">
                {freelancer.availability}
              </span>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8">
            <h4 className="font-semibold text-lg text-gray-900 mb-3">About</h4>
            <p className="text-gray-700">{freelancer.bio}</p>
          </div>

          {/* Skills Section */}
          <div className="mt-8">
            <h4 className="font-semibold text-lg text-gray-900 mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Work History Section */}
          <div className="mt-8">
            <h4 className="font-semibold text-lg text-gray-900 mb-3">
              Work History
            </h4>
            <div className="space-y-6">
              {freelancerProjects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between">
                    <h5 className="font-semibold text-gray-900">
                      {project.title}
                    </h5>
                    <span className="text-sm text-gray-600">
                      {project.completedDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    Client: {project.clientName} • {project.duration}
                  </p>
                  <p className="mt-3 text-gray-700">{project.description}</p>
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg italic text-gray-600">
                    "{project.testimonial}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8">
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-300">
                Hire {freelancer.name.split(" ")[0]}
              </button>
              <button className="flex-1 py-3 bg-white border border-orange-500 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors duration-300">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FilterSidebar component for the freelancers page
const FreelancerFilterSidebar = ({ setFilters }) => {
  const [skillCats, setSkillCats] = useState([]);
  const [ratingsFilter, setRatingsFilter] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100]);

  // Toggle skill category selection
  const toggleSkillCategory = (category) => {
    if (skillCats.includes(category)) {
      setSkillCats(skillCats.filter((c) => c !== category));
    } else {
      setSkillCats([...skillCats, category]);
    }
  };

  // Apply filters
  const applyFilters = () => {
    setFilters({
      skillCategories: skillCats,
      minimumRating: ratingsFilter,
      priceRange,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
      <h3 className="font-semibold text-xl text-gray-900 mb-6">Find Talent</h3>

      {/* Skill Categories Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Skill Categories</h4>
        <div className="space-y-2">
          {skillCategories.map((category) => (
            <label
              key={category.name}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={() => toggleSkillCategory(category.name)}
                checked={skillCats.includes(category.name)}
              />
              <span className="text-gray-700 flex items-center gap-2">
                <category.icon className="w-4 h-4 text-gray-500" />
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Minimum Rating</h4>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                rating <= ratingsFilter
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setRatingsFilter(rating)}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      {/* Hourly Rate Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Hourly Rate</h4>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Availability Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Availability</h4>
        <div className="space-y-2">
          {["Available now", "Available this week", "Available anytime"].map(
            (option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="availability"
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            )
          )}
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

// Main Project Creation Form component
const ProjectCreationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    budget: { type: "fixed", amount: "" },
    timeline: "",
    attachments: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBudgetTypeChange = (type) => {
    setFormData({ ...formData, budget: { ...formData.budget, type } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Project data:", formData);
    // TODO: Submit project to backend
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-2xl text-gray-900">
            Post a New Project
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g. Mobile App Development for Health Tracking"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe your project requirements, goals, and any specific details freelancers should know..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Skills Needed */}
            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Skills Required
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                placeholder="e.g. React, Node.js, UI Design (comma separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills.map(
                  (skill, index) =>
                    skill && (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )
                )}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget
              </label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="budgetType"
                    className="text-orange-500 focus:ring-orange-500"
                    checked={formData.budget.type === "fixed"}
                    onChange={() => handleBudgetTypeChange("fixed")}
                  />
                  <span>Fixed Price</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="budgetType"
                    className="text-orange-500 focus:ring-orange-500"
                    checked={formData.budget.type === "hourly"}
                    onChange={() => handleBudgetTypeChange("hourly")}
                  />
                  <span>Hourly Rate</span>
                </label>
              </div>
              <div className="flex items-center">
                <span className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-l-lg">
                  $
                </span>
                <input
                  type="number"
                  name="budgetAmount"
                  placeholder={
                    formData.budget.type === "fixed"
                      ? "Total project budget"
                      : "Maximum hourly rate"
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-orange-500 focus:border-orange-500"
                  value={formData.budget.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: { ...formData.budget, amount: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label
                htmlFor="timeline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                value={formData.timeline}
                onChange={handleInputChange}
                required
              >
                <option value="">Select timeline...</option>
                <option value="less-than-1-week">Less than 1 week</option>
                <option value="1-2-weeks">1-2 weeks</option>
                <option value="2-4-weeks">2-4 weeks</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="more-than-6-months">More than 6 months</option>
              </select>
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attachments: Array.from(e.target.files),
                    })
                  }
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      Drag and drop files, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload project briefs, mockups, or reference materials
                      (Max 10MB)
                    </p>
                  </div>
                </label>
                {formData.attachments.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-sm font-medium text-gray-700">
                      Selected files:
                    </p>
                    <ul className="mt-2 text-sm text-gray-600">
                      {Array.from(formData.attachments).map((file, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-300"
              >
                Post Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Freelancers Interface Component
const Freelancers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Rating");
  const [filters, setFilters] = useState({
    skillCategories: [],
    minimumRating: 0,
    priceRange: [0, 100],
  });
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle sort selection change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Open freelancer detail modal
  const openFreelancerModal = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowFreelancerModal(true);
  };

  // Open project creation form
  const openProjectForm = () => {
    setShowProjectForm(true);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 pt-16 pb-16">
        <div className="absolute inset-0 opacity-10 bg-pattern-dots"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Find Expert Freelancers
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-orange-50">
              Connect with top talent to bring your projects to life
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden p-1">
                <div className="flex-1 flex items-center px-4">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for skills, categories, or freelancers..."
                    className="w-full px-3 py-3 border-none focus:outline-none focus:ring-0 placeholder-gray-500"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 cursor-pointer">
                  Search
                </button>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2 items-center">
                <span className="text-orange-50 text-sm">Popular :</span>
                {[
                  "Web Development",
                  "UI/UX Design",
                  "Mobile Apps",
                  "Data Science",
                  "Content Writing",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-orange-400/30 hover:bg-orange-400/50 text-white rounded-full text-sm transition-colors duration-300"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Freelancers
              </h2>
              <span className="ml-3 px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-sm">
                {sampleFreelancers.length} results
              </span>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center bg-white rounded-lg border border-gray-200 px-3">
                <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                <select
                  className="py-2 pr-8 border-none focus:ring-0 text-gray-700 bg-transparent"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option>Rating</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Latest</option>
                </select>
              </div>

              <button
                onClick={openProjectForm}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Post a Project
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <FreelancerFilterSidebar setFilters={setFilters} />
            </div>

            {/* Freelancer Listings */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {sampleFreelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    onClick={() => openFreelancerModal(freelancer)}
                  >
                    <FreelancerCard freelancer={freelancer} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    &lt;
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                        page === 1
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    &gt;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showFreelancerModal && selectedFreelancer && (
        <FreelancerDetailModal
          freelancer={selectedFreelancer}
          onClose={() => setShowFreelancerModal(false)}
        />
      )}

      {showProjectForm && (
        <ProjectCreationForm onClose={() => setShowProjectForm(false)} />
      )}
    </div>
  );
};

export default Freelancers;
