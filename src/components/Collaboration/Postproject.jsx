import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Keep for animations
import { API_URL } from "../../Utils/constants";
import {
  Users,
  BookOpen,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Code2,
  Send,
  Sparkles,
  Tags,
  CheckCircle,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react"; // Keep for icons

// Define constants directly in the file
const IDEA_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "AI & Machine Learning",
  "Data Science",
  "Design",
  "Game Development",
  "Blockchain",
  "Other",
];

// --- CSS Styles ---
// In a real app, move this to a separate ProjectForm.css file and import it
const styles = `
.project-form-container {
  min-height: 100vh;
  background-color: #f3f4f6; /* gray-100 */
  padding: 3rem 1rem; /* py-12 px-4 */
}

.form-card {
  max-width: 48rem; /* max-w-3xl */
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  overflow: hidden;
}

.form-header {
  background-image: linear-gradient(to right, #f97316, #ef4444); /* from-orange-500 to-red-500 */
  padding: 2rem; /* px-8 py-8 */
  border-top-left-radius: 0.75rem; /* rounded-t-xl */
  border-top-right-radius: 0.75rem;
}

.form-header h1 {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700; /* font-bold */
  color: #ffffff;
  text-align: center;
  margin-bottom: 0.75rem; /* mb-3 */
}
.form-header .header-icon-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem; /* mb-3 */
}
.form-header .header-icon-title svg {
   margin-right: 0.75rem; /* mr-3 */
   opacity: 0.9;
}

.form-header p {
  text-align: center;
  color: #ffffff;
  font-size: 0.875rem; /* text-sm */
}

.progress-bar-container {
  margin-top: 1.5rem; /* mt-6 */
  position: relative;
}

.progress-bar-track {
  height: 0.5rem; /* h-2 */
  background-color: rgba(255, 255, 255, 0.2); /* bg-white/20 */
  border-radius: 9999px; /* rounded-full */
}

.progress-bar-fill {
  height: 0.5rem; /* h-2 */
  background-color: #ffffff;
  border-radius: 9999px; /* rounded-full */
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem; /* mt-2 */
  font-size: 0.75rem; /* text-xs */
  color: rgba(255, 255, 255, 0.7); /* text-white/70 */
}

.form-body {
  padding: 2rem; /* p-8 */
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* space-y-6 */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
}

.form-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #111827; /* text-gray-900 */
}

.form-label svg {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
  margin-right: 0.5rem; /* mr-2 */
  color: #f97316; /* text-orange-500 */
}

.form-input,
.form-textarea,
.form-select-button {
  width: 100%;
  padding: 0.75rem 1rem; /* px-4 py-3 */
  font-size: 1rem; /* text-base */
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  transition: border-color 0.2s, box-shadow 0.2s;
  color: #1f2937; /* Default text color */
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9ca3af; /* placeholder-gray-400 */
}

.form-input:focus,
.form-textarea:focus,
.form-select-button:focus,
.tech-stack-input-wrapper:focus-within {
  outline: none;
  border-color: #f97316; /* focus:border-orange-500 */
  box-shadow: 0 0 0 2px #ffedd5; /* focus:ring-2 focus:ring-orange-100 */
}

.form-input.error,
.form-textarea.error,
.form-select-button.error,
.tech-stack-input-wrapper.error {
   border-color: #ef4444; /* border-red-500 */
   box-shadow: 0 0 0 2px #fee2e2; /* ring-2 ring-red-200 */
}
.form-input.error:focus,
.form-textarea.error:focus,
.form-select-button.error:focus,
.tech-stack-input-wrapper.error:focus-within {
   border-color: #ef4444; /* focus:border-red-500 */
   box-shadow: 0 0 0 2px #fee2e2; /* focus:ring-red-100 */
}


.error-text {
  color: #ef4444; /* text-red-500 */
  font-size: 0.75rem; /* text-xs */
  margin-top: 0.25rem; /* mt-1 */
}

.word-count-text {
  color: #6b7280; /* text-gray-500 */
  font-size: 0.75rem; /* text-xs */
  margin-top: 0.25rem; /* mt-1 */
}

/* Category Dropdown */
.category-dropdown-container {
  position: relative;
}
.form-select-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background-color: white;
  cursor: pointer;
}
.form-select-button span {
  color: #1f2937; /* text-gray-900 */
}
.form-select-button span.placeholder {
  color: #9ca3af; /* text-gray-400 */
}
.form-select-button svg {
  color: #6b7280; /* text-gray-500 */
}

.category-dropdown {
  position: absolute;
  z-index: 10;
  margin-top: 0.25rem; /* mt-1 */
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e5e7eb; /* border-gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  max-height: 15rem; /* max-h-60 */
  overflow-y: auto;
}
.category-dropdown button {
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem; /* px-4 py-2 */
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s;
  color: #374151; /* text-gray-700 */
}
.category-dropdown button:hover {
  background-color: #fff7ed; /* hover:bg-orange-50 */
}
.category-dropdown button.selected {
  background-color: #ffedd5; /* bg-orange-100 */
  color: #c2410c; /* text-orange-700 */
  font-weight: 500;
}


/* Button Styles */
.form-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem; /* px-6 py-3 */
  font-size: 1rem; /* text-base */
  font-weight: 500; /* font-medium */
  border-radius: 0.5rem; /* rounded-lg */
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.form-button:focus {
   outline: none;
   box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.4); /* focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 adaptation */
}
.form-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.form-button svg {
  width: 1.125rem; /* w-4 or h-4, adjusted for base size */
  height: 1.125rem;
}


.form-button-primary {
  background-image: linear-gradient(to right, #f97316, #ef4444); /* from-orange-500 to-red-500 */
  color: #ffffff;
}
.form-button-primary:hover {
  background-image: linear-gradient(to right, #ea580c, #dc2626); /* hover:from-orange-600 hover:to-red-600 */
}
.form-button-primary svg {
  margin-right: 0.5rem; /* mr-2 */
}
.form-button-primary .spinner {
   margin: 0 0.75rem 0 -0.25rem; /* Adjust margins for spinner */
   width: 1.25rem; /* h-5 w-5 */
   height: 1.25rem;
}


.form-button-secondary {
  background-color: #ffffff;
  color: #374151; /* text-gray-700 */
  border: 1px solid #d1d5db; /* border-gray-300 */
}
.form-button-secondary:hover {
  background-color: #f9fafb; /* hover:bg-gray-50 */
  border-color: #9ca3af;
}

.form-button-ghost {
  background: none;
  border: none;
  padding: 0.25rem; /* Minimal padding for icon buttons */
  border-radius: 9999px; /* rounded-full */
  color: #ea580c; /* text-orange-600 */
}
.form-button-ghost:hover {
  background-color: #ffedd5; /* hover:bg-orange-100 */
  color: #c2410c; /* hover:text-orange-800 */
}
.form-button-ghost svg {
  width: 0.75rem; /* w-3 */
  height: 0.75rem; /* h-3 */
}


.form-button-icon {
    padding: 0.5rem; /* size="icon" */
    /* Combine with other styles like form-button-secondary for border/bg */
}


/* Section 2 Specifics */
.team-size-control {
  display: flex;
  align-items: center;
}
.team-size-control input[type="number"] {
  text-align: center;
  border-left: none;
  border-right: none;
  border-radius: 0;
  min-width: 3rem; /* Ensure it doesn't collapse */
  flex-grow: 1; /* Take up remaining space */
  /* Remove spinners for a cleaner look */
  -moz-appearance: textfield;
}
.team-size-control input[type="number"]::-webkit-outer-spin-button,
.team-size-control input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.team-size-control button:first-of-type {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.team-size-control button:last-of-type {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.tech-stack-input-wrapper {
  display: flex;
  align-items: center;
  padding: 0 0.5rem 0 1rem; /* Adjust padding */
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.tech-stack-input-wrapper input {
  flex-grow: 1;
  padding: 0.75rem 0; /* Match other inputs vertically */
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
}
.tech-stack-input-wrapper button {
   margin-left: 0.5rem; /* ml-2 */
   padding: 0.5rem; /* Adjust padding */
   background: none;
   border: none;
   cursor: pointer;
   color: #f97316; /* text-orange-500 */
   border-radius: 0.25rem;
}
.tech-stack-input-wrapper button:hover {
   color: #ea580c; /* hover:text-orange-600 */
   background-color: #fff7ed; /* Subtle hover background */
}
.tech-stack-input-wrapper button svg {
   width: 1rem; /* w-4 */
   height: 1rem; /* h-4 */
}


.tech-stack-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; /* gap-2 */
  margin-top: 0.5rem; /* mt-2 */
}

.tech-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem; /* px-3 py-1 */
  border-radius: 9999px; /* rounded-full */
  font-size: 0.875rem; /* text-sm */
  background-color: #ffedd5; /* bg-orange-100 */
  color: #9a3412; /* text-orange-800 */
}
.tech-tag button {
   margin-left: 0.25rem; /* ml-1 */
   padding: 0.1rem; /* Make clickable area small */
   line-height: 1; /* Align icon better */
}
.tech-tag button svg {
   /* Icon size controlled by form-button-ghost */
}

/* Grid Layout */
.grid-cols-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem; /* gap-6 */
}

/* Form Navigation Buttons */
.form-nav-buttons {
  display: flex;
  gap: 1rem; /* gap-4 */
  padding-top: 1rem; /* pt-4 */
}
.form-nav-buttons .back-button {
  width: 33.333%;
}
.form-nav-buttons .submit-button {
  width: 66.667%;
}

/* Success Modal */
.success-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.success-modal-content {
  background-color: #ffffff;
  border-radius: 0.75rem; /* rounded-xl */
  padding: 2rem; /* p-8 */
  max-width: 28rem; /* max-w-md */
  margin: 1rem; /* mx-4 */
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
}
.success-icon-wrapper {
  width: 4rem; /* w-16 */
  height: 4rem; /* h-16 */
  margin: 0 auto 1rem auto; /* mx-auto mb-4 */
  border-radius: 9999px; /* rounded-full */
  background-color: #dcfce7; /* bg-green-100 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-icon-wrapper svg {
  width: 2.5rem; /* w-10 */
  height: 2.5rem; /* h-10 */
  color: #22c55e; /* text-green-500 */
}
.success-modal-content h3 {
  font-size: 1.25rem; /* text-xl */
  font-weight: 700; /* font-bold */
  color: #111827; /* text-gray-900 */
  margin-bottom: 0.5rem; /* mb-2 */
}
.success-modal-content p {
  color: #4b5563; /* text-gray-600 */
  margin-bottom: 1.5rem; /* mb-6 */
}
.success-modal-content .redirect-text {
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* text-gray-500 */
  margin-bottom: 0; /* Reset margin */
}

/* Spinner Animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 1s linear infinite;
}

/* Media Queries for Responsiveness (Optional but Recommended) */
@media (max-width: 768px) { /* md breakpoint */
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .form-nav-buttons {
      flex-direction: column-reverse; /* Stack buttons on smaller screens */
  }
   .form-nav-buttons .back-button,
   .form-nav-buttons .submit-button {
      width: 100%;
   }
}

`;

const ProjectForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    membersNeeded: 2,
    techStack: "", // Input field value
    location: "",
    duration: "",
    deadline: "",
    category: "",
  });

  const [techStackArray, setTechStackArray] = useState([]); // Array of added tech
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSection, setFormSection] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [descriptionWordCount, setDescriptionWordCount] = useState(0);

  const currentDate = new Date().toISOString().split("T")[0];

  // Validation function
  const validateSection1 = useCallback((data) => {
    const errors = {};
    if (!data.title.trim()) errors.title = "Title is required";
    // Allow numbers and special chars in title, remove specific letter/space validation
    // if (!/^[A-Za-z\s]+$/.test(data.title)) {
    //   errors.title = "Title must contain only letters and spaces";
    // }

    const wordCount = data.description
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (!data.description.trim()) {
      errors.description = "Description is required.";
    } else if (wordCount < 20) {
      errors.description = "Description should be at least 20 words";
    } else if (data.description.trim().length > 1000) {
      errors.description = "Description should be max 1000 characters";
    }
    if (!data.category) errors.category = "Category is required";
    return errors;
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val =
      type === "number" ? Math.max(1, parseInt(value, 10) || 1) : value; // Ensure number is >= 1

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (name === "description") {
      setDescriptionWordCount(value.trim().split(/\s+/).filter(Boolean).length);
    }

    // Clear the error for this field when the user makes changes
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name]; // Remove the specific error
      return newErrors;
    });
  };

  const handleTechStackChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, techStack: value }));
    // Clear tech stack error when user types
    if (formErrors.techStack) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.techStack;
        return newErrors;
      });
    }
  };

  const handleAddTech = useCallback(() => {
    const newTech = formData.techStack.trim();
    if (newTech) {
      if (!techStackArray.includes(newTech)) {
        setTechStackArray((prevTech) => [...prevTech, newTech]);
        // Clear tech stack error when a tag is added
        if (formErrors.techStack) {
          setFormErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.techStack;
            return newErrors;
          });
        }
      }
      setFormData((prev) => ({ ...prev, techStack: "" })); // Clear input
    }
  }, [formData.techStack, techStackArray, formErrors.techStack]);

  const handleRemoveTech = (techToRemove) => {
    setTechStackArray((prevTech) =>
      prevTech.filter((tech) => tech !== techToRemove)
    );
  };

  const selectCategory = (category) => {
    setFormData((prev) => ({ ...prev, category }));
    setShowCategoryDropdown(false);
    // Clear category error
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.category;
      return newErrors;
    });
  };

  const nextSection = () => {
    if (formSection === 1) {
      const errors = validateSection1(formData);
      setFormErrors(errors);
      if (Object.keys(errors).length === 0) {
        setFormSection(2);
      }
    }
  };

  const prevSection = () => {
    setFormSection(1);
  };

  const validateForm = useCallback(
    (data, currentTechStackArray) => {
      let errors = { ...validateSection1(data) }; // Start with first section validation

      // Section 2 validation
      if (currentTechStackArray.length === 0) {
        errors.techStack = "At least one technology tag is required";
      }
      if (!data.location.trim()) errors.location = "Location is required";
      if (!data.duration.trim()) errors.duration = "Duration is required";
      if (!data.deadline) errors.deadline = "Deadline is required";

      // Validate membersNeeded separately if needed (though HTML min should handle basics)
      if (!data.membersNeeded || data.membersNeeded < 1) {
        errors.membersNeeded = "At least 1 member is needed";
      }

      return errors;
    },
    [validateSection1]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the current tech input is added if not empty before submitting
    const finalTechStackArray = [...techStackArray];
    if (
      formData.techStack.trim() &&
      !finalTechStackArray.includes(formData.techStack.trim())
    ) {
      finalTechStackArray.push(formData.techStack.trim());
      // Note: techStackArray state won't update immediately here, so use finalTechStackArray for validation
    }

    const errors = validateForm(formData, finalTechStackArray);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const formattedDate = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY

    try {
      const response = await fetch(
        `${API_URL}/collaboration/addProject`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            techStack: finalTechStackArray, // Send the combined array
            postedAt: formattedDate,
            membersNeeded: Number(formData.membersNeeded), // Ensure it's sent as a number
          }),
        },
        { withCredentials: true }
      );
      console.log(response);

      if (response.ok) {
        // Success animation starts via isSubmitting state change
        // Navigate after a delay
        setTimeout(() => {
          navigate("/collaboration"); // Adjust the target route if needed
        }, 2000); // Increased delay to show modal longer
      } else {
        const errorData = await response.json().catch(() => ({
          message: "Failed to create project. Server response not readable.",
        }));
        console.error("Server error:", errorData);
        // You could set an error message state here to display to the user
        setFormErrors((prev) => ({
          ...prev,
          submit:
            errorData.message || "Failed to create project. Please try again.",
        }));
        setIsSubmitting(false); // Stop loading state on error
      }
    } catch (error) {
      console.error("Error posting project:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit:
          "An error occurred. Please check your connection and try again.",
      }));
      setIsSubmitting(false); // Stop loading state on error
    }
  };

  // Add effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCategoryDropdown &&
        !event.target.closest(".category-dropdown-container")
      ) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryDropdown]);

  return (
    <>
      {/* Inject styles */}
      <style>{styles}</style>
      <div className="project-form-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="form-card"
        >
          {/* Header Section */}
          <div className="form-header">
            <div className="header-icon-title">
              <Sparkles className="w-8 h-8 text-white" />
              <h1>Create New Project</h1>
            </div>
            <p>Share your vision and connect with talented collaborators</p>

            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div className="progress-bar-track">
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: "50%" }}
                  animate={{ width: formSection === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
              <div className="progress-labels">
                <span>Project Details</span>
                <span>Requirements</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="form-body">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {formSection === 1 ? (
                  <motion.div
                    key="section1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="form-section"
                  >
                    {/* Project Title */}
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">
                        <Briefcase />
                        Project Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`form-input ${
                          formErrors.title ? "error" : ""
                        }`}
                        placeholder="Enter a compelling project title"
                      />
                      {formErrors.title && (
                        <p className="error-text">{formErrors.title}</p>
                      )}
                    </div>

                    {/* Project Category */}
                    <div className="form-group category-dropdown-container">
                      <label htmlFor="category-button" className="form-label">
                        <Tags />
                        Project Category
                      </label>
                      <div className="relative">
                        <button
                          id="category-button"
                          type="button"
                          onClick={() =>
                            setShowCategoryDropdown(!showCategoryDropdown)
                          }
                          className={`form-select-button ${
                            formErrors.category ? "error" : ""
                          }`}
                          aria-haspopup="listbox"
                          aria-expanded={showCategoryDropdown}
                        >
                          <span
                            className={formData.category ? "" : "placeholder"}
                          >
                            {formData.category || "Select a category"}
                          </span>
                          {showCategoryDropdown ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        <AnimatePresence>
                          {showCategoryDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="category-dropdown"
                              role="listbox"
                            >
                              {IDEA_CATEGORIES.map((category) => (
                                <button
                                  key={category}
                                  type="button"
                                  role="option"
                                  aria-selected={formData.category === category}
                                  onClick={() => selectCategory(category)}
                                  className={
                                    formData.category === category
                                      ? "selected"
                                      : ""
                                  }
                                >
                                  {category}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {formErrors.category && (
                        <p className="error-text">{formErrors.category}</p>
                      )}
                    </div>

                    {/* Project Description */}
                    <div className="form-group">
                      <label htmlFor="description" className="form-label">
                        <BookOpen />
                        Project Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5} // Increased rows slightly
                        className={`form-textarea ${
                          formErrors.description ? "error" : ""
                        }`}
                        placeholder="Describe your project in detail (minimum 20 words, max 1000 characters)"
                      />
                      {formErrors.description ? (
                        <p className="error-text">{formErrors.description}</p>
                      ) : (
                        <p className="word-count-text">
                          {descriptionWordCount} words written (min 20).{" "}
                          {formData.description.length}/1000 characters.
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={nextSection}
                      className="form-button form-button-primary w-full mt-4" // Added w-full and margin-top
                    >
                      Continue
                      <ChevronDown className="w-4 h-4 ml-2" />{" "}
                      {/* Added margin */}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="section2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="form-section"
                  >
                    {/* Team Size Needed */}
                    <div className="form-group">
                      <label htmlFor="membersNeeded" className="form-label">
                        <Users />
                        Team Size Needed (Min. 1)
                      </label>
                      <div className="team-size-control">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              membersNeeded: Math.max(
                                1,
                                prev.membersNeeded - 1
                              ),
                            }))
                          }
                          className="form-button form-button-secondary form-button-icon" // Added secondary style
                          aria-label="Decrease team members needed"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="membersNeeded"
                          name="membersNeeded"
                          min="1"
                          value={formData.membersNeeded}
                          onChange={handleChange}
                          className={`form-input ${
                            formErrors.membersNeeded ? "error" : ""
                          }`}
                          aria-label="Number of team members needed"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              membersNeeded: prev.membersNeeded + 1,
                            }))
                          }
                          className="form-button form-button-secondary form-button-icon" // Added secondary style
                          aria-label="Increase team members needed"
                        >
                          +
                        </button>
                      </div>
                      {formErrors.membersNeeded && (
                        <p className="error-text">{formErrors.membersNeeded}</p>
                      )}
                    </div>

                    {/* Tech Stack */}
                    <div className="form-group">
                      <label htmlFor="techStack" className="form-label">
                        <Code2 />
                        Tech Stack (Add tags)
                      </label>
                      <div
                        className={`tech-stack-input-wrapper ${
                          formErrors.techStack ? "error" : ""
                        }`}
                      >
                        <input
                          type="text"
                          id="techStack"
                          name="techStack" // Name kept for consistency, though value isn't directly submitted
                          value={formData.techStack}
                          onChange={handleTechStackChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTech();
                            }
                          }}
                          placeholder="e.g., React, Node.js - Press Enter to add"
                        />
                        <button
                          type="button"
                          onClick={handleAddTech}
                          aria-label="Add Technology"
                        >
                          <Plus />
                        </button>
                      </div>
                      {formErrors.techStack &&
                        !techStackArray.length && ( // Show error only if array is also empty
                          <p className="error-text">{formErrors.techStack}</p>
                        )}

                      {techStackArray.length > 0 && (
                        <div
                          className="tech-stack-tags"
                          aria-label="Selected technologies"
                        >
                          {techStackArray.map((tech, index) => (
                            <span key={index} className="tech-tag">
                              {tech}
                              <button
                                type="button"
                                onClick={() => handleRemoveTech(tech)}
                                className="form-button-ghost" // Use ghost style for remove
                                aria-label={`Remove ${tech} technology`}
                              >
                                <X />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div className="form-group">
                      <label htmlFor="location" className="form-label">
                        <MapPin />
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`form-input ${
                          formErrors.location ? "error" : ""
                        }`}
                        placeholder="e.g., Remote, New York, Hybrid"
                      />
                      {formErrors.location && (
                        <p className="error-text">{formErrors.location}</p>
                      )}
                    </div>

                    <div className="grid-cols-2">
                      {/* Duration */}
                      <div className="form-group">
                        <label htmlFor="duration" className="form-label">
                          <Clock />
                          Estimated Duration
                        </label>
                        <input
                          type="text"
                          id="duration"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className={`form-input ${
                            formErrors.duration ? "error" : ""
                          }`}
                          placeholder="e.g., 3 months, Ongoing"
                        />
                        {formErrors.duration && (
                          <p className="error-text">{formErrors.duration}</p>
                        )}
                      </div>

                      {/* Deadline */}
                      <div className="form-group">
                        <label htmlFor="deadline" className="form-label">
                          <Calendar />
                          Application Deadline
                        </label>
                        <input
                          type="date"
                          id="deadline"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleChange}
                          min={currentDate}
                          className={`form-input ${
                            formErrors.deadline ? "error" : ""
                          }`}
                        />
                        {formErrors.deadline && (
                          <p className="error-text">{formErrors.deadline}</p>
                        )}
                      </div>
                    </div>

                    {/* Submission Error Message */}
                    {formErrors.submit && (
                      <p
                        className="error-text"
                        style={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        {formErrors.submit}
                      </p>
                    )}

                    <div className="form-nav-buttons">
                      <button
                        type="button"
                        onClick={prevSection}
                        className="form-button form-button-secondary back-button"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="form-button form-button-primary submit-button"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="spinner" // Use CSS class for animation
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              style={{
                                width: "1.25rem",
                                height: "1.25rem",
                                marginRight: "0.75rem",
                              }} // Inline style for size/margin
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
                            Creating...
                          </>
                        ) : (
                          <>
                            <Send style={{ marginRight: "0.5rem" }} />{" "}
                            {/* Inline style for margin */}
                            Create Project
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>

        {/* Success Modal */}
        <AnimatePresence>
          {isSubmitting &&
            !formErrors.submit && ( // Only show modal if submitting successfully
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="success-modal-overlay"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="success-modal-content"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                    className="success-icon-wrapper"
                  >
                    <CheckCircle />
                  </motion.div>
                  <h3>Project Created!</h3>
                  <p>
                    Your project has been successfully created and is now
                    available for collaboration.
                  </p>
                  <p className="redirect-text">
                    Redirecting to collaboration page...
                  </p>
                </motion.div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProjectForm;
