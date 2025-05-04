import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL } from "../../Utils/constants";
import {
  X,
  Plus,
  Lightbulb,
  PenTool,
  Rocket,
  Users,
  Clock,
  Tag,
} from "lucide-react";
import { IDEA_CATEGORIES, IDEA_SECTORS } from "../../Utils/constants";

const IdeaPostingPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("Username");
  const [activeSection, setActiveSection] = useState("basics");
  const [formProgress, setFormProgress] = useState(0);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const [postData, setPostData] = useState({
    title: "",
    problemStatement: "",
    impact: "",
    uniqueness: "",
    supporter: false,
    approach: "",
    description: "",
    supportType: "",
    category: "",
    sector: "",
    likes: 0,
    prototypeLinks: "",
    tags: [],
  });

  // Calculate form completion percentage
  useEffect(() => {
    const requiredFields = [
      "title",
      "description",
      "category",
      "sector",
      "problemStatement",
      "approach",
      "uniqueness",
      "impact",
      "prototypeLinks",
    ];

    const filledFields = requiredFields.filter(
      (field) => postData[field]?.trim() !== ""
    );
    const percentage = Math.floor(
      (filledFields.length / requiredFields.length) * 100
    );
    setFormProgress(percentage);
  }, [postData]);

  // Update tags in postData when tags state changes
  useEffect(() => {
    setPostData((prev) => ({ ...prev, tags }));
  }, [tags]);

  const handlePostIdea = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_URL}/ideas/postidea`,
        { userUniqueId: userId, ...postData },
        { withCredentials: true }
      );
      navigate("/pitchideas");
    } catch (error) {
      console.error("Error posting idea:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tag management functions
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 6) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Navigation between sections
  const sections = [
    { id: "basics", label: "Basics", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "details", label: "Details", icon: <PenTool className="w-4 h-4" /> },
    { id: "impact", label: "Impact", icon: <Rocket className="w-4 h-4" /> },
  ];

  // Form validation for each section
  const validateBasics = () => {
    return (
      postData.title &&
      postData.category &&
      postData.sector &&
      postData.description
    );
  };

  const validateDetails = () => {
    return (
      postData.problemStatement && postData.approach && postData.uniqueness
    );
  };

  const canSubmit = () => {
    return (
      validateBasics() &&
      validateDetails() &&
      postData.impact &&
      postData.prototypeLinks
    );
  };

  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Form sections
  const renderBasicsSection = () => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Idea Title
          </label>
          <input
            id="title"
            value={postData.title}
            onChange={(e) =>
              setPostData({ ...postData, title: e.target.value })
            }
            type="text"
            className="placeholder-gray-500 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="Give your idea a catchy title"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-orange-500">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex-1 flex items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
                placeholder={tags.length < 6 ? "Add a tag..." : "Max 6 tags"}
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500"
                disabled={tags.length >= 6}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 6}
                className={`ml-1 p-1 rounded-full transition-colors ${
                  !tagInput.trim() || tags.length >= 6
                    ? "text-gray-400"
                    : "text-orange-500 hover:bg-orange-100"
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Add up to 6 tags to help others find your idea
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={postData.category}
            onChange={(e) =>
              setPostData({ ...postData, category: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white"
            required
          >
            <option value="" disabled hidden>
              Select a category
            </option>
            {IDEA_CATEGORIES.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Sector
          </label>
          <select
            id="sector"
            value={postData.sector}
            onChange={(e) =>
              setPostData({ ...postData, sector: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white"
            required
          >
            <option value="" disabled hidden>
              Select a sector
            </option>
            {IDEA_SECTORS.map((sec) => (
              <option key={sec} value={sec.toLowerCase()}>
                {sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={postData.description}
          onChange={(e) =>
            setPostData({ ...postData, description: e.target.value })
          }
          className="w-full p-4 h-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none placeholder-gray-500"
          required
          placeholder="Describe your idea in detail"
        />
        <div className="flex justify-end text-xs text-gray-500">
          {postData.description.length} characters
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigateToSection("details")}
          disabled={!validateBasics()}
          className={`px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
            validateBasics()
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );

  const renderDetailsSection = () => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <PenTool className="w-5 h-5 text-orange-500 mt-1" />
          <label className="block text-sm font-medium text-gray-700">
            What problem does your idea solve?
          </label>
        </div>
        <textarea
          id="problemStatement"
          value={postData.problemStatement}
          onChange={(e) =>
            setPostData({ ...postData, problemStatement: e.target.value })
          }
          className="w-full p-4 h-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
          required
          placeholder="Describe the problem your idea addresses"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-orange-500 mt-1" />
          <label className="block text-sm font-medium text-gray-700">
            How does your solution address this problem?
          </label>
        </div>
        <textarea
          id="approach"
          value={postData.approach}
          onChange={(e) =>
            setPostData({ ...postData, approach: e.target.value })
          }
          className="w-full p-4 h-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none placeholder-gray-500"
          required
          placeholder="Explain your approach to solving the problem"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Tag className="w-5 h-5 text-orange-500 mt-1" />
          <label className="block text-sm font-medium text-gray-700">
            What makes your approach unique?
          </label>
        </div>
        <textarea
          id="uniqueness"
          value={postData.uniqueness}
          onChange={(e) =>
            setPostData({ ...postData, uniqueness: e.target.value })
          }
          className="w-full p-4 h-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none placeholder-gray-500"
          required
          placeholder="Describe what makes your idea stand out from others"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigateToSection("basics")}
          className="px-5 py-2 rounded-lg font-medium flex items-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-50 transition-all duration-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={() => navigateToSection("impact")}
          disabled={!validateDetails()}
          className={`px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
            validateDetails()
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );

  const renderImpactSection = () => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Rocket className="w-5 h-5 text-orange-500 mt-1" />
          <label className="block text-sm font-medium text-gray-700">
            What positive impact will your idea create?
          </label>
        </div>
        <textarea
          id="impact"
          value={postData.impact}
          onChange={(e) => setPostData({ ...postData, impact: e.target.value })}
          className="w-full p-4 h-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none placeholder-gray-500"
          required
          placeholder="Describe the positive impact your idea will have"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Users className="w-5 h-5 text-orange-500 mt-1" />
          <label className="block text-sm font-medium text-gray-700">
            What support do you need to make this idea successful?
          </label>
        </div>
        <textarea
          id="supportType"
          value={postData.supportType}
          onChange={(e) =>
            setPostData({ ...postData, supportType: e.target.value })
          }
          className="w-full p-4 h-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none placeholder-gray-500"
          placeholder="Describe what kind of support you're looking for"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-orange-500 mt-1" />
          <label className="block text-sm font-medium text-gray-700">
            Prototype Links
          </label>
        </div>
        <input
          id="prototypeLinks"
          value={postData.prototypeLinks}
          onChange={(e) =>
            setPostData({ ...postData, prototypeLinks: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-500"
          placeholder="Video links or drive links to your prototype"
        />
        <p className="text-xs text-gray-500">
          Add links to your prototype, videos, or relevant documents
        </p>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigateToSection("details")}
          className="px-5 py-2 rounded-lg font-medium flex items-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-50 transition-all duration-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          Back
        </button>
        <button
          type="submit"
          disabled={!canSubmit() || isSubmitting}
          className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
            canSubmit() && !isSubmitting
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
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
              Submitting...
            </>
          ) : (
            <>
              Submit Idea
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case "basics":
        return renderBasicsSection();
      case "details":
        return renderDetailsSection();
      case "impact":
        return renderImpactSection();
      default:
        return renderBasicsSection();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-20 bg-gradient-to-r from-orange-500 to-red-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-2xl font-bold text-white">Share Your Idea</h1>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500 ease-out"
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>

          {/* Navigation Pills */}
          <div className="flex justify-center mt-4 mb-6">
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => navigateToSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-white text-orange-500 shadow-sm"
                      : "text-gray-600 hover:text-orange-500"
                  }`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tips section */}
          <div className="px-6 mb-4">
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
              <div className="flex gap-2">
                <Lightbulb className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-orange-800">
                    Tips for this section
                  </h3>
                  <p className="text-xs text-orange-700 mt-1">
                    {activeSection === "basics" &&
                      "Be specific about your idea and choose relevant categories and tags."}
                    {activeSection === "details" &&
                      "Clearly define the problem and what makes your solution unique."}
                    {activeSection === "impact" &&
                      "Explain the impact and what support you need to make it successful."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handlePostIdea} className="p-6 pt-0">
            {renderCurrentSection()}
          </form>

          {/* Form progress indicator */}
          <div className="px-6 pb-4 text-right">
            <span className="text-xs font-medium text-gray-500">
              {formProgress}% Complete
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IdeaPostingPage;
