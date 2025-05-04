/* eslint-disable react/prop-types */
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Briefcase,
  Target,
  Lightbulb,
  Settings,
  Tag,
  BarChart2,
  Share2,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
// Import the shared helper components
import { FormInput, FormTextarea } from "./FormHelpers";

// Define Zod schema for validation
const businessDetailsSchema = z.object({
  description: z
    .string()
    .min(1, "Company description is required")
    .max(500, "Description must be 500 characters or less"),
  businessModel: z
    .string()
    .min(1, "Business model is required")
    .max(500, "Business model must be 500 characters or less"),
  revenueModel: z
    .string()
    .min(1, "Revenue model is required")
    .max(500, "Revenue model must be 500 characters or less"),
  pricingStrategy: z
    .string()
    .min(1, "Pricing strategy is required")
    .max(500, "Pricing strategy must be 500 characters or less"),
  competitiveAdvantage: z
    .string()
    .min(1, "Competitive advantage is required")
    .max(500, "Competitive advantage must be 500 characters or less"),
  uniqueValue: z
    .string()
    .min(1, "Unique value proposition is required")
    .max(500, "Unique value proposition must be 500 characters or less"),
  salesStrategy: z
    .string()
    .min(1, "Sales strategy is required")
    .max(500, "Sales strategy must be 500 characters or less"),
  marketingStrategy: z
    .string()
    .min(1, "Marketing strategy is required")
    .max(500, "Marketing strategy must be 500 characters or less"),
  channelStrategy: z
    .string()
    .min(1, "Channel strategy is required")
    .max(500, "Channel strategy must be 500 characters or less"),
  customerSuccess: z
    .string()
    .min(1, "Customer success strategy is required")
    .max(500, "Customer success strategy must be 500 characters or less"),
  // keyFeatures: z
  //   .array(z.string().max(100, "Key feature must be less than 100 characters"))
  //   .max(5, "Maximum 5 key features allowed"),
  // technologyStack: z
  //   .array(
  //     z
  //       .string()
  //       .max(100, "Technology stack item must be less than 100 characters")
  //   )
  //   .max(5, "Maximum 5 technology stack items allowed"),
});

// --- Reusable Helper Components (Assume consistent styling) ---
// ... (definitions previously here from lines ~70 to ~190) ...

