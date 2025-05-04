/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Bookmark,
  Star,
  Flame,
  CheckCircle2,
  Users,
  Clock,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  UserGroupIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const TagBadge = ({ text }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 ring-1 ring-orange-100 shadow-sm">
    {text}
  </span>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: {
      bg: "bg-gray-50",
      text: "text-gray-600",
      border: "border-gray-200",
    },
    active: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
    },
    completed: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    trending: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-200",
    },
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}
    >
      {status === "draft" && <Clock className="w-3 h-3 mr-1" />}
      {status === "active" && <Flame className="w-3 h-3 mr-1" />}
      {status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
      {status === "trending" && <Star className="w-3 h-3 mr-1" />}
      <span className="capitalize">{status}</span>
    </span>
  );
};

const IdeaCard = ({ idea }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const isFeatured = idea.featured || Math.random() > 0.7;
  const isHot = idea.likes > 20 || Math.random() > 0.8;

  // Calculate stats
  const totalEngagement =
    (idea.likes || 0) +
    (idea.comments?.length || 0) +
    (idea.supporters?.length || 0);
  const engagementScore = Math.min(
    100,
    Math.round((totalEngagement / 50) * 100)
  );

  // Determine status
  const getStatus = () => {
    if (idea.status) return idea.status;
    if (isHot) return "trending";
    if (isFeatured) return "active";
    return "active";
  };

  // Calculate members needed or supporters needed
  const membersNeeded = idea.membersNeeded || Math.floor(Math.random() * 5) + 1;

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 h-full">
      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        {/* Owner info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={
                  idea?.owner?.profileImageUrl ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt={idea.owner.username}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white shadow-sm"
              />
              {idea.owner.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900 line-clamp-1">
                {idea.owner.username}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(idea.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <StatusBadge status={getStatus()} />

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                bookmarked
                  ? "text-amber-500 bg-amber-50"
                  : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
              }`}
            >
              <Bookmark
                className="h-4 w-4"
                fill={bookmarked ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 min-h-[38px]">
          {idea.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4 group-hover:text-gray-700 transition-colors duration-300">
          {idea.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
          {idea.tags.slice(0, 3).map((tag, index) => (
            <TagBadge key={index} text={tag} />
          ))}
          {idea.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
              +{idea.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Interactions */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
            <HeartIcon className="h-4 w-4" />
            <span className="ml-1 text-xs font-medium">{idea.likes || 0}</span>
          </div>

          <div className="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
            <ChatBubbleOvalLeftIcon className="h-4 w-4" />
            <span className="ml-1 text-xs font-medium">
              {idea.comments?.length || 0}
            </span>
          </div>

          <div className="flex items-center text-gray-500 hover:text-green-500 transition-colors">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">
              {membersNeeded} supporters
            </span>
          </div>
        </div>

        <Link to={`/pitchideas/idea/${idea._id}`}>
          <button className="flex items-center text-orange-500 hover:text-orange-600 text-xs font-medium transition-colors">
            View Details
            <ChevronRightIcon className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};

const CardsContainer = ({ allIdeasData = [], isLoading = false }) => {
  if (isLoading) {
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
            Loading ideas...
          </h3>
          <p className="mt-1 text-sm text-gray-500">This won't take long.</p>
        </div>
      </div>
    );
  }

  if (!allIdeasData.length) {
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-1">No Ideas Available</h3>
          <p className="text-sm">Share your ideas or check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 py-4 sm:py-6">
        {allIdeasData.map((idea, index) => (
          <div
            key={idea._id || index}
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <IdeaCard idea={idea} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsContainer;
