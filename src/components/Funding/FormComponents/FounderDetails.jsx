import React, { useState, useEffect } from "react";
import {
  UserIcon,
  PhoneIcon,
  LinkIcon,
  BriefcaseIcon,
  StarIcon,
  PlusIcon,
  Trash2,
  UploadIcon,
} from "lucide-react";
import { AcademicCapIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

// Helper Input Component (Reusing from BasicInfo for consistency)
const FormInput = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon: Icon,
  section = null,
  index = null,
  field = null,
  ...props
}) => (
  <div>
    <label
      htmlFor={id}
      className={`block text-sm font-medium text-gray-700 mb-1 ${
        error ? "text-red-600" : ""
      }`}
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      )}
      <input
        type={type}
        id={id}
        name={field || id}
        value={value || ""}
        onChange={(e) => onChange(section, field || id, e.target.value, index)}
        placeholder={placeholder}
        required={required}
        className={`block w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder:text-gray-500 ${
          Icon ? "pl-10" : ""
        }`}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// Helper Textarea Component
const FormTextarea = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rows = 4,
  maxLength = 500,
  icon: Icon,
  section = null,
  index = null,
  field = null,
}) => {
  const currentLength = value?.length || 0;
  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium text-gray-700 mb-1 ${
          error ? "text-red-600" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute top-3 left-3">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <textarea
          id={id}
          name={field || id}
          rows={rows}
          value={value || ""}
          onChange={(e) =>
            onChange(section, field || id, e.target.value, index)
          }
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={`block w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder:text-gray-500 ${
            Icon ? "pl-10 pt-2" : ""
          }`}
        />
      </div>
      <div className="flex justify-between">
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {maxLength && (
          <p
            className={`mt-1 text-xs ${
              currentLength > maxLength - 50
                ? "text-orange-600"
                : "text-gray-500"
            } ml-auto`}
          >
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

// Reusable component for Education Item
const EducationItem = ({
  item,
  index,
  handleEducationChange,
  removeEducation,
  errors,
}) => (
  <div className="p-4 border border-gray-200 rounded-md mb-3 relative space-y-3">
    <button
      type="button"
      onClick={() => removeEducation(index)}
      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors p-1"
      aria-label="Remove education item"
    >
      <Trash2 size={16} />
    </button>
    <FormInput
      label="Degree / Qualification"
      id={`degree-${index}`}
      value={item?.degree || ""}
      onChange={(section, field, value) =>
        handleEducationChange(index, "degree", value)
      }
      placeholder="e.g., BSc Computer Science"
      error={errors?.[`founderEducation[${index}].degree`]}
      icon={AcademicCapIcon}
      section="founderEducation"
      field="degree"
    />
    <FormInput
      label="College / University"
      id={`college-${index}`}
      value={item?.college || ""}
      onChange={(section, field, value) =>
        handleEducationChange(index, "college", value)
      }
      placeholder="e.g., Stanford University"
      error={errors?.[`founderEducation[${index}].college`]}
      icon={BriefcaseIcon}
      section="founderEducation"
      field="college"
    />
  </div>
);

const FounderDetails = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
  errors,
  setErrors,
}) => {
  const [founderImagePreview, setFounderImagePreview] = useState(null);

  useEffect(() => {
    if (formData.founderImage instanceof File) {
      const objectUrl = URL.createObjectURL(formData.founderImage);
      setFounderImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof formData.founderImage === "string") {
      setFounderImagePreview(formData.founderImage);
    } else {
      setFounderImagePreview(null);
    }
  }, [formData.founderImage]);

  const validateImage = (file) => {
    if (!file || typeof file === "string") return { isValid: true }; // Allow existing URLs
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        message: "Invalid image type. Use JPG, PNG, GIF, WEBP, or SVG.",
      };
    }
    if (file.size > maxSize) {
      return { isValid: false, message: "Image size exceeds 2MB limit." };
    }
    return { isValid: true };
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, founderImage: validation.message }));
      handleFileChange("founderImage", null);
      return;
    }

    setErrors((prev) => ({ ...prev, founderImage: null }));
    handleFileChange("founderImage", file);
  };

  const { addEducation, removeEducation, handleEducationChange } = {
    addEducation: () =>
      addArrayItem("founderEducation", { degree: "", college: "" }),
    removeEducation: (index) => removeArrayItem("founderEducation", index),
    handleEducationChange: (index, field, value) => {
      console.log(
        `Updating education: index=${index}, field=${field}, value=${value}`
      );
      handleArrayChange("founderEducation", index, field, value);
    },
  };

  return (
    <div className="space-y-6 bg-white rounded-lg shadow">
      {/* Founder Image Upload */}
      <div className="p-6">
        <div className="flex flex-col items-center space-y-2">
          <label className="block text-sm font-medium text-gray-700 self-start md:text-center w-full mb-2">
            Founder Photo
          </label>
          <div className="flex items-center space-x-4">
            {founderImagePreview ? (
              <img
                src={founderImagePreview}
                alt="Founder Preview"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <UserIcon className="h-12 w-12" />
              </div>
            )}
            <label
              htmlFor="founderImage"
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <UploadIcon size={16} />
              <span>Upload Photo</span>
            </label>
            <input
              id="founderImage"
              name="founderImage"
              type="file"
              onChange={onImageChange}
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              className="sr-only"
            />
          </div>
          {errors?.founderImage && (
            <p className="mt-1 text-xs text-red-600 text-center w-full">
              {errors.founderImage}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG, GIF, etc. (Max 2MB)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-6">
          <FormInput
            label="Founder Full Name"
            id="founderName"
            value={formData.founderName}
            onChange={handleInputChange}
            placeholder="e.g., Jane Doe"
            error={errors?.founderName}
            required
            icon={UserIcon}
            field="founderName"
          />
          <FormInput
            label="Founder Email"
            id="founderEmail"
            type="email"
            value={formData.founderEmail}
            onChange={handleInputChange}
            placeholder="e.g., jane.doe@example.com"
            error={errors?.founderEmail}
            required
            icon={EnvelopeIcon}
            field="founderEmail"
          />
          <FormInput
            label="Founder Phone"
            id="founderPhone"
            type="tel"
            value={formData.founderPhone}
            onChange={handleInputChange}
            placeholder="e.g., +1 123 456 7890"
            error={errors?.founderPhone}
            icon={PhoneIcon}
            field="founderPhone"
          />
          <FormInput
            label="Founder LinkedIn Profile URL"
            id="founderLinkedIn"
            type="url"
            value={formData.founderLinkedIn}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/janedoe"
            error={errors?.founderLinkedIn}
            icon={LinkIcon}
            field="founderLinkedIn"
          />

          {/* Bio Textarea - Spanning full width on small screens, half on medium+ */}
          <div className="md:col-span-2">
            <FormTextarea
              label="Founder Bio"
              id="founderBio"
              value={formData.founderBio}
              onChange={handleInputChange}
              placeholder="Brief background about the founder (max 1000 characters)"
              error={errors?.founderBio}
              rows={5}
              maxLength={1000}
              field="founderBio"
            />
          </div>

          {/* Experience Textarea */}
          <div className="md:col-span-2">
            <FormTextarea
              label="Founder Relevant Experience"
              id="founderExperience"
              value={formData.founderExperience}
              onChange={handleInputChange}
              placeholder="Highlight key roles, accomplishments, and industry expertise (max 1500 characters)"
              error={errors?.founderExperience}
              rows={6}
              maxLength={1500}
              field="founderExperience"
            />
          </div>

          {/* Achievements Textarea */}
          <div className="md:col-span-2">
            <FormTextarea
              label="Founder Key Achievements / Awards"
              id="founderAchievements"
              value={formData.founderAchievements}
              onChange={handleInputChange}
              placeholder="List notable achievements, awards, or recognitions (max 1000 characters)"
              error={errors?.founderAchievements}
              rows={4}
              maxLength={1000}
              field="founderAchievements"
            />
          </div>

          {/* Education Section - Spanning full width */}
          <div className="md:col-span-2 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Founder Education
            </label>
            {formData.founderEducation &&
              Array.isArray(formData.founderEducation) &&
              formData.founderEducation.map((item, index) => (
                <EducationItem
                  key={index}
                  item={item}
                  index={index}
                  handleEducationChange={handleEducationChange}
                  removeEducation={removeEducation}
                  errors={errors}
                />
              ))}
            <button
              type="button"
              onClick={addEducation}
              className="flex items-center space-x-2 px-3 py-1.5 border border-dashed border-gray-400 rounded-md text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              <PlusIcon size={16} />
              <span>Add Education</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderDetails;
