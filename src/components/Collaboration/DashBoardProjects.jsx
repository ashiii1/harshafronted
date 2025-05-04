import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Utils/constants";
import CollabHeader from "./CollabHeader";
import Pagination from "../../Common/Pagination";
import CollabContainer from "./CollabContainer";

const DashBoardProjects = () => {
  const navigate = useNavigate();
  const [allProjectsData, setAllProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("all");
  const [filterParams, setFilterParams] = useState({
    category: "all",
    sortBy: "latest",
    status: "all",
    searchTerm: "",
    viewMode: "all",
  });

  // Pagination - fixed limit to 8 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(8);

  useEffect(() => {
    // Update filter params when viewMode changes
    setFilterParams((prevParams) => ({
      ...prevParams,
      viewMode: viewMode,
    }));
  }, [viewMode]);

  useEffect(() => {
    callAllProjectsApi();
  }, [filterParams, currentPage, projectsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const callAllProjectsApi = async () => {
    setLoading(true);
    try {
      // Add query parameters based on filterParams
      const queryParams = new URLSearchParams();

      if (filterParams.category !== "all") {
        queryParams.append("category", filterParams.category);
      }

      if (filterParams.status !== "all") {
        queryParams.append("status", filterParams.status);
      }

      queryParams.append("sortBy", filterParams.sortBy);

      if (filterParams.searchTerm) {
        queryParams.append("search", filterParams.searchTerm);
      }

      if (filterParams.viewMode === "your") {
        queryParams.append("viewMode", "your");
      }

      queryParams.append("page", currentPage);
      queryParams.append("limit", projectsPerPage);

      const url = `${API_URL}/collaboration/?${queryParams.toString()}`;
      console.log("Fetching projects with URL:", url);

      const response = await axios.get(url, {
        withCredentials: true,
      });

      setAllProjectsData(response.data.data);
      setTotalPages(Math.ceil(response.data.count / projectsPerPage));
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response?.status === 403) {
        navigate("/signin");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      ...newFilters,
      viewMode: viewMode, // Ensure viewMode is always synced
    }));
    setCurrentPage(1);
  };

  const toggleViewMode = (view) => {
    setViewMode(view);
    setCurrentPage(1);
  };

  return (
    <div className="DashBoardProjects w-full">
      <CollabHeader
        onFilterChange={handleFilterChange}
        toggleViewMode={toggleViewMode}
        activeViewMode={viewMode}
        searchTerm={filterParams.searchTerm}
      />
      <div className="max-w-[1600px] mx-auto">
        <CollabContainer
          allProjects={allProjectsData}
          loading={loading}
          userViewMode={viewMode}
        />
        {!loading && totalPages > 0 && (
          <div className="mt-4 mb-8 px-4 sm:px-6">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoardProjects;
