import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Eye, BookmarkPlus } from "lucide-react";

const VideoInfo = ({ video = {} }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video?.stats?.likes || 0);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Ensure we have valid data
  const videoId =
    video?.id ||
    video?._id ||
    `video-${Math.random().toString(36).substr(2, 9)}`;
  const videoTitle = video?.title || "Untitled Video";
  const videoDescription = video?.description || "";
  const videoCategory = video?.category || "";
  const creator = video?.creator || {};
  const creatorName = creator?.name || "Anonymous";
  const creatorAvatar = creator?.avatar || null;
  const createdAt = video?.createdAt || new Date();
  const stats = video?.stats || { comments: 0, views: 0 };

  // Simple toast function
  const showToast = (title, description, type = "default") => {
    setToastMessage({ title, description, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // Check if user has liked the video (would connect to backend in production)
    const checkLikeStatus = async () => {
      try {
        // Mock implementation - replace with actual API call
        const hasLiked = localStorage.getItem(`liked-${videoId}`) === "true";
        setIsLiked(hasLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [videoId]);

  const handleLike = () => {
    try {
      // Toggle like state
      const newLikeState = !isLiked;
      setIsLiked(newLikeState);

      // Update like count
      setLikeCount((prev) => (newLikeState ? prev + 1 : Math.max(0, prev - 1)));

      // Store in localStorage (temporary solution)
      localStorage.setItem(`liked-${videoId}`, newLikeState);

      // Show toast notification
      showToast(
        newLikeState ? "Video liked" : "Video unliked",
        newLikeState
          ? "Added to your liked videos"
          : "Removed from your liked videos"
      );

      // Would call API to update like in production
    } catch (error) {
      console.error("Error handling like:", error);
      showToast("Error", "Could not update like status", "error");
    }
  };

  const handleSave = () => {
    try {
      setIsSaved(!isSaved);
      showToast(
        !isSaved ? "Video saved" : "Video unsaved",
        !isSaved
          ? "Added to your saved videos"
          : "Removed from your saved videos"
      );
    } catch (error) {
      console.error("Error handling save:", error);
      showToast("Error", "Could not update save status", "error");
    }
  };

  const handleShare = () => {
    try {
      // Copy video URL to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/videos/${videoId}`
      );
      showToast("Link copied", "Video link copied to clipboard");
    } catch (error) {
      console.error("Error sharing video:", error);
      showToast("Error", "Could not copy link to clipboard", "error");
    }
  };

  // Helper function to format date
  const formatDate = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Toast message */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-md ${
            toastMessage.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-gray-800 text-white"
          }`}
        >
          <h4 className="font-medium text-sm">{toastMessage.title}</h4>
          <p className="text-xs mt-1">{toastMessage.description}</p>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 border border-orange-100 rounded-full overflow-hidden flex items-center justify-center bg-orange-50 text-orange-500">
            {creatorAvatar ? (
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{creatorName?.charAt(0) || "U"}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-1">
              {videoTitle}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{creatorName}</span>
              <span>•</span>
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        {videoCategory && (
          <span className="px-2 py-1 text-xs rounded-full bg-orange-50 text-orange-700 border border-orange-200">
            {videoCategory}
          </span>
        )}
      </div>

      {videoDescription && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {videoDescription}
        </p>
      )}

      <div className="flex items-center justify-between border-t pt-3 mt-2">
        <div className="flex items-center gap-4">
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${
              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
            onClick={handleLike}
            title={isLiked ? "Unlike this video" : "Like this video"}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-xs">{likeCount}</span>
          </button>

          <button
            className="flex items-center gap-1 px-2 py-1 rounded text-gray-500 hover:text-blue-500 hover:bg-gray-100"
            title="Comment on this video"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{stats.comments || 0}</span>
          </button>

          <button
            className="flex items-center gap-1 px-2 py-1 rounded text-gray-500 hover:text-green-500 hover:bg-gray-100"
            onClick={handleShare}
            title="Share this video"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center text-xs text-gray-500">
            <Eye className="h-3.5 w-3.5 mr-1" />
            <span>{stats.views || 0}</span>
          </div>

          <button
            className={`p-1 rounded hover:bg-gray-100 ${
              isSaved
                ? "text-orange-500"
                : "text-gray-500 hover:text-orange-500"
            }`}
            onClick={handleSave}
            title={isSaved ? "Unsave this video" : "Save this video"}
          >
            <BookmarkPlus
              className={`h-4 w-4 ${isSaved ? "fill-orange-100" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
