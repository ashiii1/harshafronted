import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  VolumeX,
  Volume2,
  MessageSquare,
  Share,
  ThumbsUp,
  Bookmark,
  Heart,
  ChevronUp,
  ChevronDown,
  X,
  PlusCircle,
  Award,
  Users,
  Lightbulb,
  Sparkles,
  Briefcase,
  Loader,
  Zap,
  CheckCircle,
  Send,
  LinkIcon,
  AlertCircle,
  TrendingUp,
  Tag,
  Globe,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  MessageCircle,
  Handshake,
  Coffee,
  Mail,
} from "lucide-react";
import { API_URL } from "../../Utils/constants";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

// ==========================================================================
// Helper components
// ==========================================================================

const ActionButton = ({ icon, label, count, onClick, active, color }) => {
  return (
    <button
      className="flex flex-col items-center"
      onClick={onClick}
      aria-label={label}
    >
      <div
        className={`p-2 rounded-full ${
          active
            ? `${color || "bg-[#3B82F6]/30"}`
            : "bg-black/40 hover:bg-black/60"
        } transition-colors`}
      >
        {React.cloneElement(icon, {
          size: 20,
          className: active
            ? color === "bg-red-500/30"
              ? "text-red-500"
              : "text-[#3B82F6]"
            : "text-white",
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs mt-1 font-medium text-white">
          {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
        </span>
      )}
    </button>
  );
};

// ==========================================================================
// Reel Card Component
// ==========================================================================
const ReelCard = ({
  reel,
  isActive,
  onNext,
  onPrev,
  onUpvote,
  onComment,
  onShare,
  onInteract,
  userInteractions,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Handle video playback when it becomes active
  useEffect(() => {
    if (isActive && videoRef.current) {
      // Only load the video when this card becomes active
      if (!isLoaded) {
        videoRef.current.load();
        setIsLoaded(true);
      }

      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay prevented:", err);
          setIsPlaying(false);
        });
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isLoaded]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => console.error("Play error:", err));
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (reel.creator?.id) {
      navigate(`/profile/${reel.creator.id}`);
    }
  };

  const getCategoryStyle = (category) => {
    if (!category) return "bg-gray-700 text-white";

    const categories = {
      startup:
        "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm",
      pitch:
        "bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-sm",
      story:
        "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-sm",
      collab:
        "bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white shadow-sm",
      demo: "bg-gradient-to-r from-cyan-600 to-sky-500 text-white shadow-sm",
      funding:
        "bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-sm",
    };

    const key = category.toLowerCase().replace(/[^a-z]/g, "");
    for (const [categoryKey, style] of Object.entries(categories)) {
      if (key.includes(categoryKey)) return style;
    }

    return "bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-sm";
  };

  // Add a new function to handle the interact button click
  const handleInteract = (e) => {
    e.stopPropagation();
    if (reel.creator?.id) {
      onInteract(reel.id, reel.creator, reel.category);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0d1117] overflow-hidden">
      <div className="relative w-full max-w-2xl h-full max-h-[70vh] bg-black/60 rounded-lg overflow-hidden shadow-lg flex mt-2">
        {/* Video container */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            src={reel.videoUrl}
            poster={reel.thumbnail || ""}
            className="h-full w-full object-cover"
            loop
            muted={isMuted}
            playsInline
            preload={isActive ? "auto" : "none"}
            onClick={togglePlay}
          />

          {/* Play/Pause overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                className="bg-white/20 rounded-full p-4 backdrop-blur-sm"
                onClick={togglePlay}
              >
                <Play size={36} className="text-white" />
              </button>
            </div>
          )}

          {/* Top gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent pointer-events-none"></div>

          {/* Bottom info panel with gradient */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm">
            {/* Category label with modern styling */}
            {reel.category && (
              <div className="mb-3">
                <span
                  className={`${getCategoryStyle(
                    reel.category
                  )} text-xs px-3 py-1.5 rounded-full inline-flex items-center`}
                >
                  {reel.category === "startup" && (
                    <Lightbulb size={12} className="mr-1.5" />
                  )}
                  {reel.category === "pitch" && (
                    <Briefcase size={12} className="mr-1.5" />
                  )}
                  {reel.category === "story" && (
                    <Users size={12} className="mr-1.5" />
                  )}
                  {reel.category === "collab" && (
                    <Sparkles size={12} className="mr-1.5" />
                  )}
                  {reel.category === "demo" && (
                    <Zap size={12} className="mr-1.5" />
                  )}
                  {reel.category === "funding" && (
                    <Award size={12} className="mr-1.5" />
                  )}
                  {reel.category}
                </span>
              </div>
            )}

            {/* Title with better prominence */}
            {reel.title && (
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                {reel.title}
              </h3>
            )}

            {/* Company info with better styling */}
            {reel.companyName && (
              <div className="flex items-center text-sm text-white/90 mb-2">
                <div className="bg-blue-500/20 p-1.5 rounded-md mr-2">
                  <Briefcase size={16} className="text-blue-400" />
                </div>
                <span className="font-medium">{reel.companyName}</span>
                {reel.stats?.funding && (
                  <div className="ml-3 bg-emerald-500/20 py-0.5 px-2 rounded text-xs text-emerald-400 font-medium">
                    ${reel.stats.funding}
                  </div>
                )}
              </div>
            )}

            {/* Description with better readability */}
            {reel.description && (
              <p className="text-sm text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                {reel.description}
              </p>
            )}

            {/* Creator info moved to bottom for better hierarchy */}
            <div className="flex items-center mt-3 pt-3 border-t border-white/10">
              <img
                src={
                  reel.creator?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    reel.creator?.name || "User"
                  )}&background=random`
                }
                alt={reel.creator?.name || "Creator"}
                className="w-10 h-10 rounded-full border-2 border-blue-500/30 object-cover cursor-pointer"
                onClick={handleProfileClick}
              />
              <div className="ml-3">
                <p className="font-medium text-white flex items-center">
                  {reel.creator?.name || "Anonymous"}
                  {reel.creator?.verified && (
                    <CheckCircle size={14} className="ml-1 text-blue-400" />
                  )}
                </p>
                <p className="text-xs text-gray-300 flex items-center">
                  {reel.creator?.role || "Entrepreneur"}
                  {reel.creator?.connections && (
                    <span className="ml-2 flex items-center text-gray-400">
                      <Users size={10} className="mr-1" />
                      {reel.creator.connections}
                    </span>
                  )}
                </p>
              </div>

              {/* Tags for additional context */}
              {reel.tags && reel.tags.length > 0 && (
                <div className="ml-auto flex gap-1">
                  {reel.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white/10 text-xs py-1 px-2 rounded text-white/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Volume toggle */}
          <button
            className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Interaction sidebar */}
        <div className="w-20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center px-1 border-l border-indigo-900/20">
          <div className="space-y-6">
            <ActionButton
              icon={<ThumbsUp />}
              label="Support"
              count={reel.stats?.upvotes || 0}
              onClick={(e) => {
                e.stopPropagation();
                onUpvote(reel.id);
              }}
              active={userInteractions[reel.id]?.upvoted}
              color="bg-gradient-to-b from-blue-600/40 to-blue-500/30"
            />
            <ActionButton
              icon={<MessageSquare />}
              label="Feedback"
              count={reel.stats?.comments || 0}
              onClick={(e) => {
                e.stopPropagation();
                onComment(reel.id);
              }}
            />
            <ActionButton
              icon={<Bookmark />}
              label="Save"
              count={reel.stats?.saves || 0}
              onClick={(e) => {
                e.stopPropagation();
                // Handle save functionality
              }}
              active={userInteractions[reel.id]?.saved}
              color="bg-gradient-to-b from-purple-600/40 to-purple-500/30"
            />
            <ActionButton
              icon={<Share />}
              label="Share"
              onClick={(e) => {
                e.stopPropagation();
                onShare(reel.id);
              }}
            />
            <ActionButton
              icon={<Handshake />}
              label="Connect"
              onClick={handleInteract}
              active={userInteractions[reel.id]?.interacted}
              color="bg-gradient-to-b from-emerald-600/40 to-emerald-500/30"
            />
          </div>

          {/* Startup metrics section */}
          {reel.metrics && (
            <div className="mt-6 pt-4 border-t border-white/10 w-full">
              {reel.metrics.growth && (
                <div className="flex flex-col items-center mb-3">
                  <div className="bg-emerald-500/20 p-1.5 rounded-full mb-1">
                    <TrendingUp size={14} className="text-emerald-400" />
                  </div>
                  <span className="text-xs text-emerald-400">
                    +{reel.metrics.growth}%
                  </span>
                </div>
              )}
              {reel.metrics.stage && (
                <div className="flex flex-col items-center">
                  <div className="bg-purple-500/20 p-1.5 rounded-full mb-1">
                    <Tag size={14} className="text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-400">
                    {reel.metrics.stage}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons with improved styling */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4">
        <button
          className="bg-gradient-to-r from-indigo-600/80 to-blue-600/80 hover:from-indigo-700 hover:to-blue-700 text-white p-3 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
          onClick={onPrev}
          disabled={!onPrev}
        >
          <ChevronUp size={22} />
        </button>
        <button
          className="bg-gradient-to-r from-indigo-600/80 to-blue-600/80 hover:from-indigo-700 hover:to-blue-700 text-white p-3 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
          onClick={onNext}
          disabled={!onNext}
        >
          <ChevronDown size={22} />
        </button>
      </div>
    </div>
  );
};

// ==========================================================================
// Top Filter Section
// ==========================================================================
const FilterSection = ({
  activeFilter,
  setActiveFilter,
  setShowUploadModal,
}) => {
  const filters = [
    {
      id: "all",
      label: "All Reels",
      icon: <Globe size={14} className="mr-1" />,
    },
    {
      id: "startup",
      label: "Innovation Ideas",
      icon: <Lightbulb size={14} className="mr-1" />,
    },
    {
      id: "pitch",
      label: "Investor Pitches",
      icon: <Briefcase size={14} className="mr-1" />,
    },
    {
      id: "story",
      label: "Founder Stories",
      icon: <Users size={14} className="mr-1" />,
    },
    {
      id: "collab",
      label: "Collaborations",
      icon: <Sparkles size={14} className="mr-1" />,
    },
    {
      id: "demo",
      label: "Product Demos",
      icon: <Zap size={14} className="mr-1" />,
    },
    {
      id: "funding",
      label: "Funding Rounds",
      icon: <Award size={14} className="mr-1" />,
    },
    {
      id: "trending",
      label: "Trending",
      icon: <TrendingUp size={14} className="mr-1" />,
    },
  ];

  const navigate = useNavigate();

  const handleAddReelClick = () => {
    setShowUploadModal(true);
  };

  return (
    <div className="w-full px-3 pt-0 pb-2 bg-gradient-to-b from-[#0a101f] to-[#0d1117] border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-bold text-white flex items-center">
              <Sparkles size={18} className="text-blue-400 mr-1.5" />
              Innov8mate
              <span className="text-blue-400 ml-1">Reels</span>
            </h1>
            <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-md font-medium hidden sm:block">
              Startup Exchange
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-1.5 px-3 md:py-2 md:px-4 rounded-lg flex items-center space-x-1.5 transition-all shadow-md text-sm md:text-base"
            onClick={handleAddReelClick}
          >
            <PlusCircle size={16} />
            <span className="font-medium hidden sm:inline">
              Share Your Startup
            </span>
            <span className="font-medium sm:hidden">Add</span>
          </button>
        </div>

        <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-0">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap flex items-center ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-[#1a2236]/80 text-gray-300 hover:bg-[#1a2236] border border-gray-700"
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Comments Modal - Updated with modern styling to match the new UI theme
// ==========================================================================
const CommentsModal = ({
  reelId,
  onClose,
  commentsByReelId,
  setCommentsByReelId,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize reelComments state from the parent's commentsByReelId
  const [reelComments, setReelComments] = useState([]);
  const commentInputRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!reelId) return;

      // Check if we already have cached comments for this reel
      if (commentsByReelId[reelId]) {
        setReelComments(commentsByReelId[reelId]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch comments from API
        const response = await axios.get(
          `${API_URL}/reels/${reelId}/comments`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const fetchedComments = response.data.comments || [];
          setReelComments(fetchedComments);

          // Update the parent's commentsByReelId state
          setCommentsByReelId((prev) => ({
            ...prev,
            [reelId]: fetchedComments,
          }));
        } else {
          throw new Error("Failed to load comments");
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Could not load comments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();

    // Auto-focus the comment input when modal opens
    if (commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current.focus();
      }, 300);
    }
  }, [reelId, commentsByReelId, setCommentsByReelId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting || !reelId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Post comment to API
      const response = await axios.post(
        `${API_URL}/reels/${reelId}/comments`,
        { text: newComment },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        // Add new comment to list (use the response data if available)
        const addedComment = response.data.comment || {
          id: Date.now(),
          user: {
            name: "You", // Will be replaced by actual user data from API
            avatar: "https://ui-avatars.com/api/?name=You&background=random",
          },
          text: newComment,
          timestamp: new Date(),
          likes: 0,
        };

        // Update local state
        const updatedComments = [addedComment, ...reelComments];
        setReelComments(updatedComments);

        // Update the parent's commentsByReelId state
        setCommentsByReelId((prev) => ({
          ...prev,
          [reelId]: updatedComments,
        }));

        setNewComment("");
      } else {
        throw new Error(response.data.message || "Failed to post comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Could not post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex flex-col backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#1a2236] to-[#0d1117] rounded-t-xl max-h-[70vh] flex flex-col mx-auto w-full mt-auto shadow-lg max-w-lg border border-indigo-900/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with modern styling */}
        <div className="p-4 border-b border-indigo-900/30 flex justify-between items-center bg-[#1a2236]/90">
          <h3 className="font-semibold text-white text-lg flex items-center">
            <MessageSquare size={20} className="text-blue-400 mr-2" />
            Comments
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments list with improved styling */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin text-blue-500 mb-3" size={30} />
              <p className="text-gray-400 text-sm">Loading comments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 px-4">
              <AlertCircle className="mx-auto mb-3 text-red-400" size={30} />
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={() => fetchComments()}
                className="mt-2 text-blue-400 text-sm hover:underline"
              >
                Try again
              </button>
            </div>
          ) : reelComments.length > 0 ? (
            reelComments.map((comment) => (
              <div
                key={comment.id}
                className="flex space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <img
                  src={
                    comment.user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      comment.user?.name || "User"
                    )}&background=random`
                  }
                  alt={comment.user?.name || "User"}
                  className="w-10 h-10 rounded-full flex-shrink-0 border border-indigo-900/30"
                />
                <div className="flex-1">
                  <div className="flex items-baseline">
                    <h4 className="font-medium text-white flex items-center">
                      {comment.user?.name || "User"}
                      {comment.user?.verified && (
                        <CheckCircle size={14} className="ml-1 text-blue-400" />
                      )}
                    </h4>
                    <span className="ml-2 text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-200 mt-1">{comment.text}</p>
                  <div className="flex items-center mt-2 space-x-3">
                    <button className="text-gray-400 text-xs flex items-center space-x-1 hover:text-blue-400 transition-colors">
                      <Heart size={14} />
                      <span>{comment.likes || 0}</span>
                    </button>
                    <button className="text-gray-400 text-xs hover:text-blue-400 transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4">
              <MessageSquare className="mx-auto mb-3 text-gray-600" size={30} />
              <h4 className="text-gray-300 font-medium mb-1">
                No comments yet
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Be the first to share your thoughts on this startup!
              </p>
            </div>
          )}
        </div>

        {/* Comment input with modern styling */}
        <form
          onSubmit={handleSubmitComment}
          className="p-4 border-t border-indigo-900/30 bg-[#1a2236]"
        >
          <div className="flex space-x-2">
            <input
              ref={commentInputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-[#0d1117]/80 border border-indigo-900/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg px-4 py-2.5 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// Interaction Modal Component for Creator-Viewer Connections
// ==========================================================================
const InteractionModal = ({ creator, contentType, onClose, onSend }) => {
  const [interactionType, setInteractionType] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Set default message based on content type and interaction type
  useEffect(() => {
    if (contentType && interactionType) {
      const templates = {
        startup: {
          invest: `Hi ${
            creator?.name || "there"
          },\n\nI saw your startup pitch and I'm interested in discussing potential investment opportunities. Your approach to solving ${
            creator?.companyName
              ? `the problems in ${creator.companyName}`
              : "this problem"
          } is impressive.\n\nWould you be open to a meeting to discuss this further?`,
          mentor: `Hi ${
            creator?.name || "there"
          },\n\nI loved your startup pitch and I think I could offer some mentorship based on my experience in this field. I'd be happy to share insights and connections that might help you.\n\nLet me know if you'd like to connect!`,
          demo: `Hi ${
            creator?.name || "there"
          },\n\nI'm intrigued by your startup pitch and would love to see a demo of your product. I'd like to understand more about the solution you're building.\n\nCould we schedule a quick demo session?`,
        },
        pitch: {
          feedback: `Hi ${
            creator?.name || "there"
          },\n\nI just watched your pitch about your innovation idea. I have some thoughts that might be valuable for your concept development.\n\nWould you be open to hearing some constructive feedback?`,
          connect: `Hi ${
            creator?.name || "there"
          },\n\nYour innovation idea really resonated with me. I'm working in a related area and think there might be some interesting synergies to explore.\n\nWould you be interested in connecting to discuss further?`,
          resource: `Hi ${
            creator?.name || "there"
          },\n\nI saw your innovation idea and wanted to share some resources that might be helpful for your development process. I've worked on similar concepts before.\n\nLet me know if you'd be interested in these materials.`,
        },
        collab: {
          join: `Hi ${
            creator?.name || "there"
          },\n\nI'm interested in collaborating on your project. I have experience in ${
            creator?.seeking || "this area"
          } and think I could contribute valuable skills.\n\nCould we discuss how I might get involved?`,
          partner: `Hi ${
            creator?.name || "there"
          },\n\nI represent an organization that might be a good fit for partnership on your collaboration request. We have resources that align well with your project needs.\n\nWould you be open to discussing a potential partnership?`,
          connect: `Hi ${
            creator?.name || "there"
          },\n\nI'd like to connect regarding your collaboration opportunity. While I may not be a direct fit, I know some people who might be interested in working with you.\n\nCan I make some introductions?`,
        },
        demo: {
          feedback: `Hi ${
            creator?.name || "there"
          },\n\nThanks for sharing your product demo. I have some thoughts on the functionality and user experience that might be helpful.\n\nWould you be interested in some feedback?`,
          try: `Hi ${
            creator?.name || "there"
          },\n\nI'm impressed by your product demo and would love to try it out myself. Is there a beta version available or an opportunity to be an early user?\n\nI'd be happy to provide feedback on my experience.`,
          feature: `Hi ${
            creator?.name || "there"
          },\n\nYour product demo was impressive! I had an idea for a feature that might enhance what you're building.\n\nWould you be open to hearing my suggestion?`,
        },
        story: {
          connect: `Hi ${
            creator?.name || "there"
          },\n\nYour founder story really resonated with me. I faced similar challenges in my journey and would love to connect and share experiences.\n\nWould you be open to a conversation?`,
          introduce: `Hi ${
            creator?.name || "there"
          },\n\nAfter hearing your founder story, I think you should meet someone in my network who could be valuable to your journey. They have expertise that aligns with your challenges.\n\nMay I make an introduction?`,
          learn: `Hi ${
            creator?.name || "there"
          },\n\nI'm deeply inspired by your founder story. I'm at the beginning of a similar journey and would love to learn from your experience.\n\nWould you be open to sharing some advice?`,
        },
        funding: {
          invest: `Hi ${
            creator?.name || "there"
          },\n\nI'm interested in learning more about your funding round. I represent ${
            creator?.seeking
              ? `potential investors in the ${creator.seeking} space`
              : "potential investors"
          } and your venture caught my attention.\n\nCould we schedule a call to discuss details?`,
          intro: `Hi ${
            creator?.name || "there"
          },\n\nI have connections with investors who might be interested in your funding round. Based on what I saw, I think there could be a good fit.\n\nWould you like me to make an introduction?`,
          advise: `Hi ${
            creator?.name || "there"
          },\n\nRegarding your funding round, I have experience in raising capital for similar ventures and might be able to offer some strategic advice.\n\nWould you be interested in discussing your fundraising strategy?`,
        },
      };

      // Set template message if available
      if (templates[contentType] && templates[contentType][interactionType]) {
        setMessage(templates[contentType][interactionType]);
      } else {
        // Fallback for any category/type combination not explicitly defined
        setMessage(
          `Hi ${
            creator?.name || "there"
          },\n\nI just watched your content about ${
            contentType === "startup"
              ? "your startup"
              : contentType === "pitch"
              ? "your innovation idea"
              : contentType === "collab"
              ? "your collaboration opportunity"
              : contentType === "demo"
              ? "your product"
              : contentType === "funding"
              ? "your funding round"
              : "your project"
          }. I'm interested in connecting to discuss further.\n\nLooking forward to your response.`
        );
      }
    }
  }, [contentType, interactionType, creator]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || !interactionType) {
      setError("Please select an interaction type and provide a message");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, you would call an API to send the message
      // For now, we'll simulate a successful send
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Call the parent's onSend callback with interaction details
      onSend({
        recipientId: creator?.id,
        interactionType,
        message,
        contentType,
      });

      // Close the modal
      onClose();
    } catch (err) {
      console.error("Error sending interaction:", err);
      setError("Failed to send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define interaction options based on content type
  const getInteractionOptions = () => {
    switch (contentType) {
      case "startup":
        return [
          {
            id: "invest",
            label: "Investment Interest",
            icon: <DollarSign size={18} />,
          },
          {
            id: "mentor",
            label: "Offer Mentorship",
            icon: <Users size={18} />,
          },
          { id: "demo", label: "Request Demo", icon: <Play size={18} /> },
        ];
      case "pitch":
        return [
          {
            id: "feedback",
            label: "Provide Feedback",
            icon: <MessageSquare size={18} />,
          },
          {
            id: "connect",
            label: "Connect & Discuss",
            icon: <Handshake size={18} />,
          },
          {
            id: "resource",
            label: "Share Resources",
            icon: <FileText size={18} />,
          },
        ];
      case "collab":
        return [
          { id: "join", label: "Join Project", icon: <Users size={18} /> },
          {
            id: "partner",
            label: "Propose Partnership",
            icon: <Handshake size={18} />,
          },
          {
            id: "connect",
            label: "Make Introductions",
            icon: <LinkIcon size={18} />,
          },
        ];
      case "demo":
        return [
          {
            id: "feedback",
            label: "Give Feedback",
            icon: <MessageSquare size={18} />,
          },
          { id: "try", label: "Request Access", icon: <Coffee size={18} /> },
          {
            id: "feature",
            label: "Suggest Features",
            icon: <Lightbulb size={18} />,
          },
        ];
      case "story":
        return [
          {
            id: "connect",
            label: "Connect & Share",
            icon: <MessageCircle size={18} />,
          },
          {
            id: "introduce",
            label: "Make Introduction",
            icon: <Users size={18} />,
          },
          {
            id: "learn",
            label: "Request Mentorship",
            icon: <Award size={18} />,
          },
        ];
      case "funding":
        return [
          {
            id: "invest",
            label: "Discuss Investment",
            icon: <DollarSign size={18} />,
          },
          {
            id: "intro",
            label: "Investor Introduction",
            icon: <Users size={18} />,
          },
          {
            id: "advise",
            label: "Fundraising Advice",
            icon: <Lightbulb size={18} />,
          },
        ];
      default:
        return [
          {
            id: "connect",
            label: "Connect",
            icon: <MessageCircle size={18} />,
          },
          {
            id: "meet",
            label: "Request Meeting",
            icon: <Calendar size={18} />,
          },
          { id: "info", label: "Request Info", icon: <FileText size={18} /> },
        ];
    }
  };

  const options = getInteractionOptions();

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#1a2236] to-[#0d1117] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto border border-indigo-900/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-semibold flex items-center">
              <Handshake size={20} className="mr-2" />
              Connect with {creator?.name || "Creator"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Creator info */}
        <div className="p-4 border-b border-indigo-900/30 flex items-start">
          <img
            src={
              creator?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                creator?.name || "User"
              )}&background=random`
            }
            alt={creator?.name || "Creator"}
            className="w-12 h-12 rounded-full border-2 border-blue-500/30 object-cover"
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <h3 className="font-medium text-white text-lg">
                {creator?.name || "Creator"}
                {creator?.verified && (
                  <CheckCircle
                    size={14}
                    className="ml-1 inline text-blue-400"
                  />
                )}
              </h3>
              <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 text-xs rounded">
                {creator?.role || "Creator"}
              </div>
            </div>

            {creator?.companyName && (
              <p className="text-sm text-gray-300 flex items-center mt-1">
                <Briefcase size={14} className="mr-1.5 text-blue-400" />
                {creator.companyName}
              </p>
            )}

            {creator?.seeking && (
              <div className="mt-2 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-900/30 text-indigo-300">
                <span className="font-medium">Seeking:</span>
                <span className="ml-1">{creator.seeking}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 text-white">
          {/* Interaction Type Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              How would you like to interact? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setInteractionType(option.id)}
                  className={`flex items-center p-3 rounded-lg border transition-all ${
                    interactionType === option.id
                      ? "border-blue-500 bg-blue-900/20 shadow-sm"
                      : "border-gray-700 hover:border-gray-500 bg-gray-800/50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      interactionType === option.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {option.icon}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-5">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Your Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="w-full px-3 py-2 bg-[#0d1117]/80 border border-indigo-900/30 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 min-h-32 placeholder-gray-500 text-white"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              This will start a direct conversation with the creator.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !interactionType}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all flex items-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// Explore Page (Main Component)
// ==========================================================================
const ExplorePage = () => {
  const [reels, setReels] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [selectedContentType, setSelectedContentType] = useState("");

  // Add comment storage by reel ID
  const [commentsByReelId, setCommentsByReelId] = useState({});

  // User interactions state
  const [userInteractions, setUserInteractions] = useState({});
  const navigate = useNavigate();

  // Fetch reels based on active filter - Updated to match backend API
  useEffect(() => {
    const fetchReels = async () => {
      setIsLoading(true);
      try {
        // Fetch from backend API with appropriate query parameters
        // The backend expects category as the filter parameter
        const response = await axios.get(`${API_URL}/reels`, {
          params: {
            category: activeFilter !== "all" ? activeFilter : undefined,
          },
          withCredentials: true,
        });

        // The backend response structure might be { videos: [...] } or { reels: [...] }
        const reelsData = response.data?.videos || response.data?.reels || [];

        if (reelsData.length > 0) {
          setReels(reelsData);
          setError(null);
        } else {
          setReels([]);
          // No error if empty, just no reels for this filter
        }
      } catch (err) {
        console.error("Error fetching reels:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load reels. Please try again."
        );
        setReels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReels();
  }, [activeFilter]);

  // Navigate to next reel
  const goToNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  };

  // Navigate to previous reel
  const goToPrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  // Handle upvote interaction
  const handleUpvote = async (reelId) => {
    try {
      // Optimistic UI update
      setUserInteractions((prev) => {
        const currentInteraction = { ...(prev[reelId] || {}) };
        const wasUpvoted = currentInteraction.upvoted;

        return {
          ...prev,
          [reelId]: {
            ...currentInteraction,
            upvoted: !wasUpvoted,
            downvoted: wasUpvoted ? currentInteraction.downvoted : false,
          },
        };
      });

      // Update local stats for immediate feedback
      setReels((prevReels) =>
        prevReels.map((reel) => {
          if (reel.id === reelId) {
            const wasUpvoted = userInteractions[reelId]?.upvoted;
            const newUpvotes = wasUpvoted
              ? Math.max(0, (reel.stats?.upvotes || 0) - 1)
              : (reel.stats?.upvotes || 0) + 1;

            return {
              ...reel,
              stats: {
                ...reel.stats,
                upvotes: newUpvotes,
              },
            };
          }
          return reel;
        })
      );

      // Send to backend API
      const action = userInteractions[reelId]?.upvoted ? "unlike" : "like";
      await axios.post(
        `${API_URL}/reels/${reelId}/${action}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(
        `Error ${
          userInteractions[reelId]?.upvoted ? "removing" : "adding"
        } upvote:`,
        err
      );
      // Could revert the optimistic update here if needed
    }
  };

  // Handle comment interaction
  const handleComment = (reelId) => {
    setShowCommentsFor(reelId);
  };

  // Handle share interaction
  const handleShare = async (reelId) => {
    try {
      // Create share link
      const shareUrl = `${window.location.origin}/reels/${reelId}`;

      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: "Check out this reel on Innov8mate",
          text: "I found this interesting startup reel on Innov8mate",
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }

      // Log share to backend if it has this endpoint
      try {
        await axios.post(
          `${API_URL}/reels/${reelId}/share`,
          {},
          {
            withCredentials: true,
          }
        );
      } catch (shareLogErr) {
        // Non-critical error, don't need to notify user
        console.warn("Could not log share to backend:", shareLogErr);
      }
    } catch (err) {
      console.error("Failed to share:", err);
    }
  };

  // Add new function to handle the interaction request
  const handleInteract = (reelId, creator, contentType) => {
    setSelectedCreator(creator);
    setSelectedContentType(contentType);
    setShowInteractionModal(true);

    // Update user interactions to mark this reel as interacted with
    setUserInteractions((prev) => ({
      ...prev,
      [reelId]: {
        ...(prev[reelId] || {}),
        interacted: true,
      },
    }));
  };

  // Add new function to handle sending the interaction message
  const handleSendInteraction = async (interactionData) => {
    try {
      // In a real implementation, you would call an API to send the message
      console.log("Sending interaction:", interactionData);

      // Here you might:
      // 1. Create a chat thread
      // 2. Send the message
      // 3. Update UI to show the message was sent

      // For now, just show a success message
      alert(
        `Message sent to ${
          selectedCreator?.name || "creator"
        }! They will be notified.`
      );
    } catch (err) {
      console.error("Error sending interaction:", err);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        goToNextReel();
      } else if (e.key === "ArrowUp" || e.key === "k") {
        goToPrevReel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentReelIndex, reels.length]);

  // Render content based on loading/error state
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0d1117]">
        <Loader className="text-[#3B82F6] animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0d1117] p-4 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-300 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0d1117] p-4 text-center">
        <Sparkles className="text-[#3B82F6] mb-4" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">No reels found</h2>
        <p className="text-gray-300 mb-6">
          There are no reels available for this category yet.
        </p>
        <button
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-md transition-colors"
          onClick={() => navigate("/create-reel")}
        >
          Create Your First Reel
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0d1117] flex flex-col pt-0">
      {/* Header with filters */}
      <FilterSection
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        setShowUploadModal={setShowUploadModal}
      />

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center py-0">
        <ReelCard
          reel={reels[currentReelIndex]}
          isActive={true}
          onNext={currentReelIndex < reels.length - 1 ? goToNextReel : null}
          onPrev={currentReelIndex > 0 ? goToPrevReel : null}
          onUpvote={handleUpvote}
          onComment={handleComment}
          onShare={handleShare}
          onInteract={handleInteract}
          userInteractions={userInteractions}
        />
      </div>

      {/* Comments modal */}
      {showCommentsFor && (
        <CommentsModal
          reelId={showCommentsFor}
          onClose={() => setShowCommentsFor(null)}
          commentsByReelId={commentsByReelId}
          setCommentsByReelId={setCommentsByReelId}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}

      {/* Interaction Modal */}
      {showInteractionModal && (
        <InteractionModal
          creator={selectedCreator}
          contentType={selectedContentType}
          onClose={() => setShowInteractionModal(false)}
          onSend={handleSendInteraction}
        />
      )}
    </div>
  );
};

// Add the ContentTypeButton component
const ContentTypeButton = ({ active, onClick, icon, label, description }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
        active
          ? "border-blue-500 bg-gradient-to-b from-blue-50 to-indigo-50 shadow-sm"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <div
        className={`p-2 rounded-full mb-1 ${
          active
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-sm font-medium ${
          active ? "text-blue-700" : "text-gray-700"
        }`}
      >
        {label}
      </span>
      <span className="text-xs text-gray-500 mt-0.5">{description}</span>
    </button>
  );
};

// Add mobile-friendly upload modal with improved UI that matches the app's color scheme
const UploadModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [contentType, setContentType] = useState("startup");
  const [seeking, setSeeking] = useState("");
  const [tags, setTags] = useState("");
  const [stage, setStage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setError("");

    if (file) {
      // Check file size (30MB = 30 * 1024 * 1024 bytes)
      if (file.size > 30 * 1024 * 1024) {
        setError("Video size must be less than 30MB");
        return;
      }

      // Check if it's a video file
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return;
      }

      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!videoFile) {
      setError("Please upload a video");
      return;
    }

    try {
      setIsUploading(true);

      // Create FormData object for file upload
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", contentType); // Using 'category' to match backend parameter
      formData.append("seeking", seeking);

      // Process tags as an array
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      formData.append("tags", JSON.stringify(tagArray));

      formData.append("stage", stage);

      // Make API call
      const response = await axios.post(`${API_URL}/reels/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log("Upload response:", response);

      // Close modal after successful upload
      onClose();

      // Optionally refresh the reels list
      // window.location.reload();
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload video. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-gradient-to-b from-[#1a2236] to-[#0d1117] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto border border-indigo-900/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-semibold flex items-center">
              <PlusCircle size={20} className="mr-2" />
              Share Your Innovation
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 text-white">
          {/* Content Type Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Content Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ContentTypeButton
                active={contentType === "startup"}
                onClick={() => setContentType("startup")}
                icon={<Briefcase className="w-5 h-5" />}
                label="Startup Pitch"
                description="Showcase your company"
              />
              <ContentTypeButton
                active={contentType === "pitch"}
                onClick={() => setContentType("pitch")}
                icon={<Lightbulb className="w-5 h-5" />}
                label="Innovation Idea"
                description="Present your concept"
              />
              <ContentTypeButton
                active={contentType === "collab"}
                onClick={() => setContentType("collab")}
                icon={<Users className="w-5 h-5" />}
                label="Collaboration"
                description="Find partners"
              />
            </div>
          </div>

          {/* Title & Description */}
          <div className="grid gap-4 mb-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a catchy title"
                className="w-full px-3 py-2 bg-[#0d1117]/80 border border-indigo-900/30 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-white"
                maxLength={60}
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {title.length}/60
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your innovation, idea, or what you're looking for"
                className="w-full px-3 py-2 bg-[#0d1117]/80 border border-indigo-900/30 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 min-h-24 placeholder-gray-500 text-white"
                maxLength={300}
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {description.length}/300
              </div>
            </div>
          </div>

          {/* Video Upload */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Video *
            </label>

            {!previewUrl ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-600 hover:border-blue-500 bg-[#0d1117]/50"
                }`}
              >
                <PlusCircle className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  MP4 or MOV (max. 30MB, ideal duration: 15-60 seconds)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleVideoChange}
                  accept="video/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-indigo-900/30">
                <video
                  src={previewUrl}
                  className="w-full h-48 object-cover bg-black"
                  controls
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setPreviewUrl("");
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-black/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Additional Fields */}
          <div className="grid gap-4 mb-5">
            <div>
              <label
                htmlFor="seeking"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Seeking
              </label>
              <input
                id="seeking"
                type="text"
                value={seeking}
                onChange={(e) => setSeeking(e.target.value)}
                placeholder="Funding, Co-founders, Feedback, etc."
                className="w-full px-3 py-2 bg-[#0d1117]/80 border border-indigo-900/30 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-200 mb-1"
                >
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="AI, FinTech, Healthcare"
                  className="w-full px-3 py-2 bg-[#0d1117]/80 border border-indigo-900/30 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="stage"
                  className="block text-sm font-medium text-gray-200 mb-1"
                >
                  Stage
                </label>
                <select
                  id="stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117]/80 border border-indigo-900/30 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-white"
                >
                  <option value="">Select stage</option>
                  <option value="Concept">Concept</option>
                  <option value="Prototype">Prototype</option>
                  <option value="MVP">MVP</option>
                  <option value="Early Revenue">Early Revenue</option>
                  <option value="Growth">Growth</option>
                  <option value="Scaling">Scaling</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all flex items-center space-x-2 shadow-md"
            >
              {isUploading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Share Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExplorePage;