// Reusable component for Key Feature / Tech Stack Item
const ListItemInput = ({
  items,
  index,
  handleItemChange,
  removeItem,
  placeholder,
  error,
  fieldName,
  sectionName,
}) => (
  <div className="flex items-center space-x-2 mb-2">
    <input
      type="text"
      value={items[index] || ""}
      onChange={(e) => handleItemChange(index, e.target.value)} // Simplified handler call
      placeholder={placeholder}
      maxLength={100} // Add length limit if needed
      className={`flex-grow px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
    />
    <button
      type="button"
      onClick={() => removeItem(index)}
      className="text-gray-400 hover:text-red-600 p-1"
      aria-label={`Remove ${fieldName}`}
    >
      <Trash2 size={16} />
    </button>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);
// -------------------------------------

const BusinessDetails = ({
  formData,
  handleInputChange, // Generic handler for simple fields
  handleArrayChange, // Generic handler for arrays
  addArrayItem,
  removeArrayItem,
  errors,
}) => {
  // --- Remove Specific Handlers for Key Features (Not needed if handleArrayChange is passed directly) ---
  // const handleKeyFeatureChange = (...) => { ... };
  const addKeyFeature = () => {
    addArrayItem("keyFeatures", ""); // Add empty string for new feature
  };
  const removeKeyFeature = (index) => {
    removeArrayItem("keyFeatures", index);
  };
  // --- End Key Features Handlers ---

  // --- Remove Specific Handlers for Technology Stack ---
  // const handleTechStackChange = (...) => { ... };
  const addTechStack = () => {
    addArrayItem("technologyStack", "");
  };
  const removeTechStack = (index) => {
    removeArrayItem("technologyStack", index);
  };
  // --- End Tech Stack Handlers ---

  return (
    <div className="space-y-6 bg-white rounded-lg shadow">
      <div className="p-6">
        {/* Use FormTextarea/FormInput for fields */}
        <FormTextarea
          label="Detailed Company Description (min 50 characters)"
          id="companyDescription"
          value={formData.companyDescription || ""}
          onChange={(section, field, value) =>
            handleInputChange(null, "companyDescription", value)
          }
          placeholder="Provide a comprehensive description of your company, its mission, and history."
          error={errors?.companyDescription}
          required
          rows={5}
          maxLength={2000}
          minLength={50}
          icon={Briefcase}
          field="companyDescription"
        />

        <FormTextarea
          label="Problem Statement (min 50 characters)"
          id="problemStatement"
          value={formData.problemStatement || ""}
          onChange={(section, field, value) =>
            handleInputChange(null, "problemStatement", value)
          }
          placeholder="Clearly articulate the problem your company solves for its target audience."
          error={errors?.problemStatement}
          required
          rows={4}
          maxLength={1500}
          minLength={50}
          icon={Target}
          field="problemStatement"
        />

        <FormTextarea
          label="Solution Description (min 50 characters)"
          id="solution"
          value={formData.solution || ""}
          onChange={(section, field, value) =>
            handleInputChange(null, "solution", value)
          }
          placeholder="Describe your solution and how it addresses the identified problem."
          error={errors?.solution}
          required
          rows={4}
          maxLength={1500}
          minLength={50}
          icon={Lightbulb}
          field="solution"
        />

        <FormTextarea
          label="Product/Service Details (min 50 characters)"
          id="productServiceDetails"
          value={formData.productServiceDetails || ""}
          onChange={(section, field, value) =>
            handleInputChange(null, "productServiceDetails", value)
          }
          placeholder="Elaborate on your core products or services, including key functionalities."
          error={errors?.productServiceDetails}
          required
          rows={5}
          maxLength={2000}
          minLength={50}
          icon={Settings} // Example icon
          field="productServiceDetails"
        />

        <FormTextarea
          label="Business Model (min 20 characters)"
          id="businessModel"
          value={formData.businessModel || ""}
          onChange={(section, field, value) =>
            handleInputChange(null, "businessModel", value)
          }
          placeholder="Explain how your business creates, delivers, and captures value (e.g., subscription, marketplace, SaaS)."
          error={errors?.businessModel}
          required
          rows={4}
          maxLength={1000}
          minLength={20}
          icon={Share2} // Example icon
          field="businessModel"
        />

        <FormTextarea
          label="Revenue Model (min 20 characters)"
          id="revenueModel"
          value={formData.revenueModel || ""}
          onChange={(section, field, value) =>
            handleInputChange(null, "revenueModel", value)
          }
          placeholder="Describe how your company generates revenue (e.g., pricing tiers, transaction fees, advertising)."
          error={errors?.revenueModel}
          required
          rows={4}
          maxLength={1000}
          minLength={20}
          icon={BarChart2} // Example icon
          field="revenueModel"
        />

        <FormTextarea
          label="Pricing Strategy"
          id="pricingStrategy"
          value={formData.pricingStrategy}
          onChange={handleInputChange}
          placeholder="Outline your pricing structure and strategy."
          error={errors?.pricingStrategy}
          rows={3}
          maxLength={1000}
          icon={Tag} // Example icon
          field="pricingStrategy"
        />

        {/* Key Features List - Use shared FormInput */}
        <div className="space-y-3 pt-4 border-t border-gray-100 mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Key Product Features
          </label>
          {formData.keyFeatures &&
            Array.isArray(formData.keyFeatures) &&
            formData.keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  id={`keyFeature-${index}`}
                  value={feature || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "keyFeatures",
                      index,
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`Feature ${index + 1}`}
                  className={`w-full px-3 py-2 border ${
                    errors?.[`keyFeatures.${index}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  } placeholder:text-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                />
                <button
                  type="button"
                  onClick={() => removeKeyFeature(index)}
                  className="text-gray-400 hover:text-red-600 p-1 mt-1"
                  aria-label={`Remove Feature ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          <button
            type="button"
            onClick={addKeyFeature}
            className="flex items-center space-x-2 px-3 py-1.5 border border-dashed border-gray-400 rounded-md text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
          >
            <Plus size={16} />
            <span>Add Feature</span>
          </button>
        </div>

        {/* Technology Stack List - Use shared FormInput */}
        <div className="space-y-3 pt-4 border-t border-gray-100 mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Technology Stack (Optional)
          </label>
          {formData.technologyStack &&
            Array.isArray(formData.technologyStack) &&
            formData.technologyStack.map((tech, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  id={`techStack-${index}`}
                  value={tech || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "technologyStack",
                      index,
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`Technology ${
                    index + 1
                  } (e.g., React, Node.js, AWS)`}
                  className={`w-full px-3 py-2 border ${
                    errors?.[`technologyStack.${index}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                />
                <button
                  type="button"
                  onClick={() => removeTechStack(index)}
                  className="text-gray-400 hover:text-red-600 p-1 mt-1"
                  aria-label={`Remove Technology ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          <button
            type="button"
            onClick={addTechStack}
            className="flex items-center space-x-2 px-3 py-1.5 border border-dashed border-gray-400 rounded-md text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
          >
            <Plus size={16} />
            <span>Add Technology</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
