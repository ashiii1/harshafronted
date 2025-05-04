import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Award,
  GraduationCap,
  Plus,
  Minus,
  Calendar,
  Hash,
  Info,
  Upload,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_URL } from "../../Utils/constants";

const JobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Project-based",
];

const ExperienceLevels = [
  "Entry level",
  "Junior",
  "Mid level",
  "Senior",
  "Lead",
  "Executive",
];

const EducationLevels = [
  "High School",
  "Associate's",
  "Bachelor's",
  "Master's",
  "PhD",
  "None required",
];

const JobCreationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing jobs
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Form fields
  const [jobData, setJobData] = useState({
    title: "",
    companyName: "",
    companyDescription: "",
    companyLogo: "",
    location: "",
    isRemote: false,
    jobType: "Full-time",
    description: "",
    responsibilities: [""],
    requirements: [""],
    benefits: [""],
    skills: [""],
    experienceLevel: "Entry Level",
    educationLevel: "",
    salary: {
      min: "",
      max: "",
      currency: "USD",
      paymentType: "annual",
      isNegotiable: false,
    },
    deadline: "",
    startDate: "",
    projectDuration: "",
    numberOfOpenings: 1,
  });

  // Options for select fields
  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Project-based",
  ];
  const experienceLevels = [
    "Entry Level",
    "Intermediate",
    "Senior",
    "Manager",
    "Director",
    "Executive",
  ];
  const educationLevels = [
    "High School",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "No Requirement",
  ];
  const paymentTypes = [
    { value: "hourly", label: "Per Hour" },
    { value: "monthly", label: "Per Month" },
    { value: "annual", label: "Per Year" },
    { value: "fixed", label: "Fixed Price" },
  ];
  const currencies = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "INR", label: "INR (₹)" },
    { value: "AUD", label: "AUD (A$)" },
    { value: "CAD", label: "CAD (C$)" },
  ];

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/job/${id}`, {
        withCredentials: true,
      });

      // Fill the form with existing job data
      const job = response.data;
      setJobData({
        title: job.title || "",
        companyName: job.companyName || "",
        companyDescription: job.companyDescription || "",
        companyLogo: job.companyLogo || "",
        location: job.location || "",
        isRemote: job.isRemote || false,
        jobType: job.jobType || "Full-time",
        description: job.description || "",
        responsibilities: job.responsibilities?.length
          ? job.responsibilities
          : [""],
        requirements: job.requirements?.length ? job.requirements : [""],
        benefits: job.benefits?.length ? job.benefits : [""],
        skills: job.skills?.length ? job.skills : [""],
        experienceLevel: job.experienceLevel || "Entry Level",
        educationLevel: job.educationLevel || "",
        salary: {
          min: job.salary?.min || "",
          max: job.salary?.max || "",
          currency: job.salary?.currency || "USD",
          paymentType: job.salary?.paymentType || "annual",
          isNegotiable: job.salary?.isNegotiable || false,
        },
        deadline: job.deadline
          ? new Date(job.deadline).toISOString().split("T")[0]
          : "",
        startDate: job.startDate
          ? new Date(job.startDate).toISOString().split("T")[0]
          : "",
        projectDuration: job.projectDuration || "",
        numberOfOpenings: job.numberOfOpenings || 1,
      });
    } catch (err) {
      console.error("Error fetching job details:", err);
      toast.error("Failed to load job details");
      setFormError("Could not load job data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setJobData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setJobData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleArrayInputChange = (type, index, value) => {
    setJobData((prev) => {
      const newArray = [...prev[type]];
      newArray[index] = value;
      return {
        ...prev,
        [type]: newArray,
      };
    });
  };

  const addArrayItem = (type) => {
    setJobData((prev) => ({
      ...prev,
      [type]: [...prev[type], ""],
    }));
  };

  const removeArrayItem = (type, index) => {
    setJobData((prev) => {
      const newArray = [...prev[type]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [type]: newArray.length ? newArray : [""],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      // Validate required fields
      if (!jobData.title || !jobData.companyName || !jobData.description) {
        throw new Error("Please fill all required fields");
      }

      // Format data for submission
      const formattedData = {
        ...jobData,
        responsibilities: jobData.responsibilities.filter((item) =>
          item.trim()
        ),
        requirements: jobData.requirements.filter((item) => item.trim()),
        benefits: jobData.benefits.filter((item) => item.trim()),
        skills: jobData.skills.filter((item) => item.trim()),
      };

      let response;
      if (isEdit) {
        response = await axios.put(`${API_URL}/job/${id}`, formattedData, {
          withCredentials: true,
        });
        toast.success("Job updated successfully!");
      } else {
        response = await axios.post(`${API_URL}/job`, formattedData, {
          withCredentials: true,
        });
        toast.success("Job posted successfully!");
      }

      // Navigate to job details page
      navigate(`/jobs/job/${response.data._id || id}`);
    } catch (err) {
      console.error("Error submitting job:", err);
      setFormError(err.message || "Failed to submit job. Please try again.");
      toast.error(err.response?.data?.message || "Failed to submit job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      navigate(`/jobs/job/${id}`);
    } else {
      navigate("/jobs");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 border-b border-gray-200 pb-5">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Job Posting" : "Create New Job Posting"}
            </h1>
            <p className="mt-1 text-gray-600">
              {isEdit
                ? "Update your job listing with detailed information to attract the best candidates."
                : "Provide detailed information about the job to attract the right candidates."}
            </p>
          </div>

          {formError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-700">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-orange-500" />
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={jobData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="companyName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        required
                        value={jobData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                        placeholder="e.g. Tech Innovations Inc."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="companyLogo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Company Logo URL
                      </label>
                      <input
                        type="url"
                        id="companyLogo"
                        name="companyLogo"
                        value={jobData.companyLogo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="companyDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company Description
                    </label>
                    <textarea
                      id="companyDescription"
                      name="companyDescription"
                      rows="3"
                      value={jobData.companyDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                      placeholder="Brief description about your company..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Location
                      </label>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 absolute ml-3" />
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={jobData.location}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                          placeholder="e.g. New York, NY"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="jobType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="jobType"
                        name="jobType"
                        required
                        value={jobData.jobType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                      >
                        {jobTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isRemote"
                      name="isRemote"
                      checked={jobData.isRemote}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isRemote"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      This is a remote position
                    </label>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-500" />
                  Job Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="6"
                      required
                      value={jobData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                      placeholder="Detailed description of the job role..."
                    ></textarea>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsibilities
                    </label>
                    <div className="space-y-2">
                      {jobData.responsibilities.map((responsibility, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={responsibility}
                            onChange={(e) =>
                              handleArrayInputChange(
                                "responsibilities",
                                index,
                                e.target.value
                              )
                            }
                            className="flex-1 px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                            placeholder="Add a responsibility..."
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("responsibilities", index)
                            }
                            className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                            disabled={
                              jobData.responsibilities.length === 1 &&
                              !jobData.responsibilities[0]
                            }
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("responsibilities")}
                        className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Responsibility
                      </button>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <div className="space-y-2">
                      {jobData.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={requirement}
                            onChange={(e) =>
                              handleArrayInputChange(
                                "requirements",
                                index,
                                e.target.value
                              )
                            }
                            className="flex-1 px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                            placeholder="Add a requirement..."
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("requirements", index)
                            }
                            className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                            disabled={
                              jobData.requirements.length === 1 &&
                              !jobData.requirements[0]
                            }
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("requirements")}
                        className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Requirement
                      </button>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits
                    </label>
                    <div className="space-y-2">
                      {jobData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) =>
                              handleArrayInputChange(
                                "benefits",
                                index,
                                e.target.value
                              )
                            }
                            className="flex-1 px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                            placeholder="Add a benefit..."
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("benefits", index)}
                            className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                            disabled={
                              jobData.benefits.length === 1 &&
                              !jobData.benefits[0]
                            }
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("benefits")}
                        className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Benefit
                      </button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Skills
                    </label>
                    <div className="space-y-2">
                      {jobData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) =>
                              handleArrayInputChange(
                                "skills",
                                index,
                                e.target.value
                              )
                            }
                            className="flex-1 px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                            placeholder="Add a skill..."
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("skills", index)}
                            className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                            disabled={
                              jobData.skills.length === 1 && !jobData.skills[0]
                            }
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("skills")}
                        className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Skill
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Qualifications and Compensation */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                  Qualifications and Compensation
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="experienceLevel"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Experience Level
                      </label>
                      <select
                        id="experienceLevel"
                        name="experienceLevel"
                        value={jobData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                      >
                        {experienceLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="educationLevel"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Education Level
                      </label>
                      <select
                        id="educationLevel"
                        name="educationLevel"
                        value={jobData.educationLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                      >
                        <option value="">Select Education Level</option>
                        {educationLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="salary.currency"
                          className="block text-xs text-gray-500 mb-1"
                        >
                          Currency
                        </label>
                        <select
                          id="salary.currency"
                          name="salary.currency"
                          value={jobData.salary.currency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                        >
                          {currencies.map((currency) => (
                            <option key={currency.value} value={currency.value}>
                              {currency.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="salary.min"
                          className="block text-xs text-gray-500 mb-1"
                        >
                          Minimum
                        </label>
                        <input
                          type="number"
                          id="salary.min"
                          name="salary.min"
                          min="0"
                          value={jobData.salary.min}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                          placeholder="Min salary"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="salary.max"
                          className="block text-xs text-gray-500 mb-1"
                        >
                          Maximum
                        </label>
                        <input
                          type="number"
                          id="salary.max"
                          name="salary.max"
                          min="0"
                          value={jobData.salary.max}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                          placeholder="Max salary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="salary.paymentType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Payment Type
                      </label>
                      <select
                        id="salary.paymentType"
                        name="salary.paymentType"
                        value={jobData.salary.paymentType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                      >
                        {paymentTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="numberOfOpenings"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Number of Openings
                      </label>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-gray-400 absolute ml-3" />
                        <input
                          type="number"
                          id="numberOfOpenings"
                          name="numberOfOpenings"
                          min="1"
                          value={jobData.numberOfOpenings}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="salary.isNegotiable"
                      name="salary.isNegotiable"
                      checked={jobData.salary.isNegotiable}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="salary.isNegotiable"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Salary is negotiable
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                  Additional Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="deadline"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={jobData.deadline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Expected Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={jobData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {(jobData.jobType === "Freelance" ||
                    jobData.jobType === "Project-based" ||
                    jobData.jobType === "Contract") && (
                    <div>
                      <label
                        htmlFor="projectDuration"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Project Duration
                      </label>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 absolute ml-3" />
                        <input
                          type="text"
                          id="projectDuration"
                          name="projectDuration"
                          value={jobData.projectDuration}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                          placeholder="e.g. 3 months, 6 weeks"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all ${
                      submitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting
                      ? "Submitting..."
                      : isEdit
                      ? "Update Job"
                      : "Post Job"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobCreationForm;
