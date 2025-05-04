import React, { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Trash2, UploadIcon } from "lucide-react";
import { z } from "zod";

// Update education schema to be an array of objects
const educationItemSchema = z.object({
  degree: z.string().optional(),
  college: z.string().optional(),
});

// Define Zod schema for team member
const teamMemberSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  experience: z.string().optional(),
  image: z.any().optional(),
});

// Define Zod schema for advisor
const advisorSchema = z.object({
  name: z.string().optional(),
  expertise: z.string().optional(),
  affiliation: z.string().optional(),
  image: z.any().optional(),
});

// Define Zod schema for founder team form
const founderTeamSchema = z.object({
  founderName: z.string().min(1, "Founder name is required"),
  founderEmail: z
    .string()
    .min(1, "Founder email is required")
    .email("Invalid email format"),
  founderPhone: z.string().min(1, "Founder phone is required"),
  founderLinkedIn: z
    .string()
    .min(1, "Founder LinkedIn is required")
    .url("Must be a valid URL"),
  founderEducation: z.array(educationItemSchema),
  founderImage: z.any().optional(),
  founderBio: z.string().optional(),
  founderExperience: z.string().optional(),
  founderAchievements: z.string().optional(),

  teamSize: z
    .string()
    .or(z.number())
    .refine((val) => Number(val) >= 1, {
      message: "Team size must be at least 1",
    }),

  keyTeamMembers: z.array(teamMemberSchema),
  advisors: z.array(advisorSchema),
});

