/* eslint-disable react/prop-types */

import { useSelector } from "react-redux";
import ProjectCard from "./ProjectCard";

const CollabContainer = ({ allProjects, loading, userViewMode }) => {
  const user = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <svg
            className="mx-auto h-10 w-10 text-gray-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <h3 className="mt-3 text-base font-medium text-gray-900">
            Loading projects...
          </h3>
          <p className="mt-1 text-sm text-gray-500">This won't take long.</p>
        </div>
      </div>
    );
  }

  if (!allProjects.length) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-gray-50 rounded-lg mx-4">
        <div className="text-center text-gray-600">
          <div className="mb-3">
            <svg
              className="w-12 h-12 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-1">No Projects Available</h3>
          <p className="text-sm">Check back later or create a new project.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 py-4 sm:py-6">
        {allProjects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            userId={user._id}
            userViewMode={userViewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default CollabContainer;
