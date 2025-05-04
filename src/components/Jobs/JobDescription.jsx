import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Award,
  DollarSign,
  User,
  ChevronLeft,
  Share2,
  Bookmark,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Upload,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../Utils/constants";
import { toast } from "react-hot-toast";

const JobDescription = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [application, setApplication] = useState({
    coverLetter: "",
    resumeUrl: "",
    proposedRate: "",
    estimatedCompletionTime: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/job/${id}`, {
          withCredentials: true,
        });
        setJob(response.data);

        // Check if user has already applied
        const userApplications = response.data.applications || [];
        setHasApplied(userApplications.some((app) => app.applicant === userId)); // userId would need to be retrieved from auth context
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const formatSalary = (salary) => {
    if (!salary) return "Competitive";

    const { min, max, currency = "USD", paymentType, isNegotiable } = salary;

    let formattedSalary = "";

    if (min && max) {
      formattedSalary = `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      formattedSalary = `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      formattedSalary = `Up to ${currency} ${max.toLocaleString()}`;
    } else {
      return "Competitive";
    }

    if (paymentType) {
      const paymentDisplay = {
        hourly: "/hour",
        monthly: "/month",
        annual: "/year",
        fixed: " (fixed)",
      };
      formattedSalary += paymentDisplay[paymentType] || "";
    }

    if (isNegotiable) {
      formattedSalary += " (Negotiable)";
    }

    return formattedSalary;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
  };

  const uploadResume = async () => {
    if (!resumeFile) return null;

    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const response = await axios.post(`${API_URL}/upload/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return response.data.url;
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw new Error("Failed to upload resume");
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload resume if provided
      let resumeUrl = application.resumeUrl;
      if (resumeFile) {
        resumeUrl = await uploadResume();
      }

      // Submit application
      const response = await axios.post(
        `${API_URL}/job/${id}/apply`,
        { ...application, resumeUrl },
        { withCredentials: true }
      );

      toast.success("Application submitted successfully!");
      setShowApplyForm(false);
      setHasApplied(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="bg-red-50 p-6 rounded-lg max-w-lg mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error Loading Job
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/jobs"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="bg-orange-50 p-6 rounded-lg max-w-lg mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-orange-700 mb-2">
            Job Not Found
          </h2>
          <p className="text-orange-600 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/jobs"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="font-medium">Back to Jobs</span>
            </Link>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-lg border border-gray-200 bg-white flex items-center justify-center p-1 shadow-sm">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-14 h-14 object-contain rounded"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/56?text=Logo";
                      }}
                    />
                  ) : (
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {job.title}
                  </h1>
                  <p className="text-lg text-gray-700 mb-3">
                    {job.companyName}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      <span>
                        {job.location} {job.isRemote && "(Remote)"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1 text-gray-500" />
                      <span>{job.jobType}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1 text-gray-500" />
                      <span>{job.experienceLevel}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-500" />
                      <span>{job.timePosted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <div
                className={`prose max-w-none text-gray-700 ${
                  showFullDescription
                    ? ""
                    : "max-h-[300px] overflow-hidden relative"
                }`}
              >
                <p className="whitespace-pre-line">{job.description}</p>

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Responsibilities
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {job.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.requirements && job.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Requirements
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {job.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Benefits
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {job.benefits.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!showFullDescription && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>

              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-4 flex items-center text-orange-500 hover:text-orange-600 font-medium text-sm"
              >
                {showFullDescription ? (
                  <>
                    Show Less <ChevronUp className="ml-1 w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="ml-1 w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Skills Section */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Form */}
            {!hasApplied && showApplyForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Apply for this Job
                </h2>
                <form onSubmit={handleApply}>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="coverLetter"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Cover Letter
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        rows="6"
                        required
                        value={application.coverLetter}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder-gray-500"
                        placeholder="Introduce yourself and explain why you're a good fit for this role..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resume / CV
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 cursor-pointer border border-dashed border-orange-300 bg-orange-50 rounded-lg px-4 py-3 hover:bg-orange-100 transition-colors">
                          <div className="flex items-center justify-center">
                            <Upload className="w-5 h-5 text-orange-500 mr-2" />
                            <span className="text-sm text-orange-700">
                              {resumeFile
                                ? resumeFile.name
                                : "Click to upload your resume"}
                            </span>
                          </div>
                          <input
                            type="file"
                            onChange={handleResumeChange}
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                          />
                        </label>
                        {resumeFile && (
                          <button
                            type="button"
                            onClick={() => setResumeFile(null)}
                            className="p-2 text-gray-500 hover:text-red-500"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted formats: PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </div>

                    {job.jobType === "Freelance" ||
                    job.jobType === "Project-based" ? (
                      <>
                        <div>
                          <label
                            htmlFor="proposedRate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Proposed Rate
                          </label>
                          <input
                            type="text"
                            id="proposedRate"
                            name="proposedRate"
                            value={application.proposedRate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder-gray-500"
                            placeholder="e.g. $50/hour or $5,000 total"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="estimatedCompletionTime"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Estimated Completion Time
                          </label>
                          <input
                            type="text"
                            id="estimatedCompletionTime"
                            name="estimatedCompletionTime"
                            value={application.estimatedCompletionTime}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder-gray-500"
                            placeholder="e.g. 2 weeks, 1 month"
                          />
                        </div>
                      </>
                    ) : null}

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows="3"
                        value={application.notes}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder-gray-500"
                        placeholder="Any additional information you'd like to share..."
                      ></textarea>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all ${
                          submitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowApplyForm(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Salary
                    </h3>
                    <p className="text-gray-900">{formatSalary(job.salary)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Application Deadline
                    </h3>
                    <p className="text-gray-900">
                      {job.deadline
                        ? formatDate(job.deadline)
                        : "Open until filled"}
                    </p>
                  </div>
                </div>

                {job.startDate && (
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Start Date
                      </h3>
                      <p className="text-gray-900">
                        {formatDate(job.startDate)}
                      </p>
                    </div>
                  </div>
                )}

                {job.educationLevel && (
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Education
                      </h3>
                      <p className="text-gray-900">{job.educationLevel}</p>
                    </div>
                  </div>
                )}

                {job.projectDuration && (
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Project Duration
                      </h3>
                      <p className="text-gray-900">{job.projectDuration}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Posted By
                    </h3>
                    <p className="text-gray-900">
                      {job.postedBy?.username || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info and Apply Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About the Company
              </h2>
              <p className="text-gray-600 mb-6">
                {job.companyDescription ||
                  `${job.companyName} is looking for talented professionals to join their team.`}
              </p>

              {hasApplied ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium text-green-700">
                    Application Submitted
                  </h3>
                  <p className="text-sm text-green-600 mt-1">
                    You've already applied for this position.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyForm(!showApplyForm)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {showApplyForm
                    ? "Hide Application Form"
                    : "Apply for this Job"}
                  {!showApplyForm && <ArrowUpRight className="w-4 h-4" />}
                </button>
              )}

              {job.deadline && new Date(job.deadline) < new Date() && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <p className="text-sm text-red-600">
                    Application deadline has passed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
