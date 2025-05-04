import React, { useState } from "react";
import {
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
// Import shared helper component
import { FormInput } from "./FormHelpers";

// --- Remove Reusable Helper Components defined locally ---
// const FormInput = (...) => { ... };

// Reusable component for Press Mention Item
const PressMentionItem = ({
  item,
  index,
  handlePressMentionChange,
  removePressMention,
  errors,
}) => (
  <div className="p-4 border border-gray-200 rounded-md mb-3 relative space-y-3 bg-gray-50/50">
    <button
      type="button"
      onClick={() => removePressMention(index)}
      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors p-1"
      aria-label="Remove press mention"
    >
      <Trash2 size={16} />
    </button>
    <FormInput
      label="Mention Title / Headline"
      id={`pressMentionTitle-${index}`}
      value={item?.title || ""}
      onChange={(section, idx, field, value) =>
        handlePressMentionChange(index, "title", value)
      }
      placeholder="e.g., Innov8Mate featured in TechCrunch"
      error={
        errors?.[`pressMentions[${index}].title`] ||
        errors?.[`pressMentions.${index}.title`]
      }
      section="pressMentions"
      index={index}
      field="title"
    />
    <FormInput
      label="Link to Article / Mention"
      id={`pressMentionUrl-${index}`}
      type="url"
      value={item?.url || ""}
      onChange={(section, idx, field, value) =>
        handlePressMentionChange(index, "url", value)
      }
      placeholder="https://example.com/article"
      error={
        errors?.[`pressMentions[${index}].url`] ||
        errors?.[`pressMentions.${index}.url`]
      }
      icon={ExternalLink}
      section="pressMentions"
      index={index}
      field="url"
    />
  </div>
);

const DigitalPresence = ({
  formData,
  handleInputChange, // For top-level fields like 'website'
  handleNestedChange, // For nested objects like 'socialMedia'
  handleArrayChange, // For arrays like 'pressMentions'
  addArrayItem,
  removeArrayItem,
  errors,
}) => {
  // --- Handlers for Press Mentions Array ---
  const handlePressMentionChange = (index, field, value) => {
    handleArrayChange("pressMentions", index, field, value);
  };

  const addPressMention = () => {
    addArrayItem("pressMentions", { title: "", url: "" });
  };

  const removePressMention = (index) => {
    removeArrayItem("pressMentions", index);
  };
  // --- End Press Mentions Handlers ---

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow">
      {/* Website URL */}
      <FormInput
        label="Company Website URL"
        id="website"
        type="url"
        value={formData.website || ""}
        onChange={handleInputChange} // Use standard handler
        placeholder="https://your-company.com"
        error={errors?.website}
        required
        icon={Globe}
      />

      {/* Social Media Links */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-700">
          Social Media Profiles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormInput
            label="LinkedIn Company Page URL"
            id="linkedin"
            type="url"
            value={formData.socialMedia?.linkedin || ""}
            onChange={(section, index, field, value) =>
              handleNestedChange("socialMedia", "linkedin", value)
            }
            placeholder="https://linkedin.com/company/your-company"
            error={
              errors?.["socialMedia.linkedin"] ||
              errors?.["socialMedia"]?.linkedin
            }
            icon={Linkedin}
            section="socialMedia"
            field="linkedin"
          />
          <FormInput
            label="Twitter Profile URL"
            id="twitter"
            type="url"
            value={formData.socialMedia?.twitter || ""}
            onChange={(section, index, field, value) =>
              handleNestedChange("socialMedia", "twitter", value)
            }
            placeholder="https://twitter.com/your-company"
            error={
              errors?.["socialMedia.twitter"] ||
              errors?.["socialMedia"]?.twitter
            }
            icon={Twitter}
            section="socialMedia"
            field="twitter"
          />
          <FormInput
            label="Facebook Page URL"
            id="facebook"
            type="url"
            value={formData.socialMedia?.facebook || ""}
            onChange={(section, index, field, value) =>
              handleNestedChange("socialMedia", "facebook", value)
            }
            placeholder="https://facebook.com/your-company"
            error={
              errors?.["socialMedia.facebook"] ||
              errors?.["socialMedia"]?.facebook
            }
            icon={Facebook}
            section="socialMedia"
            field="facebook"
          />
          <FormInput
            label="Instagram Profile URL"
            id="instagram"
            type="url"
            value={formData.socialMedia?.instagram || ""}
            onChange={(section, index, field, value) =>
              handleNestedChange("socialMedia", "instagram", value)
            }
            placeholder="https://instagram.com/your-company"
            error={
              errors?.["socialMedia.instagram"] ||
              errors?.["socialMedia"]?.instagram
            }
            icon={Instagram}
            section="socialMedia"
            field="instagram"
          />
          {/* Add other platforms if needed */}
          {/* Example: GitHub */}
          {/* <FormInput
                         label="GitHub Organization URL"
                         id="github"
                         type="url"
                         value={formData.socialMedia?.github}
                         onChange={handleNestedChange}
                         placeholder="https://github.com/your-org"
                         error={errors?.['socialMedia.github']}
                         icon={GitHubIcon} // Assuming you import a GitHub icon
                         section="socialMedia"
                         field="github"
                     /> */}
        </div>
      </div>

      {/* Press Mentions Section */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-700">
          Press Mentions / News
        </h3>
        {formData.pressMentions &&
          formData.pressMentions.map((item, index) => (
            <PressMentionItem
              key={index}
              item={item}
              index={index}
              handlePressMentionChange={handlePressMentionChange}
              removePressMention={removePressMention}
              errors={errors}
            />
          ))}
        <button
          type="button"
          onClick={addPressMention}
          className="flex items-center space-x-2 px-3 py-1.5 border border-dashed border-gray-400 rounded-md text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
        >
          <Plus size={16} />
          <span>Add Press Mention</span>
        </button>
      </div>
    </div>
  );
};

export default DigitalPresence;
