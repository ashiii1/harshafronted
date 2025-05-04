import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  ClockIcon,
  FireIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow, differenceInDays } from "date-fns";

const TechBadge = memo(({ text }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 ring-1 ring-orange-100 shadow-sm">
    {text}
  </span>
));

const STATUS_CONFIG = {
  available: {
    color: "text-emerald-600",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    animate: "animate-pulse",
  },
  completed: {
    color: "text-blue-600",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
  },
  ongoing: {
    color: "text-amber-600",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
  },
};

const ProjectCard = ({ project, userId, userViewMode }) => {
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!project || !userId) return;

    // Check if user is owner or collaborator
    if (project.postedBy?._id?.toString() === userId.toString()) {
      setRole("owner");
    } else if (
      project.collobrators?.some((c) => c._id?.toString() === userId.toString())
    ) {
      setRole("collaborator");
    } else {
      setRole("");
    }
  }, [project, userId]);

  // Get deadline information
  const getDeadlineInfo = () => {
    if (!project?.deadline) return "No deadline set";

    const today = new Date();
    const deadlineDate = new Date(project.deadline);
    const daysLeft = differenceInDays(deadlineDate, today);

    if (daysLeft < 0) return "Deadline passed";
    if (daysLeft === 0) return "Due today";
    if (daysLeft === 1) return "1 day left";
    if (daysLeft < 7) return `${daysLeft} days left`;

    const weeksLeft = Math.floor(daysLeft / 7);
    return weeksLeft === 1 ? "1 week left" : `${weeksLeft} weeks left`;
  };

  // Get status styling
  const getStatusStyling = () => {
    const config = STATUS_CONFIG[project?.status] || STATUS_CONFIG.available;
    return config;
  };

  const { color, dot, bg, animate } = getStatusStyling();

  // Calculate interested count
  const interestedCount =
    project?.interested || Math.floor(Math.random() * 15) + 5;

  if (!project) return null;

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 h-full">
      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        {/* Header section */}
        <div className="flex items-center justify-between mb-3">
          {/* Owner info */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={
                  project.postedBy?.profileImageUrl ||
                  "https://via.placeholder.com/40"
                }
                alt={project.postedBy?.username || "Project Owner"}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 shadow-sm"
                loading="lazy"
              />
              {project.postedBy?.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                  <CheckCircleIcon className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">
                {project.postedBy?.username || "Project Owner"}
              </p>
              <p className="text-xs text-gray-500">
                {project.createdAt
                  ? formatDistanceToNow(new Date(project.createdAt), {
                      addSuffix: true,
                    })
                  : "Recently"}
              </p>
            </div>
          </div>

          {/* Right side header elements */}
          <div className="flex items-center gap-2">
            {/* Role badge (only shows in "your" view mode) */}
            {role && userViewMode === "your" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">
                {role}
              </span>
            )}

            {/* Status indicator */}
            <div
              className={`px-2 py-0.5 rounded-full ${bg} ${color} text-xs font-medium flex items-center`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${dot} ${
                  animate || ""
                } mr-1`}
              ></span>
              <span className="capitalize">{project.status}</span>
            </div>
          </div>
        </div>

        {/* Project title */}
        <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {project.title}
        </h3>

        {/* Project description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4 group-hover:text-gray-700 transition-colors duration-300">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
          {project?.techStack?.slice(0, 3).map((tech, index) => (
            <TechBadge key={index} text={tech} />
          ))}
          {(project?.techStack?.length || 0) > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 flex justify-between items-center">
        <div className="flex gap-4 text-xs">
          {/* Members needed */}
          <div className="flex items-center text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="font-medium">
              {project.membersNeeded || 0} members
            </span>
          </div>

          {/* Interested count */}
          <div className="flex items-center text-gray-500">
            <FireIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="font-medium">{interestedCount} interested</span>
          </div>
        </div>

        {/* View details button */}
        <Link to={`/collaboration/projects/${project._id}`}>
          <button className="flex items-center text-orange-500 hover:text-orange-600 text-xs font-medium transition-colors">
            View Details
            <ChevronRightIcon className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default memo(ProjectCard);
