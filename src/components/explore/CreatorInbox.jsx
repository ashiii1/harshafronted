import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Utils/constants";
import {
  MessageSquare,
  Users,
  Bell,
  X,
  Check,
  Star,
  AlertCircle,
  Search,
  Filter,
  Sliders,
  Calendar,
  RefreshCw,
  MoreHorizontal,
  Trash2,
  Archive,
  Loader,
  DollarSign,
  Briefcase,
  Coffee,
  FileText,
  Handshake,
  MessageCircle,
  Award,
  Lightbulb,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Mail,
} from "lucide-react";

const CreatorInbox = () => {
  const [interactions, setInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [activeMessage, setActiveMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    fetchInteractions();
  }, [activeTab]);

  const fetchInteractions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/interactions`, {
        params: {
          status: activeTab !== "all" ? activeTab : undefined,
        },
        withCredentials: true,
      });

      if (response.data?.interactions) {
        setInteractions(response.data.interactions);
      } else {
        setInteractions([]);
      }
    } catch (err) {
      console.error("Error fetching interactions:", err);
      setError("Could not load your interactions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (interactionId, newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/interactions/${interactionId}/status`,
        {
          status: newStatus,
        },
        {
          withCredentials: true,
        }
      );

      // Update local state after successful API call
      setInteractions((prevInteractions) =>
        prevInteractions.map((interaction) =>
          interaction.id === interactionId
            ? { ...interaction, status: newStatus }
            : interaction
        )
      );

      // Close the active message if it's the one being updated
      if (activeMessage?.id === interactionId) {
        setActiveMessage((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Error updating interaction status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const sendReply = async (interactionId) => {
    if (!replyText.trim()) return;

    setIsReplying(true);

    try {
      await axios.post(
        `${API_URL}/interactions/${interactionId}/reply`,
        {
          message: replyText,
        },
        {
          withCredentials: true,
        }
      );

      // Update local state
      if (activeMessage) {
        const updatedConversation = [
          ...activeMessage.conversation,
          {
            sender: "creator",
            text: replyText,
            timestamp: new Date().toISOString(),
          },
        ];

        setActiveMessage({
          ...activeMessage,
          conversation: updatedConversation,
        });

        // Update in the interactions list too
        setInteractions((prevInteractions) =>
          prevInteractions.map((interaction) =>
            interaction.id === interactionId
              ? { ...interaction, conversation: updatedConversation }
              : interaction
          )
        );
      }

      setReplyText("");
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply. Please try again.");
    } finally {
      setIsReplying(false);
    }
  };

  const deleteInteraction = async (interactionId) => {
    if (!confirm("Are you sure you want to delete this interaction?")) return;

    try {
      await axios.delete(`${API_URL}/interactions/${interactionId}`, {
        withCredentials: true,
      });

      // Update local state
      setInteractions((prevInteractions) =>
        prevInteractions.filter(
          (interaction) => interaction.id !== interactionId
        )
      );

      // Close the detail view if this was the active message
      if (activeMessage?.id === interactionId) {
        setActiveMessage(null);
      }
    } catch (err) {
      console.error("Error deleting interaction:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  const getInteractionTypeIcon = (type, category) => {
    // Investment related
    if (type === "invest" || type === "funding")
      return <DollarSign size={18} />;
    // Mentorship related
    if (type === "mentor" || type === "learn" || type === "advise")
      return <Award size={18} />;
    // Demo related
    if (type === "demo" || type === "try") return <Play size={18} />;
    // Feedback related
    if (type === "feedback") return <MessageSquare size={18} />;
    // Connection related
    if (type === "connect" || type === "meet") return <Handshake size={18} />;
    // Resource sharing
    if (type === "resource" || type === "info") return <FileText size={18} />;
    // Project joining
    if (type === "join") return <Users size={18} />;
    // Partnership
    if (type === "partner") return <Briefcase size={18} />;
    // Introduction
    if (type === "introduce" || type === "intro") return <Users size={18} />;
    // Feature suggestions
    if (type === "feature") return <Lightbulb size={18} />;

    // Default
    return <MessageCircle size={18} />;
  };

  const getInteractionTypeLabel = (type, category) => {
    const types = {
      invest: "Investment Interest",
      mentor: "Mentorship Offer",
      demo: "Demo Request",
      feedback: "Feedback",
      connect: "Connection Request",
      resource: "Resource Sharing",
      join: "Project Join Request",
      partner: "Partnership Proposal",
      introduce: "Introduction Offer",
      intro: "Investor Introduction",
      try: "Product Access Request",
      feature: "Feature Suggestion",
      learn: "Mentorship Request",
      advise: "Fundraising Advice",
      meet: "Meeting Request",
      info: "Information Request",
    };

    return types[type] || "Message";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300";
      case "accepted":
        return "bg-green-500/20 text-green-300";
      case "rejected":
        return "bg-red-500/20 text-red-300";
      case "archived":
        return "bg-gray-500/20 text-gray-300";
      case "completed":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const filteredInteractions = interactions.filter((interaction) => {
    if (!searchQuery) return true;

    // Search in sender name
    if (
      interaction.sender?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
      return true;

    // Search in content type
    if (
      interaction.contentType?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return true;

    // Search in interaction type
    if (
      getInteractionTypeLabel(
        interaction.interactionType,
        interaction.contentType
      )
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
      return true;

    // Search in message text
    if (
      interaction.conversation?.some((msg) =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
      return true;

    return false;
  });

  return (
    <div className="h-screen bg-[#0d1117] text-white flex">
      {/* Sidebar with list of messages */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-indigo-900/30 flex flex-col">
        <div className="p-4 border-b border-indigo-900/30 bg-[#1a2236]">
          <h1 className="text-xl font-bold flex items-center">
            <Mail className="mr-2 text-blue-400" size={20} />
            Creator Inbox
          </h1>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117]/80 border border-indigo-900/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="flex border-b border-indigo-900/30 bg-[#121a2d]">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "pending"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "accepted"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-300"
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "archived"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-300"
            }`}
          >
            Archived
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader className="animate-spin text-blue-500 mb-3" size={30} />
              <p className="text-gray-400 text-sm">Loading your messages...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <AlertCircle className="mx-auto mb-3 text-red-400" size={30} />
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={fetchInteractions}
                className="mt-2 text-blue-400 hover:underline flex items-center justify-center mx-auto"
              >
                <RefreshCw size={14} className="mr-1" /> Try again
              </button>
            </div>
          ) : filteredInteractions.length === 0 ? (
            <div className="text-center p-8">
              <MessageSquare className="mx-auto mb-3 text-gray-500" size={30} />
              <p className="text-gray-300 font-medium">No messages found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "When viewers interact with your content, messages will appear here"}
              </p>
            </div>
          ) : (
            filteredInteractions.map((interaction) => (
              <div
                key={interaction.id}
                className={`p-4 border-b border-indigo-900/20 hover:bg-[#1a2236]/50 cursor-pointer transition-colors ${
                  activeMessage?.id === interaction.id ? "bg-[#1a2236]" : ""
                }`}
                onClick={() => setActiveMessage(interaction)}
              >
                <div className="flex items-start">
                  <img
                    src={
                      interaction.sender?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        interaction.sender?.name || "User"
                      )}&background=random`
                    }
                    alt={interaction.sender?.name || "User"}
                    className="w-10 h-10 rounded-full mr-3 border border-indigo-900/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">
                        {interaction.sender?.name || "Anonymous User"}
                      </h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(interaction.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center mt-1">
                      <div
                        className={`p-1 rounded-md mr-2 ${
                          interaction.contentType === "startup"
                            ? "bg-blue-500/20"
                            : interaction.contentType === "pitch"
                            ? "bg-purple-500/20"
                            : interaction.contentType === "collab"
                            ? "bg-pink-500/20"
                            : interaction.contentType === "demo"
                            ? "bg-cyan-500/20"
                            : interaction.contentType === "story"
                            ? "bg-emerald-500/20"
                            : interaction.contentType === "funding"
                            ? "bg-amber-500/20"
                            : "bg-gray-500/20"
                        }`}
                      >
                        {getInteractionTypeIcon(
                          interaction.interactionType,
                          interaction.contentType
                        )}
                      </div>
                      <span className="text-xs text-gray-300 truncate">
                        {getInteractionTypeLabel(
                          interaction.interactionType,
                          interaction.contentType
                        )}
                      </span>
                      <span
                        className={`ml-auto text-xs px-2 py-0.5 rounded-full ${getStatusClass(
                          interaction.status
                        )}`}
                      >
                        {interaction.status || "pending"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mt-1 line-clamp-1">
                      {interaction.conversation &&
                      interaction.conversation.length > 0
                        ? interaction.conversation[
                            interaction.conversation.length - 1
                          ].text
                        : "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message detail view */}
      {activeMessage ? (
        <div className="hidden md:flex md:flex-1 flex-col">
          <div className="p-4 border-b border-indigo-900/30 bg-[#1a2236] flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={
                  activeMessage.sender?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    activeMessage.sender?.name || "User"
                  )}&background=random`
                }
                alt={activeMessage.sender?.name || "User"}
                className="w-10 h-10 rounded-full mr-3 border border-indigo-900/30"
              />
              <div>
                <h2 className="font-medium text-white flex items-center">
                  {activeMessage.sender?.name || "Anonymous User"}
                  {activeMessage.sender?.verified && (
                    <CheckCircle size={14} className="ml-1 text-blue-400" />
                  )}
                </h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-300">
                    {getInteractionTypeLabel(
                      activeMessage.interactionType,
                      activeMessage.contentType
                    )}
                  </span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-sm text-gray-300">
                    {activeMessage.contentTitle ? (
                      <span className="italic">
                        Re: {activeMessage.contentTitle}
                      </span>
                    ) : (
                      `${activeMessage.contentType} reel`
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {activeMessage.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      handleStatusChange(activeMessage.id, "accepted")
                    }
                    className="p-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                    title="Accept"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(activeMessage.id, "rejected")
                    }
                    className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                </>
              )}
              <button
                onClick={() => handleStatusChange(activeMessage.id, "archived")}
                className="p-2 rounded-lg bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 transition-colors"
                title="Archive"
              >
                <Archive size={18} />
              </button>
              <button
                onClick={() => deleteInteraction(activeMessage.id)}
                className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Content the interaction is about */}
            <div className="bg-[#1a2236]/60 rounded-lg p-4 border border-indigo-900/30">
              <h3 className="font-medium text-white mb-2 flex items-center">
                <span
                  className={`p-1 rounded-md mr-2 ${
                    activeMessage.contentType === "startup"
                      ? "bg-blue-500/20"
                      : activeMessage.contentType === "pitch"
                      ? "bg-purple-500/20"
                      : activeMessage.contentType === "collab"
                      ? "bg-pink-500/20"
                      : activeMessage.contentType === "demo"
                      ? "bg-cyan-500/20"
                      : activeMessage.contentType === "story"
                      ? "bg-emerald-500/20"
                      : activeMessage.contentType === "funding"
                      ? "bg-amber-500/20"
                      : "bg-gray-500/20"
                  }`}
                >
                  {activeMessage.contentType === "startup" && (
                    <Briefcase size={18} />
                  )}
                  {activeMessage.contentType === "pitch" && (
                    <Lightbulb size={18} />
                  )}
                  {activeMessage.contentType === "collab" && (
                    <Users size={18} />
                  )}
                  {activeMessage.contentType === "demo" && <Play size={18} />}
                  {activeMessage.contentType === "story" && (
                    <MessageCircle size={18} />
                  )}
                  {activeMessage.contentType === "funding" && (
                    <DollarSign size={18} />
                  )}
                </span>
                {activeMessage.contentTitle ||
                  `Your ${activeMessage.contentType} reel`}
              </h3>

              <div className="mt-2 flex items-center">
                <Link
                  to={`/reels/${activeMessage.contentId}`}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                >
                  View content <ChevronRight size={16} />
                </Link>
                <span
                  className={`ml-auto text-xs px-2 py-0.5 rounded-full ${getStatusClass(
                    activeMessage.status
                  )}`}
                >
                  {activeMessage.status || "pending"}
                </span>
              </div>
            </div>

            {/* Conversation */}
            {activeMessage.conversation &&
              activeMessage.conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "creator"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "creator"
                        ? "bg-blue-600/20 border border-blue-500/30"
                        : "bg-[#1a2236] border border-indigo-900/30"
                    }`}
                  >
                    <p className="text-white">{message.text}</p>
                    <div className="mt-1 flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                      {message.sender === "creator" && (
                        <Check size={14} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Reply form */}
          <div className="p-4 border-t border-indigo-900/30 bg-[#1a2236]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendReply(activeMessage.id);
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 bg-[#0d1117]/80 border border-indigo-900/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                disabled={isReplying || activeMessage.status === "rejected"}
              />
              <button
                type="submit"
                disabled={
                  isReplying ||
                  !replyText.trim() ||
                  activeMessage.status === "rejected"
                }
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 transition-all"
              >
                {isReplying ? (
                  <Loader className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>

            {activeMessage.status === "rejected" && (
              <p className="mt-2 text-xs text-red-400">
                This interaction has been rejected and is closed for further
                messages.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex md:flex-1 items-center justify-center bg-[#0d1117]">
          <div className="text-center p-8">
            <Mail className="mx-auto mb-4 text-gray-500" size={40} />
            <h2 className="text-xl font-medium text-gray-300 mb-2">
              Select a conversation
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Choose a conversation from the list to view details and respond to
              viewer interactions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorInbox;
