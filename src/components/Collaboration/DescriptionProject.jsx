/* eslint-disable react/prop-types */
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { API_URL } from "../../Utils/constants";
import { projectChatSocket } from "../../services/socket";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

// Icons
import {
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaUserAlt,
  FaCalendarAlt,
  FaCode,
  FaCheckCircle,
  FaBell,
  FaRegStar,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaPaperPlane,
  FaGithub,
  FaLink,
  FaLock,
  FaLockOpen,
  FaChartLine,
  FaTasks,
  FaBars,
  FaTimes,
  FaComments,
  FaEdit,
  FaTrash,
  FaPlusCircle,
} from "react-icons/fa";
import { set } from "lodash";

// Chat Component
const GroupChat = ({
  showChat,
  setShowChat,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  currentUser,
  projectTitle,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!showChat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaComments className="text-white text-xl" />
            <h3 className="text-xl font-semibold">
              {projectTitle} - Team Chat
            </h3>
          </div>
          <button
            onClick={() => setShowChat(false)}
            className="text-white hover:text-red-200 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                <div className="flex justify-center mb-4">
                  <FaComments className="text-gray-300 text-5xl" />
                </div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.senderId === currentUser._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-3 shadow-sm ${
                      message.senderId === currentUser._id
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                  >
                    {message.senderId !== currentUser._id && (
                      <p className="text-xs font-semibold mb-1 text-indigo-600">
                        {message.senderName}
                      </p>
                    )}
                    <p>{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === currentUser._id
                          ? "text-indigo-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={sendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`rounded-lg p-2 ${
                newMessage.trim()
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [showFullTechStack, setShowFullTechStack] = useState(false);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isInterested, setIsInterested] = useState(false);
  const [socket, setSocket] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //for github and doc links
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkType, setLinkType] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const navigate = useNavigate();

  // Initial load
  //if (!project) return;

  useEffect(() => {
    fetchProject();
    window.scrollTo(0, 0);
  }, []);

  // Socket message handler
  const sendMessage = (e) => {
    e?.preventDefault();
    if (newMessage.trim() && socket) {
      try {
        const messageData = {
          projectId: id,
          senderId: user._id,
          senderName: user.username,
          text: newMessage,
          timestamp: new Date(),
        };

        socket.emit("sendMessage", messageData);

        axios.post(
          `${API_URL}/messages/${id}`,
          { messageData },
          { withCredentials: true }
        );

        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Fetch chat messages
  useEffect(() => {
    if (project) {
      fetchChatMessages();
    }
  }, [project]);

  const fetchChatMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/${id}`, {
        withCredentials: true,
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Socket connection
  useEffect(() => {
    if (user && project) {
      // Always connect to get project updates, regardless of collaboration status
      const newSocket = projectChatSocket(project?._id, user._id, "groupChat");
      setSocket(newSocket);

      if (newSocket) {
        // Join the project room for all users viewing the project
        newSocket.emit("joinRoom", `project_${project._id}`);

        // Join a user-specific room to receive targeted updates
        newSocket.emit("joinRoom", `user_${user._id}`);

        console.log(`Joined project_${project._id} and user_${user._id} rooms`);
      }

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [user, project]);

  // Socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on("message", (message) => {
        console.log("Received new message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on("previousMessages", (previousMessages) => {
        setMessages(previousMessages);
      });

      // Listen for project member updates
      socket.on("projectMemberUpdate", (updatedProject) => {
        console.log("Project members updated:", updatedProject);
        // Update the project data in real-time
        setProject((prev) => ({
          ...prev,
          collobrators: updatedProject.collobrators,
          requests: updatedProject.requests,
        }));

        // Update request status based on the new project data
        updateRequestStatus(updatedProject);
      });

      return () => {
        socket.off("message");
        socket.off("previousMessages");
        socket.off("projectMemberUpdate");
      };
    }
  }, [socket]);

  // Fetch project data
  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/collaboration/${id}`, {
        withCredentials: true,
      });
      setProject(response.data.project);
      setIsInterested(
        response.data.project?.interestedUsers?.includes(user?._id)
      );
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const handleDeleteProject = async (projectName) => {
    if (confirmationText === projectName) {
      try {
        await axios.delete(`${API_URL}/collaboration/${id}`, {
          withCredentials: true,
        });
        navigate("/collaboration");
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    } else {
      //alert("Project name doesn't match. Please try again.");
    }
  };

  const handleUpdateProject = async () => {};

  const handleEditLink = (type) => {
    setLinkType(type);
    setLinkUrl(
      type === "github" ? project?.githubLink || "" : project?.docsLink || ""
    );
    setShowLinkModal(true);
  };

  const saveLink = async () => {
    try {
      const updatedData = {
        ...(linkType === "github"
          ? { githubLink: linkUrl }
          : { docsLink: linkUrl }),
      };
      console.log(updatedData);
      await axios.patch(`${API_URL}/collaboration/update/${id}`, updatedData, {
        withCredentials: true,
      });

      // Update local project state
      setProject((prev) => ({
        ...prev,
        ...(linkType === "github"
          ? { githubLink: linkUrl }
          : { docsLink: linkUrl }),
      }));

      setShowLinkModal(false);
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  // Update request status
  const updateRequestStatus = (projectData) => {
    if (!projectData || !user?._id) return;

    // Check if user is already a collaborator
    const isCollaborator = projectData.collobrators?.some(
      (collaborator) => collaborator._id.toString() === user._id.toString()
    );

    if (isCollaborator) {
      setRequestStatus("collaborated");
      return;
    }

    // Check if user has a pending request
    const hasPendingRequest = projectData.requests?.some(
      (request) => request._id.toString() === user._id.toString()
    );

    if (hasPendingRequest) {
      setRequestStatus("pending");
      return;
    }

    setRequestStatus("default");
  };

  // Handle collaboration request
  const handleCollaboration = async () => {
    if (requestStatus !== "default") return;

    setLoading(true);
    try {
      await axios.patch(
        `${API_URL}/collaboration/request/${id}`,
        {},
        { withCredentials: true }
      );
      setRequestStatus("pending");
    } catch (error) {
      console.error("Error sending collaboration request:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle interest toggle
  const handleInterested = async () => {
    try {
      const newInterestState = !isInterested;
      setIsInterested(newInterestState);

      const endpoint = newInterestState ? "interested" : "notInterested";
      await axios.post(
        `${API_URL}/collaboration/${id}/${endpoint}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error updating interest:", error);
      setIsInterested(!isInterested); // Revert on error
    }
  };

  // Handle collaboration request response (accept/reject)
  const handleCollaborationRequest = async (requestType, requestId) => {
    try {
      const projectId = project._id;
      await axios.patch(
        `${API_URL}/collaboration/request/${projectId}/${requestId}/${requestType}`,
        {},
        { withCredentials: true }
      );

      // Don't need to fetch the project again as we'll get an update via socket
      // But keep a fallback fetch for non-socket scenarios
      setTimeout(() => {
        // If socket update doesn't come through in 2 seconds, fall back to HTTP request
        fetchProject();
      }, 2000);
    } catch (error) {
      console.error("Error handling collaboration request:", error);
      // Always fetch on error to ensure UI is consistent
      fetchProject();
    }
  };

  // Update status when project or user changes
  useEffect(() => {
    if (project && user) {
      updateRequestStatus(project);
    }
  }, [project, user]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 mb-4 rounded-full bg-indigo-200"></div>
          <div className="h-4 w-32 mb-4 rounded bg-indigo-200"></div>
          <div className="h-3 w-24 rounded bg-indigo-100"></div>
        </div>
      </div>
    );
  }

  // Status styling
  const statusColors = {
    live: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    ongoing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const statusColor = statusColors[project?.status] || statusColors.default;

  // Button styling
  const getButtonProps = () => {
    switch (requestStatus) {
      case "pending":
        return {
          text: "Request Pending",
          icon: <FaClock className="mr-2" />,
          className: "bg-yellow-500 text-white",
          disabled: true,
        };
      case "collaborated":
        return {
          text: "Team Member",
          icon: <FaCheckCircle className="mr-2" />,
          className: "bg-green-600 text-white",
          disabled: true,
        };
      default:
        return {
          text: loading ? "Processing..." : "Join Team",
          icon: loading ? null : <FaUsers className="mr-2" />,
          className: loading
            ? "bg-gray-400 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white",
          disabled: loading,
        };
    }
  };

  const buttonProps = getButtonProps();

  // Progress calculation
  const progressPercentage =
    project?.status === "completed"
      ? 100
      : project?.status === "ongoing"
      ? 65
      : 25;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden justify-end mb-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white bg-opacity-20 rounded-lg p-2 text-white"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row justify-between">
            {/* Left Side: Project Info */}
            <div className="lg:w-2/3">
              <div className="flex items-center space-x-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}
                >
                  {project?.status?.toUpperCase() || "ACTIVE"}
                </span>
                <span className="text-indigo-300 text-sm">
                  ID: {project?._id?.substring(0, 8)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {project?.title}
              </h1>

              <div className="flex flex-wrap items-center text-indigo-200 text-sm mb-6 gap-4">
                <div className="flex items-center">
                  <FaUserAlt className="mr-2" />
                  <span>By {project?.postedBy?.username}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>
                    Posted {new Date(project?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-2" />
                  <span>
                    {project?.collobrators?.length || 0} /{" "}
                    {project?.membersNeeded} Members
                  </span>
                </div>
              </div>

              <p className="text-indigo-100 mb-8 max-w-2xl line-clamp-2">
                {project?.description?.substring(0, 160)}...
              </p>

              <div className="flex flex-wrap gap-3">
                {user._id !== project.postedBy._id && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={buttonProps.disabled}
                    onClick={handleCollaboration}
                    className={`py-2 px-6 rounded-lg font-medium flex items-center ${buttonProps.className} disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md`}
                  >
                    {buttonProps.icon}
                    {buttonProps.text}
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInterested}
                  className={`py-2 px-6 rounded-lg font-medium flex items-center shadow-md
                    ${
                      isInterested
                        ? "bg-pink-600 hover:bg-pink-700 text-white"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                    }`}
                >
                  {isInterested ? (
                    <FaStar className="mr-2" />
                  ) : (
                    <FaRegStar className="mr-2" />
                  )}
                  {isInterested ? "Interested" : "Add to Interests"}
                </motion.button>

                {(requestStatus === "collaborated" ||
                  project.postedBy._id === user._id) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowChat(true)}
                    className="py-2 px-6 rounded-lg font-medium flex items-center bg-white text-gray-800 hover:bg-gray-100 shadow-md"
                  >
                    <FaComments className="mr-2" />
                    Team Chat
                  </motion.button>
                )}

                {user._id === project.postedBy._id && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUpdateProject}
                      className="py-2 px-6 rounded-lg font-medium flex items-center bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                    >
                      <FaEdit className="mr-2" />
                      Edit Project
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setConfirmationText("");
                        setShowDeleteModal(true);
                      }}
                      className="py-2 px-6 rounded-lg font-medium flex items-center bg-red-500 hover:bg-red-600 text-white shadow-md"
                    >
                      <FaTrash className="mr-2" />
                      Delete Project
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {/* Right Side: Project Stats */}
            <div
              className={`mt-8 lg:mt-0 lg:w-1/3 ${
                isMenuOpen ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h3 className="text-xl font-semibold mb-4">Project Progress</h3>

                <div className="mb-6">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-indigo-200 bg-opacity-30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <div className="text-indigo-200">Duration</div>
                    <div className="font-semibold">{project?.duration}</div>
                  </div>
                  <div>
                    <div className="text-indigo-200">Deadline</div>
                    <div className="font-semibold">
                      {project?.deadline || "Not set"}
                    </div>
                  </div>
                  <div>
                    <div className="text-indigo-200">Location</div>
                    <div className="font-semibold">
                      {project?.location || "Remote"}
                    </div>
                  </div>
                  <div>
                    <div className="text-indigo-200">Team Size</div>
                    <div className="font-semibold">
                      {project?.collobrators?.length + project?.membersNeeded}
                    </div>
                  </div>
                </div>

                <div className="border-t border-indigo-300 border-opacity-30 pt-4">
                  <h4 className="font-medium mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {(showFullTechStack
                      ? project?.techStack
                      : project?.techStack?.slice(0, 4)
                    )?.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white bg-opacity-20 rounded-md text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project?.techStack?.length > 4 && (
                      <button
                        onClick={() => setShowFullTechStack(!showFullTechStack)}
                        className="px-2 py-1 bg-indigo-600 bg-opacity-30 rounded-md text-xs flex items-center"
                      >
                        {showFullTechStack ? (
                          <>
                            <FaChevronUp className="mr-1" /> Show Less
                          </>
                        ) : (
                          <>
                            <FaChevronDown className="mr-1" />{" "}
                            {project?.techStack?.length - 4} More
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "overview"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "team"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Team
            </button>
            {user._id === project.postedBy._id && (
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "requests"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Requests
                {project?.requests?.length > 0 && (
                  <span className="ml-2 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                    {project.requests.length}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "details"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Details
            </button>
            {/* // Add to the tab navigation */}
            {(user._id === project.postedBy._id ||
              project.collobrators.some((c) => c._id === user._id)) && (
              <button
                onClick={() => setActiveTab("collaboration")}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "collaboration"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Collaboration
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Project Description */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  About This Project
                </h2>
                <div className="prose max-w-none text-gray-600">
                  <p className="whitespace-pre-line">{project?.description}</p>
                </div>
              </div>

              {/* Links Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Project Resources
                </h2>
                <div className="space-y-4">
                  <a
                    href={project?.githubLink || "#"}
                    target={project?.githubLink ? "_blank" : "_self"}
                    onClick={(e) => {
                      if (!project?.githubLink) {
                        e.preventDefault();
                        if (user._id === project.postedBy._id) {
                          handleEditLink("github");
                        }
                      }
                    }}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                      <FaGithub className="text-gray-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        GitHub Repository
                      </h4>
                      <p className="text-sm text-gray-500">
                        {project?.githubLink ? (
                          project.githubLink
                        ) : requestStatus === "collaborated" ||
                          project.postedBy._id === user._id ? (
                          <span className="flex items-center">
                            <FaPlusCircle className="mr-1" />
                            {user._id === project.postedBy._id
                              ? "Add repository link"
                              : "Not added yet"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FaLock className="mr-1" /> Join team to access
                          </span>
                        )}
                      </p>
                    </div>
                    {user._id === project.postedBy._id && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditLink("github");
                        }}
                        className="text-gray-500 hover:text-indigo-600 ml-2"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </a>
                  <a
                    href={project?.docsLink || "#"}
                    target={project?.docsLink ? "_blank" : "_self"}
                    onClick={(e) => {
                      if (!project?.docsLink) {
                        e.preventDefault();
                        if (user._id === project.postedBy._id) {
                          handleEditLink("docs");
                        }
                      }
                    }}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                      <FaLink className="text-gray-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        Project Documentation
                      </h4>
                      <p className="text-sm text-gray-500">
                        {project?.docsLink ? (
                          project.docsLink
                        ) : requestStatus === "collaborated" ||
                          project.postedBy._id === user._id ? (
                          <span className="flex items-center">
                            <FaPlusCircle className="mr-1" />
                            {user._id === project.postedBy._id
                              ? "Add documentation link"
                              : "Not added yet"}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FaLock className="mr-1" /> Join team to access
                          </span>
                        )}
                      </p>
                    </div>
                    {user._id === project.postedBy._id && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditLink("docs");
                        }}
                        className="text-gray-500 hover:text-indigo-600 ml-2"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Tech Stack and Timeline */}
            <div>
              {/* Tech Stack Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaCode className="mr-2 text-indigo-500" />
                  Technology Stack
                </h2>
                <div className="space-y-2 overflow-y-auto max-h-96">
                  {project?.techStack?.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                      <span className="text-gray-700">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-indigo-500" />
                  Project Timeline
                </h2>
                <div className="space-y-6">
                  <div className="relative pl-8 border-l-2 border-indigo-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-indigo-500"></div>
                    <h3 className="text-indigo-600 font-medium">
                      Project Started
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(project?.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="relative pl-8 border-l-2 border-indigo-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-indigo-400"></div>
                    <h3 className="text-indigo-600 font-medium">In Progress</h3>
                    <p className="text-sm text-gray-500">Development phase</p>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gray-300"></div>
                    <h3 className="text-gray-400 font-medium">
                      Project Completion
                    </h3>
                    <p className="text-sm text-gray-400">
                      {project?.deadline || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Team Members */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Team Members
                  </h2>
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    {project?.collobrators?.length || 0} /{" "}
                    {project?.membersNeeded}
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* Project Owner */}
                  <div className="p-6 flex items-center">
                    <div className="shrink-0 mr-4">
                      <img
                        src={
                          project?.postedBy?.profileImageUrl ||
                          "/default-avatar.png"
                        }
                        alt={project?.postedBy?.username}
                        className="w-10 h-10 rounded-full cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {project?.postedBy?.username}
                      </h3>
                      <p className="text-sm text-gray-500">Project Lead</p>
                    </div>
                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Owner
                    </div>
                  </div>

                  {/* Collaborators */}
                  {project?.collobrators
                    ?.filter((c) => c._id !== project?.postedBy._id)
                    .map((collaborator) => (
                      <div
                        key={collaborator._id}
                        className="p-6 flex items-center"
                      >
                        <div className="shrink-0 mr-4">
                          <img
                            src={
                              collaborator.profileImageUrl ||
                              "/default-avatar.png"
                            }
                            alt={collaborator.username}
                            className="w-10 h-10 rounded-full cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {collaborator.username}
                          </h3>
                          <p className="text-sm text-gray-500">Team Member</p>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Collaborator
                        </div>
                      </div>
                    ))}

                  {/* Empty state if no collaborators */}
                  {project?.collobrators?.length <= 1 && (
                    <div className="p-8 text-center text-gray-500">
                      <div className="flex justify-center mb-4">
                        <FaUsers className="text-gray-300 text-4xl" />
                      </div>
                      <p className="mb-2">No team members yet</p>
                      <p className="text-sm">
                        Join the team to collaborate on this project!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Skills Needed */}
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaTasks className="mr-2 text-indigo-500" />
                  Skills Needed
                </h2>
                <div className="space-y-2">
                  {project?.skillsNeeded?.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))}

                  {/* Empty state if no skills listed */}
                  {(!project?.skillsNeeded ||
                    project?.skillsNeeded?.length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      <p>No specific skills listed</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Openings */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaUsers className="mr-2 text-indigo-500" />
                  Team Openings
                </h2>
                <div className="space-y-4">
                  {project?.openPositions?.map((position, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-colors"
                    >
                      <h3 className="font-medium text-gray-800 mb-1">
                        {position.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {position.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {position.skills?.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Empty state if no positions listed */}
                  {(!project?.openPositions ||
                    project?.openPositions?.length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      <p>No specific positions listed</p>
                      <p className="text-sm mt-1">
                        Contact the project owner for more information
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab - Only visible to project owner */}
        {activeTab === "requests" && user._id === project.postedBy._id && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Collaboration Requests
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {project?.requests?.map((request) => (
                <div
                  key={request._id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center"
                >
                  <div className="flex items-center mb-4 sm:mb-0 flex-1 gap-x-4">
                    <div className="shrink-0">
                      <img
                        src={request.profileImageUrl || "/default-avatar.png"}
                        alt={request.username}
                        className="w-10 h-10 rounded-full cursor-pointer"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {request.username}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Requested to join your project
                      </p>
                    </div>
                  </div>

                  {/* Accept/Reject Buttons */}

                  <div className="flex space-x-3 ml-0 sm:ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleCollaborationRequest("accept", request._id)
                      }
                      className="px-5 py-2.5 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg transition-all duration-200 font-semibold flex items-center space-x-2 shadow-md shadow-green-200 hover:shadow-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-white/90" />
                      <span>Accept Request</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleCollaborationRequest("reject", request._id)
                      }
                      className="px-5 py-2.5 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-full hover:shadow-lg transition-all duration-200 font-semibold flex items-center space-x-2 shadow-md shadow-red-200 hover:shadow-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <XCircleIcon className="w-5 h-5 text-white/90" />
                      <span>Decline</span>
                    </motion.button>
                  </div>
                </div>
              ))}

              {/* Empty state for no requests */}
              {(!project?.requests || project?.requests?.length === 0) && (
                <div className="p-8 text-center text-gray-500">
                  <div className="flex justify-center mb-4">
                    <FaBell className="text-gray-300 text-4xl" />
                  </div>
                  <p>No pending collaboration requests</p>
                  <p className="text-sm mt-1">
                    When someone requests to join, they'll appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Project Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-8 text-indigo-500 mt-0.5">
                          <FaUserAlt />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Posted By
                          </h4>
                          <p>{project?.postedBy?.username}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 text-indigo-500 mt-0.5">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Posted Date
                          </h4>
                          <p>
                            {new Date(project?.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 text-indigo-500 mt-0.5">
                          <FaClock />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Duration
                          </h4>
                          <p>{project?.duration || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 text-indigo-500 mt-0.5">
                          <FaMapMarkerAlt />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Location
                          </h4>
                          <p>{project?.location || "Remote"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Project Requirements
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-8 text-indigo-500 mt-0.5">
                          <FaUsers />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Team Size
                          </h4>
                          <p>{project?.membersNeeded} members needed</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 text-indigo-500 mt-0.5">
                          <FaChartLine />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Complexity
                          </h4>
                          <p>{project?.complexity || "Moderate"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 text-indigo-500 mt-0.5">
                          <FaCode />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Tech Stack
                          </h4>
                          <p>{project?.techStack?.join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 text-indigo-500 mt-0.5">
                          <FaTasks />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Skills Needed
                          </h4>
                          <p>
                            {project?.skillsNeeded?.join(", ") ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Additional Information
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {project?.additionalInfo ||
                      "No additional information provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* // And add the collaboration tab content */}
        {activeTab === "collaboration" && (
          <div className="space-y-8">
            <TaskBoard project={project} currentUser={user} />
            <FileSharing project={project} currentUser={user} />
            <ProjectMilestones project={project} currentUser={user} />
          </div>
        )}
      </div>

      {/* Chat Component */}
      <GroupChat
        showChat={showChat}
        setShowChat={setShowChat}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        currentUser={user}
        projectTitle={project?.title}
      />

      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {linkType === "github"
                ? "GitHub Repository Link"
                : "Documentation Link"}
            </h3>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder={`Enter ${
                linkType === "github" ? "GitHub" : "documentation"
              } URL`}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveLink}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Confirm Deletion
            </h2>
            <p className="mb-2">
              To confirm deletion, type the project name:{" "}
              <strong>{project.title}</strong>
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Enter project name"
              className="border p-2 w-full rounded mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(project.title)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Task Management Component
const TaskBoard = ({ project, currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo",
  });
  const [showAddTask, setShowAddTask] = useState(false);

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks/${project._id}`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/tasks/${project._id}`,
        {
          ...newTask,
          createdBy: currentUser._id,
        },
        { withCredentials: true }
      );

      fetchTasks();
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        status: "todo",
      });
      setShowAddTask(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/tasks/${taskId}/status`,
        {
          status: newStatus,
        },
        { withCredentials: true }
      );

      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Tasks</h2>
        {(currentUser._id === project.postedBy._id ||
          project.collobrators.some((c) => c._id === currentUser._id)) && (
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showAddTask ? "Cancel" : "Add Task"}
          </button>
        )}
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={createTask}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Unassigned</option>
                  <option value={project.postedBy._id}>
                    {project.postedBy.username}
                  </option>
                  {project.collobrators.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task Boards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To Do Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">To Do</h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "todo")
                .map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">
                          Assigned By:{" "}
                          {task.assignedTo
                            ? project.collobrators.find(
                                (u) => u._id === task.assignedTo
                              )?.username || project.postedBy.username
                            : "Unassigned"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Assigned To:{" "}
                          {task.assignedTo.username || "Unassigned"}
                        </span>
                      </div>

                      <button
                        onClick={() => updateTaskStatus(task._id, "inprogress")}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              {tasks.filter((task) => task.status === "todo").length === 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">In Progress</h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "inprogress")
                .map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        Assigned:{" "}
                        {task.assignedTo
                          ? project.collobrators.find(
                              (u) => u._id === task.assignedTo
                            )?.username || project.postedBy.username
                          : "Unassigned"}
                      </span>
                      <button
                        onClick={() => updateTaskStatus(task._id, "completed")}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              {tasks.filter((task) => task.status === "inprogress").length ===
                0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">Completed</h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "completed")
                .map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        Completed by:{" "}
                        {task.assignedTo
                          ? project.collobrators.find(
                              (u) => u._id === task.assignedTo
                            )?.username || project.postedBy.username
                          : "Unassigned"}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              {tasks.filter((task) => task.status === "completed").length ===
                0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectMilestones = ({ project, currentUser }) => {
  const [milestones, setMilestones] = useState([]);
  const [showAddMilestone, setShowAddMilestone] = useState(true);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  });

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/collaboration/milestones/${project._id}`,
        {
          withCredentials: true,
        }
      );
      setMilestones(response.data);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  const createMilestone = async (e) => {
    e.preventDefault();
    console.log("Project Object:", project);
    console.log("Project ID:", project?._id);
    try {
      await axios.post(
        `${API_URL}/collaboration/milestones/${project?._id}`,
        {
          ...newMilestone,
          createdBy: currentUser._id,
        },
        { withCredentials: true }
      );

      fetchMilestones();
      setNewMilestone({
        title: "",
        description: "",
        dueDate: "",
        completed: false,
      });
      setShowAddMilestone(false);
    } catch (error) {
      console.error("Error creating milestone:", error);
    }
  };

  const toggleMilestoneStatus = async (milestoneId, completed) => {
    try {
      await axios.patch(
        `${API_URL}/collaboration/milestone/${milestoneId}`,
        {
          completed: !completed,
        },
        { withCredentials: true }
      );

      fetchMilestones();
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Project Milestones</h2>
        {currentUser._id === project.postedBy._id && (
          <button
            onClick={() => setShowAddMilestone(!showAddMilestone)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showAddMilestone ? "Cancel" : "Add Milestone"}
          </button>
        )}
      </div>

      {/* Add Milestone Form */}
      {showAddMilestone && (
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={createMilestone}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    description: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Milestone
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Milestone Timeline */}
      <div className="p-6">
        {milestones.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-gray-300"
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
            <p className="text-lg mb-1">No milestones created yet</p>
            <p className="text-sm">Add project milestones to track progress</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-4 md:left-6 w-0.5 bg-indigo-200"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const isOverdue =
                  new Date(milestone.dueDate) < new Date() &&
                  !milestone.completed;

                return (
                  <div key={milestone._id} className="relative pl-10 md:pl-12">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-2 top-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        milestone.completed
                          ? "bg-green-100 border-green-500"
                          : isOverdue
                          ? "bg-red-100 border-red-500"
                          : "bg-indigo-100 border-indigo-500"
                      }`}
                    >
                      {milestone.completed ? (
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      ) : isOverdue ? (
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      ) : (
                        <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                      )}
                    </div>

                    <div
                      className={`bg-white p-4 rounded-lg shadow-sm border ${
                        milestone.completed
                          ? "border-green-200"
                          : isOverdue
                          ? "border-red-200"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={`font-medium ${
                            milestone.completed
                              ? "text-green-800"
                              : isOverdue
                              ? "text-red-800"
                              : "text-gray-800"
                          }`}
                        >
                          {milestone.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              milestone.completed
                                ? "bg-green-100 text-green-800"
                                : isOverdue
                                ? "bg-red-100 text-red-800"
                                : "bg-indigo-100 text-indigo-800"
                            }`}
                          >
                            {milestone.completed
                              ? "Completed"
                              : isOverdue
                              ? "Overdue"
                              : "Pending"}
                          </span>
                          {currentUser._id === project.postedBy._id && (
                            <button
                              onClick={() =>
                                toggleMilestoneStatus(
                                  milestone._id,
                                  milestone.completed
                                )
                              }
                              className={`text-xs px-2 py-1 rounded ${
                                milestone.completed
                                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  : "bg-green-100 text-green-600 hover:bg-green-200"
                              }`}
                            >
                              {milestone.completed
                                ? "Mark Incomplete"
                                : "Mark Complete"}
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        {milestone.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                          Created by:{" "}
                          {milestone.createdBy === project.postedBy._id
                            ? project.postedBy.username
                            : project.collobrators.find(
                                (u) => u._id === milestone.createdBy
                              )?.username || "Unknown"}
                        </div>
                        <div
                          className={
                            isOverdue && !milestone.completed
                              ? "text-red-500 font-medium"
                              : ""
                          }
                        >
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FileSharing = ({ project, currentUser }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/files/${project._id}`, {
        withCredentials: true,
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadedBy", currentUser._id);
    formData.append("projectId", project._id);

    setUploading(true);
    try {
      console.log(formData);
      await axios.post(`${API_URL}/files/upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (link, fileName) => {
    const response = await fetch(link);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // optional: rename the file
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  const handleFileDelete = async (fileId) => {
    setDeletingFiles((prev) => ({ ...prev, [fileId]: true }));
    try {
      await axios.delete(`${API_URL}/files/${fileId}`, {
        withCredentials: true,
      });
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setDeletingFiles((prev) => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Project Files</h2>
        {(currentUser._id === project.postedBy._id ||
          project.collobrators.some((c) => c._id === currentUser._id)) && (
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className={`px-4 py-2 rounded-lg flex items-center ${
              uploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } transition-colors`}
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                Upload File
              </>
            )}
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      <div className="p-6">
        {files.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <p className="text-lg mb-1">No files uploaded yet</p>
            <p className="text-sm">
              Upload documents, images, and other project files
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {file.fileName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {file.fileType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {file.uploadedBy === project.postedBy._id
                          ? project.postedBy.username
                          : project.collobrators.find(
                              (u) => u._id === file.uploadedBy
                            )?.username || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Math.round(file.fileSize / 1024)} KB
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() =>
                          handleDownload(file.fileUrl, file.fileName)
                        }
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Download
                      </button>
                      {(currentUser._id === file.uploadedBy ||
                        currentUser._id === project.postedBy._id) && (
                        <button
                          onClick={() => handleFileDelete(file._id)}
                          disabled={deletingFiles[file._id]}
                          className={`relative inline-flex items-center ${
                            deletingFiles[file._id]
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-900"
                          }`}
                        >
                          {deletingFiles[file._id] ? (
                            <>
                              <span className="opacity-0">Delete</span>
                              <span className="absolute inset-0 flex items-center justify-center">
                                <svg
                                  className="animate-spin h-4 w-4 text-red-600"
                                  xmlns="http://www.w3.org/2000/svg"
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
                              </span>
                            </>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
