import React, { useState, useEffect } from "react";
import {
  Users,
  User,
  UserPlus,
  Trash2,
  UploadIcon,
  UserCog,
  Award,
} from "lucide-react";
// Import the shared helper components
import { FormInput, FormTextarea } from "./FormHelpers";

// Reusable component for Key Team Member
const TeamMemberItem = ({
  member,
  index,
  handleTeamMemberChange,
  removeTeamMember,
  handleArrayFileChange,
  errors,
  setErrors,
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (member?.image instanceof File) {
      const objectUrl = URL.createObjectURL(member.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof member?.image === "string" && member?.image) {
      setPreview(member.image);
    } else {
      setPreview(null);
    }
  }, [member?.image]);

  const validateImage = (file) => {
    if (!file || typeof file === "string") return { isValid: true };
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const maxSize = 1 * 1024 * 1024; // 1MB for team members
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        message: "Invalid type (JPG, PNG, GIF, WEBP, SVG).",
      };
    }
    if (file.size > maxSize) {
      return { isValid: false, message: "Max 1MB size exceeded." };
    }
    return { isValid: true };
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImage(file);
    const errorKey = `keyTeamMembers.${index}.image`;
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, [errorKey]: validation.message }));
      handleArrayFileChange("keyTeamMembers", index, "image", null);
      return;
    }

    setErrors((prev) => ({ ...prev, [errorKey]: null }));
    handleArrayFileChange("keyTeamMembers", index, "image", file);
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 relative">
      <button
        type="button"
        onClick={() => removeTeamMember(index)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1"
        aria-label="Remove team member"
      >
        <Trash2 size={16} />
      </button>

      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="flex flex-col items-center space-y-1">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt={`${member?.name || "Team member"} photo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users size={24} className="text-gray-400" />
            )}
          </div>
          <label
            htmlFor={`teamMemberImage-${index}`}
            className="cursor-pointer mt-1 text-xs text-orange-600 hover:underline"
          >
            Upload Photo
          </label>
          <input
            id={`teamMemberImage-${index}`}
            name={`teamMemberImage-${index}`}
            type="file"
            onChange={onImageChange}
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            className="sr-only"
          />
          {errors?.[`keyTeamMembers.${index}.image`] && (
            <p className="mt-1 text-xs text-red-600 text-center w-full">
              {errors[`keyTeamMembers.${index}.image`]}
            </p>
          )}
          <p className="text-xs text-gray-500">(Max 1MB)</p>
        </div>

        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          <FormInput
            label="Name"
            id={`name-${index}`}
            value={member?.name || ""}
            onChange={(section, field, value) =>
              handleTeamMemberChange(index, "name", value)
            }
            placeholder="Team Member Name"
            error={errors?.[`keyTeamMembers[${index}].name`]}
            section="keyTeamMembers"
            field="name"
          />
          <FormInput
            label="Role / Position"
            id={`role-${index}`}
            value={member?.role || ""}
            onChange={(section, field, value) =>
              handleTeamMemberChange(index, "role", value)
            }
            placeholder="e.g., CTO, Lead Developer"
            error={errors?.[`keyTeamMembers[${index}].role`]}
            section="keyTeamMembers"
            field="role"
          />
          <div className="sm:col-span-2">
            <FormTextarea
              label="Experience / Bio (Optional)"
              id={`experience-${index}`}
              value={member?.experience || ""}
              onChange={(section, field, value) =>
                handleTeamMemberChange(index, "experience", value)
              }
              placeholder="Brief description of their background, expertise, or achievements"
              rows={3}
              maxLength={300}
              error={errors?.[`keyTeamMembers[${index}].experience`]}
              section="keyTeamMembers"
              field="experience"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable component for Advisor
const AdvisorItem = ({
  advisor,
  index,
  handleAdvisorChange,
  removeAdvisor,
  handleArrayFileChange,
  errors,
  setErrors,
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (advisor?.image instanceof File) {
      const objectUrl = URL.createObjectURL(advisor.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof advisor?.image === "string" && advisor?.image) {
      setPreview(advisor.image);
    } else {
      setPreview(null);
    }
  }, [advisor?.image]);

  const validateImage = (file) => {
    if (!file || typeof file === "string") return { isValid: true };
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const maxSize = 1 * 1024 * 1024; // 1MB for advisors
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        message: "Invalid type (JPG, PNG, GIF, WEBP, SVG).",
      };
    }
    if (file.size > maxSize) {
      return { isValid: false, message: "Max 1MB size exceeded." };
    }
    return { isValid: true };
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImage(file);
    const errorKey = `advisors.${index}.image`;
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, [errorKey]: validation.message }));
      handleArrayFileChange("advisors", index, "image", null);
      return;
    }

    setErrors((prev) => ({ ...prev, [errorKey]: null }));
    handleArrayFileChange("advisors", index, "image", file);
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 relative">
      <button
        type="button"
        onClick={() => removeAdvisor(index)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1"
        aria-label="Remove advisor"
      >
        <Trash2 size={16} />
      </button>

      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="flex flex-col items-center space-y-1">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt={`${advisor?.name || "Advisor"} photo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Award size={20} className="text-gray-400" />
            )}
          </div>
          <label
            htmlFor={`advisorImage-${index}`}
            className="cursor-pointer mt-1 text-xs text-orange-600 hover:underline"
          >
            Upload Photo
          </label>
          <input
            id={`advisorImage-${index}`}
            name={`advisorImage-${index}`}
            type="file"
            onChange={onImageChange}
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            className="sr-only"
          />
          {errors?.[`advisors.${index}.image`] && (
            <p className="mt-1 text-xs text-red-600 text-center w-full">
              {errors[`advisors.${index}.image`]}
            </p>
          )}
          <p className="text-xs text-gray-500">(Max 1MB)</p>
        </div>

        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          <FormInput
            label="Name"
            id={`advisor-name-${index}`}
            value={advisor?.name || ""}
            onChange={(section, field, value) =>
              handleAdvisorChange(index, "name", value)
            }
            placeholder="Advisor Name"
            error={errors?.[`advisors[${index}].name`]}
            section="advisors"
            field="name"
          />
          <FormInput
            label="Area of Expertise"
            id={`advisor-expertise-${index}`}
            value={advisor?.expertise || ""}
            onChange={(section, field, value) =>
              handleAdvisorChange(index, "expertise", value)
            }
            placeholder="e.g., Marketing, Finance"
            error={errors?.[`advisors[${index}].expertise`]}
            section="advisors"
            field="expertise"
          />
          <div className="sm:col-span-2">
            <FormInput
              label="Affiliation / Company (Optional)"
              id={`advisor-affiliation-${index}`}
              value={advisor?.affiliation || ""}
              onChange={(section, field, value) =>
                handleAdvisorChange(index, "affiliation", value)
              }
              placeholder="e.g., Angel Investor, VC Firm"
              error={errors?.[`advisors[${index}].affiliation`]}
              section="advisors"
              field="affiliation"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamInfo = ({
  formData,
  handleInputChange,
  handleArrayFileChange,
  addArrayItem,
  removeArrayItem,
  handleTeamMemberChange,
  addTeamMember,
  removeTeamMember,
  handleAdvisorChange,
  addAdvisor,
  removeAdvisor,
  errors,
  setErrors,
}) => {
  return (
    <div className="space-y-6 bg-white rounded-lg shadow">
      <div className="p-6">
        <div>
          <FormInput
            label="Current Team Size"
            id="teamSize"
            type="number"
            value={formData.teamSize}
            onChange={handleInputChange}
            placeholder="Number of full-time employees"
            error={errors?.teamSize}
            required
            min="1"
            icon={Users}
            field="teamSize"
          />
        </div>

        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-medium text-gray-700">
            Key Team Members
          </h3>
          {Array.isArray(formData.keyTeamMembers) &&
            formData.keyTeamMembers.map((member, index) => (
              <TeamMemberItem
                key={index}
                member={member}
                index={index}
                handleTeamMemberChange={handleTeamMemberChange}
                removeTeamMember={removeTeamMember}
                handleArrayFileChange={handleArrayFileChange}
                errors={errors}
                setErrors={setErrors}
              />
            ))}
          <button
            type="button"
            onClick={addTeamMember}
            className="flex items-center space-x-2 px-3 py-1.5 border border-dashed border-gray-400 rounded-md text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
          >
            <UserPlus size={16} />
            <span>Add Team Member</span>
          </button>
        </div>

        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-medium text-gray-700">
            Advisors (Optional)
          </h3>
          {Array.isArray(formData.advisors) &&
            formData.advisors.map((advisor, index) => (
              <AdvisorItem
                key={index}
                advisor={advisor}
                index={index}
                handleAdvisorChange={handleAdvisorChange}
                removeAdvisor={removeAdvisor}
                handleArrayFileChange={handleArrayFileChange}
                errors={errors}
                setErrors={setErrors}
              />
            ))}
          <button
            type="button"
            onClick={addAdvisor}
            className="flex items-center space-x-2 px-3 py-1.5 border border-dashed border-gray-400 rounded-md text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
          >
            <UserCog size={16} />
            <span>Add Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamInfo;
