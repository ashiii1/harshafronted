import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Edit,
  MessageSquare,
  Heart,
  Star,
  Zap,
  Trophy,
  Code,
  Coffee,
  Lightbulb,
  Hexagon,
  ChevronRight,
  ArrowUpRight,
  BookOpen,
  LayoutGrid,
  Network,
  Sparkles,
  Building,
  Clock,
  Calendar,
  Eye,
  PenTool,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../Utils/constants";
import { fetchUser } from "../apiServices";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(null);
  console.log("userId for profile", userId);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        withCredentials: true,
      });
      console.log(response);
      setUser(response.data.data);
      if (isOwnProfile === null) {
        setLoading(true);
      }

      const loggedInUser = await fetchUser();
      console.log("check for match", typeof loggedInUser?._id, typeof userId);
      const isMatch = loggedInUser?._id.toString() === userId.toString();
      setIsOwnProfile(isMatch);
      setLoading(false);

      console.log(isOwnProfile);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsHeaderCollapsed(window.scrollY > 180);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEditProfile = () => {
    navigate("/register");
  };

  // Format date helper
  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Get icon component based on string name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="h-5 w-5 text-amber-600" />;
      case "code":
        return <Code className="h-5 w-5 text-blue-600" />;
      case "coffee":
        return <Coffee className="h-5 w-5 text-orange-600" />;
      case "zap":
        return <Zap className="h-5 w-5 text-yellow-600" />;
      case "star":
        return <Star className="h-5 w-5 text-purple-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-green-600" />;
    }
  };

  // Navigation sections
  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <BookOpen className="h-5 w-5" />,
    },
    { id: "ideas", label: "Ideas", icon: <Lightbulb className="h-5 w-5" /> },
    { id: "network", label: "Network", icon: <Network className="h-5 w-5" /> },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase className="h-5 w-5" />,
    },
  ];

  // Default profile image
  const defaultprofileImageUrl =
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  // Mock achievements for display (would come from backend in real app)
  const achievements = [
    {
      title: "Project Milestone",
      description: "Successfully launched first project",
      date: "2023-03-15",
      icon: "trophy",
    },
    {
      title: "Hackathon Winner",
      description: "First place in national coding competition",
      date: "2023-06-22",
      icon: "code",
    },
    {
      title: "Community Leader",
      description: "Recognized for community contributions",
      date: "2023-09-10",
      icon: "star",
    },
  ];

  // Loading placeholder
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-r-2 border-orange-500 border-b-2 border-orange-500 border-l-2 border-transparent"></div>
          <p className="mt-3 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sticky Navigation Bar (shows on scroll) */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHeaderCollapsed
            ? "opacity-100 translate-y-0 shadow-md"
            : "opacity-0 -translate-y-full"
        }`}
      >
        <div className="bg-white/80 backdrop-blur-md px-4 h-16 flex items-center">
          <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img
                  src={user?.profileImageUrl || defaultprofileImageUrl}
                  alt={user?.firstName || "User"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {user?.firstName || ""} {user?.lastName || ""}
                </h3>
                <p className="text-xs text-gray-500">
                  @{user?.username || "username"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isOwnProfile ? (
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                  <MessageSquare className="h-4 w-4 inline-block mr-1" />
                  Message
                </button>
              ) : (
                <button
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                  onClick={handleEditProfile}
                >
                  <Edit className="h-4 w-4 inline-block mr-1" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-8 pb-16 max-w-[90vw] mx-auto px-4">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-12 h-40 w-40 bg-red-500/10 rounded-full blur-2xl"></div>

          {/* Profile Card */}
          <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Cover Design - Abstract Pattern */}
            <div className="h-48 bg-gradient-to-r from-orange-100/50 via-red-100 to-orange-100/50 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${Math.random() * 10 + 5}rem`,
                        height: `${Math.random() * 10 + 5}rem`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        backgroundColor:
                          i % 3 === 0
                            ? "#f97316"
                            : i % 3 === 1
                            ? "#ef4444"
                            : "#f59e0b",
                        opacity: 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Edit Button */}
              {isOwnProfile && (
                <button
                  onClick={handleEditProfile}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white rounded-lg p-2 shadow-sm transition-all duration-200 z-10 cursor-pointer"
                >
                  <Edit size={16} />
                </button>
              )}
            </div>

            <div className="px-6 md:px-8 pt-6 pb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0 -mt-20 md:-mt-24">
                  <div className="relative">
                    <div className="h-28 w-28 md:h-36 md:w-36 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
                      <img
                        src={user?.profileImageUrl || defaultprofileImageUrl}
                        alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-grow flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center">
                      {user?.firstName || ""} {user?.lastName || ""}
                      {user?.userTypes?.includes("pro") && (
                        <div className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-200 to-red-200 text-red-800">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Pro
                        </div>
                      )}
                    </h1>
                    <p className="text-gray-500">
                      @{user?.username || "username"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 items-center">
                      {user?.workExperience?.[0]?.role && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Briefcase className="h-4 w-4 mr-1.5" />
                          {user.workExperience[0].role}
                        </div>
                      )}

                      {user?.city && (
                        <>
                          {user?.workExperience?.[0]?.role && (
                            <span className="text-gray-300">•</span>
                          )}
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-4 w-4 mr-1.5" />
                            {user.city}
                            {user.state ? `, ${user.state}` : ""}
                          </div>
                        </>
                      )}

                      {user?.friendList?.length > 0 && (
                        <>
                          {(user?.workExperience?.[0]?.role || user?.city) && (
                            <span className="text-gray-300">•</span>
                          )}
                          <div className="flex items-center text-gray-600 text-sm">
                            <Users className="h-4 w-4 mr-1.5" />
                            {user.friendList.length} connection
                            {user.friendList.length !== 1 ? "s" : ""}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                    {!isOwnProfile ? (
                      <>
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center cursor-pointer">
                          <MessageSquare size={16} className="mr-2" />
                          Message
                        </button>
                        <button className="border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all flex cursor-pointer items-center">
                          <Users size={16} className="mr-2" />
                          Connect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEditProfile}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center cursor-pointer"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {user?.about && (
                <div className="mt-6">
                  <p className="text-gray-700 leading-relaxed">{user.about}</p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center transition-all hover:bg-gray-100">
                  <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center mr-3">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Projects</p>
                    <p className="font-bold text-lg">
                      {user?.projectList?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center transition-all hover:bg-gray-100">
                  <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center mr-3">
                    <Lightbulb className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ideas</p>
                    <p className="font-bold text-lg">
                      {user?.ideaList?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center transition-all hover:bg-gray-100">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Network</p>
                    <p className="font-bold text-lg">
                      {user?.friendList?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center transition-all hover:bg-gray-100">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center mr-3">
                    <Building className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Companies</p>
                    <p className="font-bold text-lg">
                      {user?.companyList?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Links & Contact */}
              <div className="mt-6 flex flex-wrap gap-3">
                {user?.github && (
                  <a
                    href={`https://${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Github size={14} />
                    <span>GitHub</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                )}
                {user?.linkedin && (
                  <a
                    href={`https://${user.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Linkedin size={14} />
                    <span>LinkedIn</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                )}
                {user?.twitter && (
                  <a
                    href={`https://${user.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Twitter size={14} />
                    <span>Twitter</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                )}
                {user?.website && (
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Globe size={14} />
                    <span>Website</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                )}
                {user?.email && (
                  <button className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </button>
                )}
                {user?.phoneNumber && (
                  <button className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                    <Phone size={14} />
                    <span>{user.phoneNumber}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="md:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-20">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-orange-50 to-red-50 text-red-700 font-medium"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <span
                      className={`${
                        activeSection === section.id
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {section.icon}
                    </span>
                    <span>{section.label}</span>
                    {activeSection === section.id && (
                      <ChevronRight
                        size={16}
                        className="ml-auto text-red-500"
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* Achievements Preview */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <Trophy size={14} className="mr-2 text-orange-500" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.slice(0, 2).map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="h-6 w-6 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                        {getIconComponent(achievement.icon)}
                      </div>
                      <div className="text-gray-600 truncate">
                        {achievement.title}
                      </div>
                    </div>
                  ))}
                  <button className="text-xs text-orange-600 hover:text-orange-700 flex items-center">
                    View all <ChevronRight size={12} className="ml-1" />
                  </button>
                </div>
              </div>

              {/* User Type Badges */}
              {user?.userTypes && user.userTypes.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Hexagon size={14} className="mr-2 text-blue-500" />
                    User Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.userTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            {/* Overview Tab */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                {/* Skills & Interests */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Skills & Interests</h2>
                    {isOwnProfile && (
                      <button
                        onClick={handleEditProfile}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        SKILLS
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user?.skills && user.skills.length > 0 ? (
                          user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm italic">
                            No skills added yet
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        INTERESTS
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user?.interests && user.interests.length > 0 ? (
                          user.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-gradient-to-r from-green-50 to-green-100 text-green-700"
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm italic">
                            No interests added yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Experience */}
                {user?.workExperience && user.workExperience.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Work Experience</h2>
                      {isOwnProfile && (
                        <button
                          onClick={handleEditProfile}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-6">
                      {user.workExperience.map((work, index) => (
                        <div key={index} className="relative pl-6 pb-6">
                          <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b from-orange-300 to-red-300"></div>
                          <div className="absolute top-0 left-0 transform -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-white"></div>

                          <div>
                            <div className="flex justify-between flex-wrap">
                              <h3 className="font-bold text-lg">
                                {work.role || "Role"}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {formatDate(work.startDate)} -{" "}
                                {work.currentlyWorking
                                  ? "Present"
                                  : formatDate(work.endDate)}
                              </span>
                            </div>
                            <p className="text-orange-600 font-medium">
                              {work.company || "Company"}
                            </p>
                            {work.description && (
                              <p className="mt-2 text-gray-600">
                                {work.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {user?.education && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Education</h2>
                      {isOwnProfile && (
                        <button
                          onClick={handleEditProfile}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center">
                      <div className="mr-4 p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
                        <GraduationCap className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">
                          {user.education}
                        </h3>
                        <p className="text-gray-500">Higher Education</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Information */}
                {(user?.city || user?.country) && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Location</h2>
                      {isOwnProfile && (
                        <button
                          onClick={handleEditProfile}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center">
                      <div className="mr-4 p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl">
                        <MapPin className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="flex flex-col">
                          {user?.street && (
                            <p className="text-gray-600">{user.street}</p>
                          )}
                          {user?.city && (
                            <p className="text-gray-600">
                              {user?.city}
                              {user?.state ? `, ${user?.state}` : ""}
                              {user?.country ? `, ${user?.country}` : ""}
                            </p>
                          )}

                          {user?.pincode && (
                            <p className="text-gray-500">
                              Postal code: {user.pincode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Achievements Section */}
                {achievements.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Achievements</h2>
                    </div>

                    <div className="space-y-4">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-start p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mr-4">
                            {getIconComponent(achievement.icon)}
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-gray-600 text-sm">
                              {achievement.description}
                            </p>
                            <div className="mt-1 text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(achievement.date)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeSection === "projects" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Projects</h2>
                    <button className="text-sm text-orange-500 flex items-center gap-1 hover:text-orange-600">
                      <Eye className="h-4 w-4" />
                      View All
                    </button>
                  </div>

                  {user?.projects && user.projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.projects.map((project, index) => (
                        <div
                          key={index}
                          className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100"></div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg">
                              {project?.title || "Project Name"}
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                              {project?.description?.substring(0, 80)}
                              {project?.description?.length > 80 ? "..." : ""}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {project.owner && (
                                  <span className="text-xs bg-orange-100 text-orange-700 rounded-full px-2 py-0.5">
                                    Owner
                                  </span>
                                )}
                                {project.collaborator && (
                                  <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 ml-2">
                                    Collaborator
                                  </span>
                                )}
                              </div>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Link
                                  to={`/collaboration/projects/${project._id}`}
                                >
                                  <ArrowUpRight size={16} />
                                </Link>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <BookOpen className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-gray-500 font-medium mb-1">
                        No projects yet
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Projects you create or collaborate on will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ideas Tab */}
            {activeSection === "ideas" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Ideas</h2>
                    <button className="text-sm text-orange-500 flex items-center gap-1 hover:text-orange-600">
                      <Eye className="h-4 w-4" />
                      View All
                    </button>
                  </div>

                  {user?.ideas && user.ideas.length > 0 ? (
                    <div className="space-y-4">
                      {user.ideas.map((idea, index) => (
                        <div
                          key={index}
                          className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg">
                                {idea?.title || "Idea Title"}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {idea?.description?.substring(0, 120)}
                                {idea?.description?.length > 120 ? "..." : ""}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-100 to-amber-200 flex items-center justify-center flex-shrink-0 ml-4">
                              <Lightbulb className="h-5 w-5 text-amber-600" />
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center">
                              {idea.owner && (
                                <span className="text-xs bg-orange-100 text-orange-700 rounded-full px-2 py-0.5">
                                  Owner
                                </span>
                              )}
                              {idea.owner.toString() !==
                                user._id.toString() && (
                                <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 ml-2">
                                  Supporter
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm gap-4">
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1 text-red-400" />
                                {idea?.likes || 0}
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1 text-blue-400" />
                                {idea?.comments?.length || 0}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Lightbulb className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-gray-500 font-medium mb-1">
                        No ideas yet
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Ideas you create or support will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Network Tab */}
            {activeSection === "network" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Network</h2>
                    <button className="text-sm text-orange-500 flex items-center gap-1 hover:text-orange-600">
                      <Eye className="h-4 w-4" />
                      View All
                    </button>
                  </div>

                  {user?.friendList && user.friendList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {user.friendList.map((friend, index) => (
                        <div
                          key={index}
                          className="border border-gray-100 rounded-xl p-4 flex items-center hover:shadow-md transition-shadow"
                        >
                          <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                            <img
                              src={
                                friend.profileImageUrl || defaultprofileImageUrl
                              }
                              alt={`${friend.firstName || ""} ${
                                friend.lastName || ""
                              }`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {friend.firstName || ""} {friend.lastName || ""}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              @{friend.username || ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Users className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-gray-500 font-medium mb-1">
                        No connections yet
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Your network connections will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeSection === "experience" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Work Experience</h2>
                    {isOwnProfile && (
                      <button
                        onClick={handleEditProfile}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </div>

                  {user?.workExperience && user.workExperience.length > 0 ? (
                    <div className="space-y-8">
                      {user.workExperience.map((work, index) => (
                        <div key={index} className="relative pl-8 mb-8">
                          {/* Timeline connector */}
                          {index < user.workExperience.length - 1 && (
                            <div className="absolute top-10 bottom-0 left-3 w-0.5 bg-gray-200"></div>
                          )}

                          {/* Timeline dot */}
                          <div className="absolute top-1 left-0 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>

                          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                              <h3 className="font-bold text-lg text-gray-800">
                                {work.role || "Role"}
                              </h3>
                              <div className="flex items-center px-3 py-1 bg-orange-50 rounded-full text-xs text-orange-600">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(work.startDate)} -{" "}
                                {work.currentlyWorking
                                  ? "Present"
                                  : formatDate(work.endDate)}
                              </div>
                            </div>

                            <p className="text-orange-600 font-medium mt-1">
                              {work.company || "Company"}
                            </p>

                            {work.description && (
                              <div className="mt-4">
                                <p className="text-gray-600">
                                  {work.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Briefcase className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-gray-500 font-medium mb-1">
                        No work experience yet
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Add your work experience to showcase your professional
                        journey.
                      </p>
                      {isOwnProfile && (
                        <button
                          onClick={handleEditProfile}
                          className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                          Add Experience
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Companies Section */}
                {user?.companyList && user.companyList.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Companies</h2>
                      <button className="text-sm text-orange-500 flex items-center gap-1 hover:text-orange-600">
                        <Eye className="h-4 w-4" />
                        View All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.companyList.map((companyItem, index) => (
                        <div
                          key={index}
                          className="border border-gray-100 rounded-xl p-4 flex items-center hover:shadow-md transition-shadow"
                        >
                          <div className="h-12 w-12 rounded-lg overflow-hidden mr-4 bg-gray-100 flex items-center justify-center">
                            {companyItem.company?.logo ? (
                              <img
                                src={companyItem.company.logo}
                                alt={companyItem.company?.name || "Company"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Building className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-800">
                              {companyItem.company?.name || "Company Name"}
                            </h3>
                            <div className="flex items-center mt-1">
                              {companyItem.founded && (
                                <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-0.5">
                                  Founder
                                </span>
                              )}
                              {companyItem.invested && (
                                <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 ml-2">
                                  Investor
                                </span>
                              )}
                            </div>
                          </div>
                          <button className="flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                            <ArrowUpRight size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
