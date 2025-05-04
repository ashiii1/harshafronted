import React from "react";
import { Eye, Map, TrendingUp, LogOut } from "lucide-react";
// Import shared helper component
import { FormTextarea } from "./FormHelpers";

const FuturePlansVision = ({
  formData,
  handleInputChange, // Use the standard input handler
  errors,
}) => {
  return (
    <div className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow">
      <FormTextarea
        label="Company Vision Statement"
        id="visionStatement"
        value={formData.visionStatement}
        onChange={handleInputChange}
        placeholder="Describe the long-term vision and ultimate goal of your company."
        error={errors?.visionStatement}
        required
        rows={4}
        maxLength={1000}
        icon={Eye}
        field="visionStatement" // Pass field name
      />

      <FormTextarea
        label="Product Roadmap Overview"
        id="productRoadmap"
        value={formData.productRoadmap}
        onChange={handleInputChange}
        placeholder="Outline the key milestones, features, and timeline for your product development (e.g., next 6-18 months)."
        error={errors?.productRoadmap}
        required
        rows={6}
        maxLength={2000}
        icon={Map}
        field="productRoadmap"
      />

      <FormTextarea
        label="Market Expansion Plans"
        id="marketExpansion"
        value={formData.marketExpansion}
        onChange={handleInputChange}
        placeholder="Describe your strategy for entering new markets, targeting new customer segments, or scaling operations."
        error={errors?.marketExpansion}
        required
        rows={5}
        maxLength={1500}
        icon={TrendingUp}
        field="marketExpansion"
      />

      <FormTextarea
        label="Potential Exit Strategy"
        id="exitStrategy"
        value={formData.exitStrategy}
        onChange={handleInputChange}
        placeholder="Briefly outline potential exit strategies being considered (e.g., acquisition by specific types of companies, IPO)."
        error={errors?.exitStrategy}
        rows={4}
        maxLength={1000}
        icon={LogOut}
        field="exitStrategy"
      />
    </div>
  );
};

export default FuturePlansVision;
