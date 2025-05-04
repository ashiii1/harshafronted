import { useState } from "react";
import {
  Check,
  ChevronRight,
  Upload,
  Link,
  User,
  MapPin,
  AlertCircle,
} from "lucide-react";

const FreelancerRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",

    // Professional Details
    professionalTitle: "",
    skills: [],
    hourlyRate: "",
    bio: "",
    experience: "",

    // Portfolio & Work
    portfolioLinks: [""],
    projects: [
      {
        title: "",
        clientName: "",
        description: "",
        duration: "",
        skills: [],
      },
    ],

    // Availability & Preferences
    availability: "available-now",
    workPreference: "remote",
    hoursPerWeek: "30-40",

    // Profile & Verification
    avatar: null,
    idVerified: false,
    linkedInProfile: "",
    education: [
      { institution: "", degree: "", fieldOfStudy: "", from: "", to: "" },
    ],
    certifications: [
      {
        name: "",
        issuingOrganization: "",
        issueDate: "",
        expirationDate: "",
        credentialId: "",
      },
    ],
  });

  const totalSteps = 5;

  const handleInputChange = (e, section, index, subfield) => {
    const { name, value } = e.target;

    if (section && index !== undefined && subfield) {
      // Handle nested array objects (like projects)
      setFormData((prev) => {
        const updated = [...prev[section]];
        updated[index] = { ...updated[index], [subfield]: value };
        return { ...prev, [section]: updated };
      });
    } else if (section) {
      // Handle arrays (like portfolioLinks)
      setFormData((prev) => {
        const updated = [...prev[section]];
        updated[index] = value;
        return { ...prev, [section]: updated };
      });
    } else {
      // Handle regular fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillChange = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      const newSkill = e.target.value.trim();
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      e.target.value = "";
    }
  };

  const handleProjectSkillChange = (e, index) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      const newSkill = e.target.value.trim();
      setFormData((prev) => {
        const updatedProjects = [...prev.projects];
        updatedProjects[index] = {
          ...updatedProjects[index],
          skills: [...(updatedProjects[index].skills || []), newSkill],
        };
        return { ...prev, projects: updatedProjects };
      });
      e.target.value = "";
    }
  };

  const addListItem = (section) => {
    if (section === "portfolioLinks") {
      setFormData((prev) => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, ""],
      }));
    } else if (section === "projects") {
      setFormData((prev) => ({
        ...prev,
        projects: [
          ...prev.projects,
          {
            title: "",
            clientName: "",
            description: "",
            duration: "",
            skills: [],
          },
        ],
      }));
    } else if (section === "education") {
      setFormData((prev) => ({
        ...prev,
        education: [
          ...prev.education,
          { institution: "", degree: "", fieldOfStudy: "", from: "", to: "" },
        ],
      }));
    } else if (section === "certifications") {
      setFormData((prev) => ({
        ...prev,
        certifications: [
          ...prev.certifications,
          {
            name: "",
            issuingOrganization: "",
            issueDate: "",
            expirationDate: "",
            credentialId: "",
          },
        ],
      }));
    }
  };

  const removeListItem = (section, index) => {
    setFormData((prev) => {
      const updated = [...prev[section]];
      updated.splice(index, 1);
      return { ...prev, [section]: updated };
    });
  };

  const removeSkill = (index) => {
    setFormData((prev) => {
      const updated = [...prev.skills];
      updated.splice(index, 1);
      return { ...prev, skills: updated };
    });
  };

  const removeProjectSkill = (projectIndex, skillIndex) => {
    setFormData((prev) => {
      const updatedProjects = [...prev.projects];
      const updatedSkills = [...updatedProjects[projectIndex].skills];
      updatedSkills.splice(skillIndex, 1);
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        skills: updatedSkills,
      };
      return { ...prev, projects: updatedProjects };
    });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // On final step, submit the whole form
    if (currentStep === totalSteps) {
      console.log("Form submitted:", formData);
      // TODO: API call to submit freelancer data
      // Redirect to success page or dashboard
    } else {
      // Otherwise, go to next step
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 pt-12 pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Join Our Freelancer Network
          </h1>
          <p className="mt-2 text-center text-orange-50">
            Showcase your skills and connect with clients looking for your
            expertise
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step < currentStep
                      ? "bg-green-500 text-white"
                      : step === currentStep
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    step === currentStep ? "text-orange-500" : "text-gray-500"
                  }`}
                >
                  {step === 1
                    ? "Basic Info"
                    : step === 2
                    ? "Professional Details"
                    : step === 3
                    ? "Portfolio & Work"
                    : step === 4
                    ? "Availability"
                    : "Verification"}
                </span>

                {step < totalSteps && (
                  <div className="hidden sm:block w-full border-t border-gray-300 mt-4 flex-1"></div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location*
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <label
                          htmlFor="avatar-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </label>
                        <input
                          type="file"
                          id="avatar-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          PNG or JPG (Max 2MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Professional Details
                </h2>

                <div>
                  <label
                    htmlFor="professionalTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Professional Title*
                  </label>
                  <input
                    type="text"
                    id="professionalTitle"
                    name="professionalTitle"
                    placeholder="e.g. Full Stack Developer, UX/UI Designer"
                    value={formData.professionalTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="skills-input"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Skills*
                  </label>
                  <input
                    type="text"
                    id="skills-input"
                    placeholder="Type skill and press Enter"
                    onKeyDown={handleSkillChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />

                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          className="text-orange-700 hover:text-orange-900 focus:outline-none"
                          onClick={() => removeSkill(index)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hourlyRate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hourly Rate ($)*
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    placeholder="e.g. 45"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Set your competitive rate based on your skills and market
                    value
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Professional Bio*
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    placeholder="Describe your professional background, expertise, and what makes you stand out..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Your bio appears on your profile and helps clients
                    understand your expertise and style.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Years of Experience*
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select years of experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Portfolio & Work History */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Portfolio & Work History
                </h2>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Portfolio Links
                    </label>
                    <button
                      type="button"
                      onClick={() => addListItem("portfolioLinks")}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      + Add Another Link
                    </button>
                  </div>

                  {formData.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 mb-3">
                      <div className="relative flex-1">
                        <Link className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://your-portfolio-link.com"
                          value={link}
                          onChange={(e) =>
                            handleInputChange(e, "portfolioLinks", index)
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      {formData.portfolioLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeListItem("portfolioLinks", index)
                          }
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Project Showcase
                    </label>
                    <button
                      type="button"
                      onClick={() => addListItem("projects")}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      + Add Project
                    </button>
                  </div>

                  {formData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          Project {index + 1}
                        </h4>
                        {formData.projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeListItem("projects", index)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Title*
                          </label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) =>
                              handleInputChange(e, "projects", index, "title")
                            }
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name
                          </label>
                          <input
                            type="text"
                            value={project.clientName}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "projects",
                                index,
                                "clientName"
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Description*
                          </label>
                          <textarea
                            rows="3"
                            value={project.description}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "projects",
                                index,
                                "description"
                              )
                            }
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 3 months"
                            value={project.duration}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "projects",
                                index,
                                "duration"
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Skills Used
                          </label>
                          <input
                            type="text"
                            placeholder="Type skill and press Enter"
                            onKeyDown={(e) =>
                              handleProjectSkillChange(e, index)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.skills &&
                              project.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-sm flex items-center gap-1"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    className="text-orange-700 hover:text-orange-900 focus:outline-none"
                                    onClick={() =>
                                      removeProjectSkill(index, skillIndex)
                                    }
                                  >
                                    &times;
                                  </button>
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Availability & Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Availability & Preferences
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Availability*
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="availability"
                        value="available-now"
                        checked={formData.availability === "available-now"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="ml-3">
                        <span className="text-gray-900 font-medium">
                          Available Now
                        </span>
                        <p className="text-sm text-gray-500">
                          Ready to take on new projects immediately
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="availability"
                        value="available-within-week"
                        checked={
                          formData.availability === "available-within-week"
                        }
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="ml-3">
                        <span className="text-gray-900 font-medium">
                          Available within 1 week
                        </span>
                        <p className="text-sm text-gray-500">
                          Can start new projects within 7 days
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="availability"
                        value="limited"
                        checked={formData.availability === "limited"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="ml-3">
                        <span className="text-gray-900 font-medium">
                          Limited Availability
                        </span>
                        <p className="text-sm text-gray-500">
                          Currently busy but can take small projects
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Preference*
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="workPreference"
                        value="remote"
                        checked={formData.workPreference === "remote"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="ml-3">
                        <span className="text-gray-900 font-medium">
                          Remote Only
                        </span>
                        <p className="text-sm text-gray-500">
                          Prefer to work fully remote
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="workPreference"
                        value="hybrid"
                        checked={formData.workPreference === "hybrid"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="ml-3">
                        <span className="text-gray-900 font-medium">
                          Hybrid
                        </span>
                        <p className="text-sm text-gray-500">
                          Open to both remote and on-site work
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="workPreference"
                        value="onsite"
                        checked={formData.workPreference === "onsite"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="ml-3">
                        <span className="text-gray-900 font-medium">
                          On-site
                        </span>
                        <p className="text-sm text-gray-500">
                          Prefer on-site work in my location
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours Per Week*
                  </label>
                  <select
                    name="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  >
                    <option>20 hours</option>
                    <option>30 hours</option>
                    <option>40 hours</option>
                    <option>50 hours</option>
                  </select>
                </div>
              </div>
            )}
            {/* Step 5: Verification & Education */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Verification & Education
                </h2>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-start gap-3">
                  <div className="mt-1">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-orange-800">
                      Why verify your profile?
                    </h3>
                    <p className="mt-1 text-sm text-orange-700">
                      Verified profiles receive 3x more client attention and are
                      prioritized in search results. Complete this step to boost
                      your visibility on our platform.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="linkedInProfile"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedInProfile}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    We use your LinkedIn profile to verify your professional
                    experience
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Education
                    </label>
                    <button
                      type="button"
                      onClick={() => addListItem("education")}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      + Add Education
                    </button>
                  </div>

                  {formData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          Education {index + 1}
                        </h4>
                        {formData.education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeListItem("education", index)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "education",
                                index,
                                "institution"
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              handleInputChange(e, "education", index, "degree")
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={edu.fieldOfStudy}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "education",
                                index,
                                "fieldOfStudy"
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Year
                          </label>
                          <input
                            type="text"
                            value={edu.from}
                            onChange={(e) =>
                              handleInputChange(e, "education", index, "from")
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Year
                          </label>
                          <input
                            type="text"
                            value={edu.to}
                            onChange={(e) =>
                              handleInputChange(e, "education", index, "to")
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Certifications
                    </label>
                    <button
                      type="button"
                      onClick={() => addListItem("certifications")}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      + Add Certification
                    </button>
                  </div>

                  {formData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          Certification {index + 1}
                        </h4>
                        {formData.certifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeListItem("certifications", index)
                            }
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Certification Name
                          </label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "certifications",
                                index,
                                "name"
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issuing Organization
                          </label>
                          <input
                            type="text"
                            value={cert.issuingOrganization}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "certifications",
                                index,
                                "issuingOrganization"
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Date
                          </label>
                          <input
                            type="month"
                            value={cert.issueDate}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "certifications",
                                index,
                                "issueDate"
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date (if applicable)
                          </label>
                          <input
                            type="month"
                            value={cert.expirationDate}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "certifications",
                                index,
                                "expirationDate"
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Credential ID
                          </label>
                          <input
                            type="text"
                            value={cert.credentialId}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "certifications",
                                index,
                                "credentialId"
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="terms"
                        className="font-medium text-gray-700"
                      >
                        I agree to the Terms of Service and Privacy Policy
                      </label>
                      <p className="text-gray-500">
                        By checking this box, you agree to our terms and
                        conditions, freelancer agreement, and acknowledge our
                        privacy policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Navigation */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {currentStep === totalSteps ? "Submit Profile" : "Next"}
                {currentStep !== totalSteps && (
                  <ChevronRight className="ml-2 h-5 w-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreelancerRegistration;

//     import React, { useState } from 'react';
// import { Check, ChevronRight, Upload, Link, User, Briefcase, Award, Star, Clock, MapPin, Settings, AlertCircle, Calendar } from 'lucide-react';

// const FreelancerRegistration = () => {
//   const [currentStep, setCurrentStep] = useState(5);
//   const [formData, setFormData] = useState({
//     // Basic Information
//     firstName: 'Jane',
//     lastName: 'Smith',
//     email: 'jane.smith@example.com',
//     phone: '(555) 123-4567',
//     location: 'New York, USA',

//     // Professional Details
//     professionalTitle: 'Full Stack Developer',
//     skills: ['React', 'Node.js', 'TypeScript', 'UI/UX Design', 'API Development'],
//     hourlyRate: '65',
//     bio: 'Experienced full stack developer with 7+ years building web applications for startups and enterprise clients. Specialized in React ecosystem with strong backend skills in Node.js. Passionate about creating clean, maintainable code and intuitive user experiences.',
//     experience: '5-10',

//     // Portfolio & Work
//     portfolioLinks: [
//       'https://janesmith.dev',
//       'https://github.com/janesmith',
//       'https://linkedin.com/in/janesmith'
//     ],
//     projects: [
//       {
//         title: 'E-commerce Platform Redesign',
//         clientName: 'RetailFusion',
//         description: 'Led frontend development for a complete overhaul of an e-commerce platform serving 50,000+ monthly users. Implemented responsive design, optimized performance, and integrated with headless CMS.',
//         duration: '6 months',
//         skills: ['React', 'Redux', 'GraphQL', 'Shopify API']
//       },
//       {
//         title: 'Healthcare Provider Portal',
//         clientName: 'MediConnect',
//         description: 'Developed a secure portal for healthcare providers to manage patient records, appointments, and billing. Implemented strict HIPAA compliance measures and authentication workflows.',
//         duration: '4 months',
//         skills: ['Node.js', 'Express', 'MongoDB', 'JWT Authentication']
//       }
//     ],

//     // Availability & Preferences
//     availability: 'available-now',
//     workPreference: 'remote',
//     hoursPerWeek: '30-40',

//     // Profile & Verification
//     avatar: null,
//     idVerified: true,
//     linkedInProfile: 'https://linkedin.com/in/janesmith',
//     education: [
//       {
//         institution: 'University of Technology',
//         degree: 'Bachelor of Science',
//         fieldOfStudy: 'Computer Science',
//         from: '2012',
//         to: '2016'
//       }
//     ],
//     certifications: [
//       {
//         name: 'AWS Certified Solutions Architect',
//         issuingOrganization: 'Amazon Web Services',
//         issueDate: '2021-08',
//         expirationDate: '2024-08',
//         credentialId: 'ASA-12345'
//       },
//       {
//         name: 'Professional Scrum Master I',
//         issuingOrganization: 'Scrum.org',
//         issueDate: '2020-05',
//         expirationDate: '',
//         credentialId: 'PSM-98765'
//       }
//     ]
//   });

//   const totalSteps = 5;

//   const handleInputChange = (e, section, index, subfield) => {
//     const { name, value } = e.target;

//     if (section && index !== undefined && subfield) {
//       // Handle nested array objects (like projects)
//       setFormData(prev => {
//         const updated = [...prev[section]];
//         updated[index] = { ...updated[index], [subfield]: value };
//         return { ...prev, [section]: updated };
//       });
//     } else if (section) {
//       // Handle arrays (like portfolioLinks)
//       setFormData(prev => {
//         const updated = [...prev[section]];
//         updated[index] = value;
//         return { ...prev, [section]: updated };
//       });
//     } else {
//       // Handle regular fields
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSkillChange = (e) => {
//     if (e.key === 'Enter' && e.target.value.trim() !== '') {
//       e.preventDefault();
//       const newSkill = e.target.value.trim();
//       setFormData(prev => ({
//         ...prev,
//         skills: [...prev.skills, newSkill]
//       }));
//       e.target.value = '';
//     }
//   };

//   const handleProjectSkillChange = (e, index) => {
//     if (e.key === 'Enter' && e.target.value.trim() !== '') {
//       e.preventDefault();
//       const newSkill = e.target.value.trim();
//       setFormData(prev => {
//         const updatedProjects = [...prev.projects];
//         updatedProjects[index] = {
//           ...updatedProjects[index],
//           skills: [...(updatedProjects[index].skills || []), newSkill]
//         };
//         return { ...prev, projects: updatedProjects };
//       });
//       e.target.value = '';
//     }
//   };

//   const addListItem = (section) => {
//     if (section === 'portfolioLinks') {
//       setFormData(prev => ({
//         ...prev,
//         portfolioLinks: [...prev.portfolioLinks, '']
//       }));
//     } else if (section === 'projects') {
//       setFormData(prev => ({
//         ...prev,
//         projects: [...prev.projects, { title: '', clientName: '', description: '', duration: '', skills: [] }]
//       }));
//     } else if (section === 'education') {
//       setFormData(prev => ({
//         ...prev,
//         education: [...prev.education, { institution: '', degree: '', fieldOfStudy: '', from: '', to: '' }]
//       }));
//     } else if (section === 'certifications') {
//       setFormData(prev => ({
//         ...prev,
//         certifications: [...prev.certifications, { name: '', issuingOrganization: '', issueDate: '', expirationDate: '', credentialId: '' }]
//       }));
//     }
//   };

//   const removeListItem = (section, index) => {
//     setFormData(prev => {
//       const updated = [...prev[section]];
//       updated.splice(index, 1);
//       return { ...prev, [section]: updated };
//     });
//   };

//   const removeSkill = (index) => {
//     setFormData(prev => {
//       const updated = [...prev.skills];
//       updated.splice(index, 1);
//       return { ...prev, skills: updated };
//     });
//   };

//   const removeProjectSkill = (projectIndex, skillIndex) => {
//     setFormData(prev => {
//       const updatedProjects = [...prev.projects];
//       const updatedSkills = [...updatedProjects[projectIndex].skills];
//       updatedSkills.splice(skillIndex, 1);
//       updatedProjects[projectIndex] = { ...updatedProjects[projectIndex], skills: updatedSkills };
//       return { ...prev, projects: updatedProjects };
//     });
//   };

//   const handleAvatarChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData(prev => ({
//         ...prev,
//         avatar: URL.createObjectURL(e.target.files[0])
//       }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // On final step, submit the whole form
//     if (currentStep === totalSteps) {
//       console.log('Form submitted:', formData);
//       // In a real application, we would submit to an API here
//       alert('Your freelancer profile has been successfully submitted!');
//       // Redirect to success page or dashboard
//       window.location.href = '/dashboard';
//     } else {
//       // Otherwise, go to next step
//       setCurrentStep(prev => prev + 1);
//     }
//   };

//   const goToPreviousStep = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen pb-16">
//       {/* Header */}
//       <section className="bg-gradient-to-r from-orange-500 to-red-500 pt-12 pb-8">
//         <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-white text-center">Join Our Freelancer Network</h1>
//           <p className="mt-2 text-center text-orange-50">Showcase your skills and connect with clients looking for your expertise</p>
//         </div>
//       </section>

//       {/* Progress Steps */}
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between mb-8">
//             {[1, 2, 3, 4, 5].map((step) => (
//               <div key={step} className="flex-1 flex flex-col items-center">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
//                   step < currentStep ? 'bg-green-500 text-white' :
//                   step === currentStep ? 'bg-orange-500 text-white' :
//                   'bg-gray-200 text-gray-500'
//                 }`}>
//                   {step < currentStep ? (
//                     <Check className="w-5 h-5" />
//                   ) : (
//                     <span>{step}</span>
//                   )}
//                 </div>
//                 <span className={`text-xs font-medium ${step === currentStep ? 'text-orange-500' : 'text-gray-500'}`}>
//                   {step === 1 ? 'Basic Info' :
//                    step === 2 ? 'Professional Details' :
//                    step === 3 ? 'Portfolio & Work' :
//                    step === 4 ? 'Availability' :
//                    'Verification'}
//                 </span>

//                 {step < totalSteps && (
//                   <div className="hidden sm:block w-full border-t border-gray-300 mt-4 flex-1"></div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <form onSubmit={handleSubmit}>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default FreelancerRegistration;
