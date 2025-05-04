import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  DollarSign,
  Clock,
  Calendar,
  Award,
  Briefcase,
  MessageCircle,
  Share2,
  Flag,
  ChevronLeft,
  Send,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  User,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../Utils/constants";
import { toast } from "react-hot-toast";

const FreelancerProfile = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/freelancers/${id}`, {
          withCredentials: true,
        });
        setFreelancer(response.data);
      } catch (err) {
        console.error("Error fetching freelancer profile:", err);
        setError(err.message || "Failed to load freelancer profile");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerProfile();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      await axios.post(
        `${API_URL}/messages/send`,
        {
          recipientId: id,
          content: message,
        },
        { withCredentials: true }
      );

      toast.success("Message sent successfully!");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleHire = () => {
    // This would typically open a modal or navigate to a job creation page
    // with this freelancer pre-selected
    toast.success("Hire functionality would open here!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="bg-red-50 p-6 rounded-lg max-w-lg mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/freelancers"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Freelancers
          </Link>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="bg-orange-50 p-6 rounded-lg max-w-lg mx-auto text-center">
          <User className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-orange-700 mb-2">
            Freelancer Not Found
          </h2>
          <p className="text-orange-600 mb-4">
            The freelancer profile you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            to="/freelancers"
            className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Freelancers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/freelancers"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="font-medium">Back to Freelancers</span>
            </Link>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-orange-200 overflow-hidden">
                  <img
                    src={
                      freelancer.profileImage ||
                      "https://via.placeholder.com/200?text=Profile"
                    }
                    alt={freelancer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200?text=Profile";
                    }}
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mt-4 text-center">
                  {freelancer.name}
                </h1>
                <p className="text-gray-600 text-lg text-center">
                  {freelancer.title}
                </p>

                <div className="flex items-center mt-2">
                  <div className="flex items-center text-yellow-400 mr-2">
                    <Star className="w-5 h-5 mr-1 fill-current" />
                    <span className="font-medium">
                      {freelancer.rating || "New"}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    ({freelancer.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Hourly Rate
                      </h3>
                      <p className="text-gray-900">
                        {freelancer.hourlyRate
                          ? `$${freelancer.hourlyRate}/hr`
                          : "Rate not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Location
                      </h3>
                      <p className="text-gray-900">
                        {freelancer.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Availability
                      </h3>
                      <p className="text-gray-900">
                        {freelancer.availability || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Experience Level
                      </h3>
                      <p className="text-gray-900">
                        {freelancer.experienceLevel || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Jobs Completed
                      </h3>
                      <p className="text-gray-900">
                        {freelancer.completedJobs || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Member Since
                      </h3>
                      <p className="text-gray-900">
                        {freelancer.memberSince
                          ? new Date(freelancer.memberSince).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                              }
                            )
                          : "Recently joined"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <button
                      onClick={handleHire}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      Hire {freelancer.name.split(" ")[0]}
                    </button>

                    <div className="relative">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Message ${
                          freelancer.name.split(" ")[0]
                        }...`}
                        rows="3"
                        className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder-gray-500"
                      ></textarea>
                      <button
                        onClick={handleSendMessage}
                        disabled={sending || !message.trim()}
                        className={`absolute right-2 bottom-3 p-2 text-orange-500 hover:text-orange-600 rounded-md hover:bg-orange-50 transition-colors ${
                          sending || !message.trim()
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-6 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "overview"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("portfolio")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "portfolio"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "reviews"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Reviews
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      About Me
                    </h2>
                    <p className="text-gray-700 mb-6 whitespace-pre-line">
                      {freelancer.bio}
                    </p>

                    {/* Skills */}
                    {freelancer.skills && freelancer.skills.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {freelancer.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {freelancer.education &&
                      freelancer.education.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Education
                          </h3>
                          <div className="space-y-4">
                            {freelancer.education.map((edu, index) => (
                              <div
                                key={index}
                                className="border-l-2 border-orange-200 pl-4 py-1"
                              >
                                <h4 className="font-medium text-gray-900">
                                  {edu.degree}
                                </h4>
                                <p className="text-gray-700">{edu.school}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(edu.startDate).getFullYear()} -
                                  {edu.endDate
                                    ? new Date(edu.endDate).getFullYear()
                                    : "Present"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Work Experience */}
                    {freelancer.workExperience &&
                      freelancer.workExperience.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Work Experience
                          </h3>
                          <div className="space-y-4">
                            {freelancer.workExperience.map((exp, index) => (
                              <div
                                key={index}
                                className="border-l-2 border-orange-200 pl-4 py-1"
                              >
                                <h4 className="font-medium text-gray-900">
                                  {exp.title}
                                </h4>
                                <p className="text-gray-700">{exp.company}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(exp.startDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}{" "}
                                  -
                                  {exp.endDate
                                    ? new Date(exp.endDate).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          year: "numeric",
                                        }
                                      )
                                    : "Present"}
                                </p>
                                <p className="text-gray-600 mt-2">
                                  {exp.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Certifications */}
                    {freelancer.certifications &&
                      freelancer.certifications.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Certifications
                          </h3>
                          <div className="space-y-3">
                            {freelancer.certifications.map((cert, index) => (
                              <div key={index} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {cert.name}
                                  </h4>
                                  <p className="text-gray-600">{cert.issuer}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(
                                      cert.issueDate
                                    ).toLocaleDateString("en-US", {
                                      month: "long",
                                      year: "numeric",
                                    })}
                                    {cert.expiryDate &&
                                      ` - ${new Date(
                                        cert.expiryDate
                                      ).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                      })}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {activeTab === "portfolio" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Portfolio
                    </h2>
                    {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {freelancer.portfolio.map((item, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                              <img
                                src={
                                  item.imageUrl ||
                                  "https://via.placeholder.com/600x400?text=Portfolio+Item"
                                }
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/600x400?text=Portfolio+Item";
                                }}
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3">
                                {item.description}
                              </p>
                              {item.projectUrl && (
                                <a
                                  href={item.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-orange-500 text-sm hover:text-orange-600"
                                >
                                  View Project{" "}
                                  <ExternalLink className="ml-1 w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">
                          No portfolio items available.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Client Reviews
                    </h2>
                    {freelancer.reviews && freelancer.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {freelancer.reviews.map((review, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                  <img
                                    src={
                                      review.clientImage ||
                                      "https://via.placeholder.com/40?text=C"
                                    }
                                    alt={review.clientName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/40?text=C";
                                    }}
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {review.clientName}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {review.jobTitle}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(review.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">
                          No reviews available yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