const FounderTeam = ({
  formData,
  handleArrayChange,
  handleArrayFileChange,
  addArrayItem,
  removeArrayItem,
  handleInputChange,
  handleFileChange,
  handleNext,
  handlePrev,
  currentStep,
  stepsLength,
  setErrors,
  errors,
}) => {
  const [isFormValid, setIsFormValid] = useState(true);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);
  const [founderImagePreview, setFounderImagePreview] = useState(null);

  // Initialize education if it doesn't exist
  useEffect(() => {
    if (
      !formData.founderEducation ||
      !Array.isArray(formData.founderEducation) ||
      formData.founderEducation.length === 0
    ) {
      addArrayItem("founderEducation", { degree: "", college: "" });
    }
    if (!formData.keyTeamMembers) formData.keyTeamMembers = [];
    if (!formData.advisors) formData.advisors = [];

    if (typeof formData.founderImage === "string" && formData.founderImage) {
      setFounderImagePreview(formData.founderImage);
    }
  }, [addArrayItem]);

  const validateImage = (file) => {
    if (!file) return true;
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 2 * 1024 * 1024; // 2MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const validate = () => {
    const newErrors = {};

    try {
      const dataToParse = {
        ...formData,
        founderEducation: formData.founderEducation || [],
        keyTeamMembers: formData.keyTeamMembers || [],
        advisors: formData.advisors || [],
      };
      founderTeamSchema.parse(dataToParse);

      if (
        formData.founderImage instanceof File &&
        !validateImage(formData.founderImage)
      ) {
        newErrors.founderImage =
          "Image must be less than 2MB and valid format (JPG, PNG).";
      }

      (formData.keyTeamMembers || []).forEach((member, index) => {
        if (member.image instanceof File && !validateImage(member.image)) {
          newErrors[`keyTeamMembers[${index}].image`] =
            "Image must be less than 2MB and valid format.";
        }
      });

      (formData.advisors || []).forEach((advisor, index) => {
        if (advisor.image instanceof File && !validateImage(advisor.image)) {
          newErrors[`advisors[${index}].image`] =
            "Image must be less than 2MB and valid format.";
        }
      });
    } catch (err) {
      if (err.errors) {
        err.errors.forEach((e) => {
          const path = e.path.join(".");
          newErrors[path] = e.message;
        });
      }
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    if (hasSubmitAttempt) {
      validate();
    }
  }, [formData, hasSubmitAttempt]);

  const handleNextButton = () => {
    setHasSubmitAttempt(true);
    if (validate()) {
      handleNext();
    }
  };

  const handleLocalImageChange = (e, arrayName, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const errorKey = arrayName
      ? `${arrayName}[${index}].image`
      : "founderImage";

    if (!validateImage(file)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [errorKey]: "Invalid image file (check size/type).",
      }));
      return;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: null }));

    if (arrayName) {
      handleArrayFileChange(arrayName, index, "image", file);
    } else {
      handleFileChange("founderImage", file);
      setFounderImagePreview(URL.createObjectURL(file));
    }
  };

  const addEducation = () =>
    addArrayItem("founderEducation", { degree: "", college: "" });
  const removeEducation = (index) => removeArrayItem("founderEducation", index);
  const handleEducationChange = (index, field, value) =>
    handleArrayChange("founderEducation", index, field, value);

  const addTeamMember = () =>
    addArrayItem("keyTeamMembers", {
      name: "",
      role: "",
      experience: "",
      image: null,
    });
  const deleteTeamMember = (index) => removeArrayItem("keyTeamMembers", index);

  const addAdvisor = () =>
    addArrayItem("advisors", {
      name: "",
      expertise: "",
      affiliation: "",
      image: null,
    });
  const deleteAdvisor = (index) => removeArrayItem("advisors", index);

  return (
    <div className="space-y-8 p-8">
      {/* Founder Details Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Founder Name",
              name: "founderName",
              icon: UserIcon,
              required: true,
              placeholder: "Enter full name",
            },
            {
              label: "Founder Email",
              name: "founderEmail",
              icon: EnvelopeIcon,
              required: true,
              placeholder: "Enter email address",
            },
            {
              label: "Founder Phone",
              name: "founderPhone",
              icon: PhoneIcon,
              required: true,
              placeholder: "Enter phone number",
            },
            {
              label: "Founder LinkedIn",
              name: "founderLinkedIn",
              icon: LinkIcon,
              required: true,
              placeholder: "Enter LinkedIn URL",
            },
          ].map(({ label, name, icon: Icon, required, placeholder }) => (
            <div key={name} className="space-y-2">
              <label className="block font-medium">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={name === "founderEmail" ? "email" : "text"}
                name={name}
                value={formData[name] || ""}
                onChange={(e) => handleInputChange(null, name, e.target.value)}
                className={`w-full p-3 placeholder-gray-400 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                  hasSubmitAttempt && errors[name]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={placeholder}
                required={required}
              />
              {hasSubmitAttempt && errors[name] && (
                <p className="text-sm text-red-600">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Founder Image Upload with Preview */}
        <div className="space-y-2">
          <label className="block font-medium">
            Founder Image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center justify-center w-full">
            {founderImagePreview || formData.founderImage ? (
              <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={
                    founderImagePreview ||
                    (formData.founderImage instanceof File
                      ? URL.createObjectURL(formData.founderImage)
                      : formData.founderImage)
                  }
                  alt="Founder"
                  className="w-[15%] h-[95%] flex justify-center mx-auto rounded-full items-center  align-middle my-auto"
                />

                <button
                  type="button"
                  onClick={() => {
                    handleInputChange("founderImage", null);
                    setFounderImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG, or GIF (MAX 2MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLocalImageChange(e, null, null)}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {hasSubmitAttempt && errors.founderImage && (
            <p className="text-sm text-red-600">{errors.founderImage}</p>
          )}
        </div>

        {/* Founder Education - Now as array of objects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Education</h3>
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm"
            >
              <PlusIcon className="h-4 w-4" />
              Add Education
            </button>
          </div>

          {formData.founderEducation &&
            formData.founderEducation.map((edu, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative"
              >
                <div className="space-y-2">
                  <label className="block font-medium">
                    Degree/Qualification
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g. Bachelor of Science, MBA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-medium">
                    Institution/College
                  </label>
                  <input
                    type="text"
                    value={edu.college || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "college", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g. Harvard University"
                  />
                </div>
                {index > 0 && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="md:col-span-2 inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200 text-sm self-start"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                )}
              </div>
            ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[
            {
              label: "Founder Bio",
              name: "founderBio",
              icon: UserIcon,
              placeholder:
                "Brief description of the founder's background and expertise",
            },
            {
              label: "Founder Experience",
              name: "founderExperience",
              icon: BriefcaseIcon,
              placeholder:
                "Professional experience, previous roles, and accomplishments",
            },
            {
              label: "Founder Achievements",
              name: "founderAchievements",
              icon: StarIcon,
              placeholder: "Notable achievements, awards, recognitions, etc.",
            },
          ].map(({ label, name, icon: Icon, placeholder }) => (
            <div key={name} className="space-y-2">
              <label className="block font-medium">{label}</label>
              <textarea
                name={name}
                value={formData[name] || ""}
                onChange={(e) => handleInputChange(null, name, e.target.value)}
                className="w-full p-4 border border-gray-300 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 min-h-[100px]"
                placeholder={placeholder}
              />
              {hasSubmitAttempt && errors[name] && (
                <p className="text-sm text-red-600">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block font-medium">
            Team Size <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="teamSize"
            value={formData.teamSize || ""}
            onChange={(e) =>
              handleInputChange(null, "teamSize", e.target.value)
            }
            min="1"
            className={`placeholder-gray-500 block w-full rounded-lg border focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
              hasSubmitAttempt && errors.teamSize
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter total team size"
            required
          />
          {hasSubmitAttempt && errors.teamSize && (
            <p className="text-sm text-red-600 mt-1">{errors.teamSize}</p>
          )}
        </div>

        {/* Team Members Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Key Team Members
            </h3>
            <button
              type="button"
              onClick={addTeamMember}
              className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm"
            >
              <PlusIcon className="h-4 w-4" />
              Add Team Member
            </button>
          </div>

          <div className="space-y-4">
            {(formData.keyTeamMembers || []).map((member, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg space-y-4 bg-gray-50 relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block font-medium text-sm">Name</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={member.name || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "keyTeamMembers",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-medium text-sm">Role</label>
                    <input
                      type="text"
                      placeholder="Job Title/Position"
                      value={member.role || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "keyTeamMembers",
                          index,
                          "role",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-medium text-sm">
                      Experience
                    </label>
                    <input
                      type="text"
                      placeholder="Years of Experience/Background"
                      value={member.experience || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "keyTeamMembers",
                          index,
                          "experience",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block font-medium text-sm">
                    Team Member Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleLocalImageChange(e, "keyTeamMembers", index)
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UploadIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    {member.image && (
                      <span className="ml-2 text-xs text-gray-500 truncate">
                        {member.image instanceof File
                          ? member.image.name
                          : "Uploaded Image"}
                      </span>
                    )}
                  </div>
                  {hasSubmitAttempt &&
                    errors[`keyTeamMembers[${index}].image`] && (
                      <p className="text-sm text-red-600">
                        {errors[`keyTeamMembers[${index}].image`]}
                      </p>
                    )}
                </div>
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => deleteTeamMember(index)}
                    className="absolute top-2 right-2 p-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advisors Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Advisors</h3>
          <button
            type="button"
            onClick={addAdvisor}
            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add Advisor
          </button>
        </div>

        <div className="space-y-4">
          {(formData.advisors || []).map((advisor, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg space-y-4 bg-gray-50 relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block font-medium text-sm">Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={advisor.name || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "advisors",
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-medium text-sm">Expertise</label>
                  <input
                    type="text"
                    placeholder="Area of Expertise"
                    value={advisor.expertise || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "advisors",
                        index,
                        "expertise",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-medium text-sm">
                    Affiliation
                  </label>
                  <input
                    type="text"
                    placeholder="Company/Organization"
                    value={advisor.affiliation || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "advisors",
                        index,
                        "affiliation",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-sm">
                  Advisor Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleLocalImageChange(e, "advisors", index)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UploadIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  {advisor.image && (
                    <span className="ml-2 text-xs text-gray-500 truncate">
                      {advisor.image instanceof File
                        ? advisor.image.name
                        : "Uploaded Image"}
                    </span>
                  )}
                </div>
                {hasSubmitAttempt && errors[`advisors[${index}].image`] && (
                  <p className="text-sm text-red-600">
                    {errors[`advisors[${index}].image`]}
                  </p>
                )}
              </div>
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => deleteAdvisor(index)}
                  className="absolute top-2 right-2 p-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {currentStep < stepsLength && (
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Previous
            </button>
          )}
          <button
            type="button"
            onClick={handleNextButton}
            className={`ml-auto inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-sm hover:shadow transition-all duration-200`}
          >
            Next Step
          </button>
        </div>
      )}
    </div>
  );
};

export default FounderTeam;
