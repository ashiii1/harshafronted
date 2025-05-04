import { useEffect, useState } from "react";
import CardsContainer from "./CardsContainer";
import IdeaHeader from "./IdeaHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Utils/constants";
import Pagination from "../../Common/Pagination";

const IdeasMainpage = () => {
  const navigate = useNavigate();
  const [allIdeasData, setAllIdeasData] = useState([]);
  const [viewMode, setViewMode] = useState("all");
  const [filterParams, setFilterParams] = useState({
    category: "all",
    sortBy: "latest",
    status: "all",
    searchTerm: "",
    viewMode: "all",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Pagination - fixed limit to 8 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ideasPerPage, setIdeasPerPage] = useState(8);

  useEffect(() => {
    // Update filter params when viewMode changes
    setFilterParams((prevParams) => ({
      ...prevParams,
      viewMode: viewMode,
    }));
  }, [viewMode]);

  useEffect(() => {
    callAllIdeasApi();
  }, [filterParams, currentPage, ideasPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const callAllIdeasApi = async () => {
    setIsLoading(true);
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
      queryParams.append("limit", ideasPerPage);

      const url = `${API_URL}/ideas/?${queryParams.toString()}`;
      console.log("Fetching ideas with URL:", url);

      const response = await axios.get(url, {
        withCredentials: true,
      });

      setAllIdeasData(response.data.data);
      setTotalPages(Math.ceil(response.data.count / ideasPerPage));
    } catch (error) {
      console.error("Error fetching ideas:", error);
      if (error.response?.status === 403) {
        navigate("/signin");
      }
    } finally {
      setIsLoading(false);
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
    <div className="IdeasMainpage w-full">
      <IdeaHeader
        onFilterChange={handleFilterChange}
        toggleViewMode={toggleViewMode}
        activeViewMode={viewMode}
        searchTerm={filterParams.searchTerm}
      />
      <div className="max-w-[1600px] mx-auto">
        <CardsContainer allIdeasData={allIdeasData} isLoading={isLoading} />
        {!isLoading && totalPages > 0 && (
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

export default IdeasMainpage;
