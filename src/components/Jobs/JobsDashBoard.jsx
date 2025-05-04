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
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";

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
                <ChevronUp className="w-3 h-3 mr-1" />
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

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-lg transition-colors ${
      active ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const JobCard = ({ job, onStatusChange }) => {
  const statusColors = {
    draft: "bg-gray-100 text-gray-600",
    published: "bg-green-100 text-green-700",
    closed: "bg-red-100 text-red-700",
    filled: "bg-blue-100 text-blue-700",
    expired: "bg-orange-100 text-orange-700",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(
        `${API_URL}/job/${job._id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      onStatusChange(job._id, newStatus);
      toast.success(`Job status changed to ${newStatus}`);
    } catch (error) {
      console.error("Error changing job status:", error);
      toast.error("Failed to update job status");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gray-100 flex items-center justify-center">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-10 h-10 rounded-lg object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40?text=Logo";
                }}
              />
            ) : (
              <Briefcase className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.companyName}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  statusColors[job.status]
                }`}
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {job.jobType}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {job.applicationCount || 0} Applications
              </span>
            </div>
          </div>
        </div>
        <div className="text-center sm:text-right mt-3 sm:mt-0">
          <div className="relative group">
            <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
              Actions <ChevronDown className="w-4 h-4 ml-1 inline" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 hidden group-hover:block z-10">
              <div className="py-1">
                <Link
                  to={`/jobs/job/${job._id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Details
                </Link>
                <Link
                  to={`/jobs/edit/${job._id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Job
                </Link>
                <button
                  onClick={() =>
                    handleStatusChange(
                      job.status === "published" ? "closed" : "published"
                    )
                  }
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {job.status === "published" ? "Close Job" : "Publish Job"}
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {job.deadline
              ? `Deadline: ${formatDate(job.deadline)}`
              : "No deadline set"}
          </p>
        </div>
      </div>
    </div>
  );
};

const ApplicationCard = ({ application }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    reviewing: "bg-blue-100 text-blue-700",
    shortlisted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    hired: "bg-purple-100 text-purple-700",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gray-100 flex items-center justify-center">
            {application.job.companyLogo ? (
              <img
                src={application.job.companyLogo}
                alt={application.job.companyName}
                className="w-10 h-10 rounded-lg object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40?text=Logo";
                }}
              />
            ) : (
              <Briefcase className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 text-lg">
              {application.job.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {application.job.companyName}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  statusColors[application.application.status]
                }`}
              >
                {application.application.status.charAt(0).toUpperCase() +
                  application.application.status.slice(1)}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                Applied: {formatDate(application.application.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 sm:mt-0 text-center sm:text-right">
          <Link
            to={`/jobs/job/${application.job._id}?application=${application.application._id}`}
            className="text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            View Details
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
        {type === "jobs" ? (
          <Briefcase className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
        ) : (
          <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
        )}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
        {type === "jobs" ? "No Jobs Posted Yet" : "No Applications Yet"}
      </h3>
      <p className="text-gray-500 mb-4 sm:mb-6 text-sm">
        {type === "jobs"
          ? "Start posting jobs to find the talent you need."
          : "Start applying to jobs to track your applications."}
      </p>
      {type === "jobs" && (
        <button
          onClick={onCreate}
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job Posting
        </button>
      )}
      {type === "applications" && (
        <Link
          to="/jobs"
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          <Search className="w-4 h-4 mr-2" />
          Browse Jobs
        </Link>
      )}
    </div>
  );
};

const JobsDashBoard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posted");
  const [stats, setStats] = useState({
    asEmployer: {
      postedJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      closedJobs: 0,
      drafts: 0,
    },
    asApplicant: {
      appliedJobs: 0,
      pending: 0,
      reviewing: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    },
  });
  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jobsFilter, setJobsFilter] = useState("all");

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/job/stats/overview`, {
        withCredentials: true,
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching job stats:", error);
      toast.error("Failed to load job statistics");
    }
  };

  const fetchPostedJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/job/my/posted`, {
        withCredentials: true,
        params: {
          status: jobsFilter !== "all" ? jobsFilter : undefined,
        },
      });
      setPostedJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching posted jobs:", error);
      toast.error("Failed to load your job postings");
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API_URL}/job/applications/my`, {
        withCredentials: true,
      });
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      toast.error("Failed to load your job applications");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          fetchPostedJobs(),
          fetchApplications(),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchPostedJobs();
  }, [jobsFilter]);

  const handleStatusChange = (jobId, newStatus) => {
    setPostedJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, status: newStatus } : job
      )
    );
    fetchStats(); // Refresh stats after status change
  };

  const handleCreateJob = () => {
    navigate("/jobs/create");
  };

  const filteredPostedJobs = postedJobs;

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Jobs Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your job postings and applications
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
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                  <h3 className="font-medium text-gray-900">
                    Find Freelancers
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Browse skilled professionals
                  </p>
                </Link>

                <Link
                  to="/freelancer/register"
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
                </Link>

                <Link
                  to="/jobs"
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
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
                  title="Active Jobs"
                  value={stats.asEmployer.activeJobs}
                  icon={Briefcase}
                  color="blue"
                />
                <StatCard
                  title="Total Applications"
                  value={stats.asEmployer.totalApplications}
                  icon={FileText}
                  color="green"
                />
                <StatCard
                  title="Applied Jobs"
                  value={stats.asApplicant.appliedJobs}
                  icon={ArrowUpRight}
                  color="orange"
                />
                <StatCard
                  title="Interview Stage"
                  value={
                    stats.asApplicant.reviewing + stats.asApplicant.shortlisted
                  }
                  icon={Users}
                  color="purple"
                />
              </div>
            </section>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6 sm:mb-8 p-1 inline-flex">
              <TabButton
                active={activeTab === "posted"}
                onClick={() => setActiveTab("posted")}
              >
                Posted Jobs
              </TabButton>
              <TabButton
                active={activeTab === "applications"}
                onClick={() => setActiveTab("applications")}
              >
                My Applications
              </TabButton>
            </div>

            {/* Job Listings Section */}
            {activeTab === "posted" && (
              <section>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-3 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Your Job Posts
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <select
                        value={jobsFilter}
                        onChange={(e) => setJobsFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:border-orange-500 focus:ring-orange-500 w-full"
                      >
                        <option value="all">All Jobs</option>
                        <option value="published">Active</option>
                        <option value="draft">Drafts</option>
                        <option value="closed">Closed</option>
                        <option value="filled">Filled</option>
                      </select>
                      <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>
                    <button
                      onClick={handleCreateJob}
                      className="flex items-center justify-center bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Post Job
                    </button>
                  </div>
                </div>

                {filteredPostedJobs.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredPostedJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="jobs" onCreate={handleCreateJob} />
                )}
              </section>
            )}

            {/* Applications Section */}
            {activeTab === "applications" && (
              <section>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-3 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Your Applications
                  </h2>
                  <div className="flex overflow-x-auto pb-2 sm:pb-0">
                    <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-xs sm:text-sm whitespace-nowrap">
                      <div className="flex items-center pr-3">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400 mr-1.5"></div>
                        <span className="text-gray-600">
                          Pending: {stats.asApplicant.pending}
                        </span>
                      </div>
                      <div className="flex items-center px-3 border-l border-gray-200">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-400 mr-1.5"></div>
                        <span className="text-gray-600">
                          Reviewing: {stats.asApplicant.reviewing}
                        </span>
                      </div>
                      <div className="flex items-center px-3 border-l border-gray-200">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 mr-1.5"></div>
                        <span className="text-gray-600">
                          Shortlisted: {stats.asApplicant.shortlisted}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {applications.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {applications.map((app) => (
                      <ApplicationCard
                        key={app.application._id}
                        application={app}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="applications" />
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobsDashBoard;
