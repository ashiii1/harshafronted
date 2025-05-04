/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import JobHeader from "./JobHeader";
import Pagination from "../../Common/Pagination";
import { API_URL } from "../../Utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertTriangle } from "lucide-react";

const JobCard = ({ job }) => {
  const {
    companyLogo = "https://via.placeholder.com/80",
    company = "Company Name",
    position = "Job Position",
    location = "Location not specified",
    agoTime = "Posted recently",
    jobUrl = "#",
  } = job || {};

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full p-4 sm:p-5">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <img
            src={companyLogo}
            alt={`${company} Logo`}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-gray-200 object-contain p-0.5"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/80";
            }}
          />
        </div>

        <div className="flex-grow min-w-0">
          <h3
            className="text-sm sm:text-base font-semibold text-gray-800 truncate"
            title={company}
          >
            {company}
          </h3>
          <p
            className="text-base sm:text-lg font-bold text-gray-900 truncate mt-0.5"
            title={position}
          >
            {position}
          </p>
          <p
            className="text-xs sm:text-sm text-gray-500 mt-1 truncate"
            title={location}
          >
            {location}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">{agoTime}</p>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link
          to={jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 hover:opacity-90 shadow-sm hover:shadow-md"
        >
          View Job
        </Link>
      </div>
    </div>
  );
};

const JobsPageLinkedin = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/job/all`, {
        withCredentials: true,
      });
      if (response?.data?.response && Array.isArray(response.data.response)) {
        console.log(response.data.response);
        setJobs(response.data.response);
      } else {
        console.warn("Unexpected API response structure:", response.data);
        setJobs([]);
        setError("Could not load jobs due to unexpected data format.");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message || "Failed to fetch jobs. Please try again later.");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <JobHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-20 px-6 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Oops! Could not load jobs.
            </h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-5 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {currentJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {currentJobs.map((eachJob, index) => (
                  <JobCard key={eachJob.id || index} job={eachJob} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-6 bg-gray-100 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Jobs Found
                </h3>
                <p className="text-sm text-gray-500">
                  There are currently no open positions matching your criteria.
                </p>
              </div>
            )}

            {jobs.length > jobsPerPage && (
              <div className="mt-12 md:mt-16">
                <Pagination
                  currentPage={currentPage}
                  totalItems={jobs.length}
                  itemsPerPage={jobsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobsPageLinkedin;
