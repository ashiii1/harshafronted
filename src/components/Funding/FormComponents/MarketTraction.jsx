/* eslint-disable react/prop-types */
import React from "react";
import {
  Target,
  TrendingUp,
  Users,
  Star,
  BarChartHorizontal,
  Info,
  DollarSign,
  Percent,
  UserCheck,
  UserX,
  Layers3,
  Award,
  Shield,
} from "lucide-react";
// Removed unused imports: FaUsers, FaBullhorn, FaAward, useEffect, useState, z
// Import the shared helper components
import { FormInput, FormTextarea } from "./FormHelpers";

// Simple tooltip component (optional)
const Tooltip = ({ text, children }) => (
  <span className="relative group">
    {children}
    <span className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10 whitespace-nowrap">
      {text}
    </span>
  </span>
);

const MarketTraction = ({
  formData,
  handleInputChange,
  handleNestedChange,
  errors,
}) => {
  // Access nested data safely - ensure these are objects
  const marketSize = formData.marketSize || {};
  const tractionMetrics = formData.tractionMetrics || {};

  return (
    <div className="space-y-6 bg-white rounded-lg shadow">
      <div className="p-6">
        <FormTextarea
          label="Target Market Description"
          id="targetMarket"
          value={formData.targetMarket}
          onChange={handleInputChange}
          placeholder="Describe your ideal customer profile, market segment, and geographical focus."
          error={errors?.targetMarket}
          required
          rows={4}
          maxLength={1500}
          icon={Target}
          field="targetMarket" // Top-level field
        />

        {/* Market Size Inputs */}
        <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50/50 mt-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center">
            <Layers3 className="w-5 h-5 mr-2 text-orange-600" />
            Market Size
            <Tooltip text="TAM: Total Addressable Market. SAM: Serviceable Addressable Market you can reach. SOM: Serviceable Obtainable Market you can realistically capture short-term.">
              <Info className="w-4 h-4 ml-2 text-gray-400 cursor-help" />
            </Tooltip>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="TAM ($)"
              id="marketSize.tam"
              type="text" // Keep as text to allow formatting like $50B
              value={marketSize.tam || ""}
              onChange={(section, field, value) =>
                handleNestedChange("marketSize", "tam", value)
              }
              placeholder="e.g., $50B"
              error={errors?.["marketSize.tam"]} // Nested error key
              section="marketSize" // Specify section for nested update
              field="tam"
            />
            <FormInput
              label="SAM ($)"
              id="marketSize.sam"
              type="text"
              value={marketSize.sam || ""}
              onChange={(section, field, value) =>
                handleNestedChange("marketSize", "sam", value)
              }
              placeholder="e.g., $15B"
              error={errors?.["marketSize.sam"]}
              section="marketSize"
              field="sam"
            />
            <FormInput
              label="SOM ($)"
              id="marketSize.som"
              type="text"
              value={marketSize.som || ""}
              onChange={(section, field, value) =>
                handleNestedChange("marketSize", "som", value)
              }
              placeholder="e.g., $2B"
              error={errors?.["marketSize.som"]}
              section="marketSize"
              field="som"
            />
          </div>
        </div>

        <FormTextarea
          label="Customer Acquisition Strategy"
          id="customerAcquisition"
          value={formData.customerAcquisition}
          onChange={handleInputChange}
          placeholder="Explain your primary strategies for acquiring customers (e.g., digital marketing, sales team, partnerships)."
          error={errors?.customerAcquisition}
          required
          rows={4}
          maxLength={1500}
          icon={Users}
          field="customerAcquisition" // Top-level field
          className="mt-6"
        />

        {/* Traction Metrics Inputs */}
        <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50/50 mt-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
            Key Traction Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Monthly Active Users (MAU)"
              id="tractionMetrics.mau"
              type="number"
              value={tractionMetrics.mau || ""}
              onChange={(section, field, value) =>
                handleNestedChange("tractionMetrics", "mau", value)
              }
              placeholder="e.g., 10000"
              error={errors?.["tractionMetrics.mau"]}
              section="tractionMetrics"
              field="mau"
              icon={UserCheck}
            />
            <FormInput
              label="Monthly Recurring Revenue (MRR $)"
              id="tractionMetrics.mrr"
              type="number"
              value={tractionMetrics.mrr || ""}
              onChange={(section, field, value) =>
                handleNestedChange("tractionMetrics", "mrr", value)
              }
              placeholder="e.g., 50000"
              error={errors?.["tractionMetrics.mrr"]}
              section="tractionMetrics"
              field="mrr"
              icon={DollarSign}
            />
            <FormInput
              label="Churn Rate (%)"
              id="tractionMetrics.churnRate"
              type="number"
              value={tractionMetrics.churnRate || ""}
              onChange={(section, field, value) =>
                handleNestedChange("tractionMetrics", "churnRate", value)
              }
              placeholder="e.g., 5"
              error={errors?.["tractionMetrics.churnRate"]}
              section="tractionMetrics"
              field="churnRate"
              icon={Percent}
            />
            <FormInput
              label="Customer Lifetime Value (CLV $)"
              id="tractionMetrics.clv"
              type="number"
              value={tractionMetrics.clv || ""}
              onChange={(section, field, value) =>
                handleNestedChange("tractionMetrics", "clv", value)
              }
              placeholder="e.g., 5000"
              error={errors?.["tractionMetrics.clv"]}
              section="tractionMetrics"
              field="clv"
              icon={DollarSign}
            />
          </div>
          <FormTextarea
            label="Other Metrics / Notes (Optional)"
            id="otherMetricsNotes"
            value={formData.otherMetricsNotes || ""}
            onChange={handleInputChange}
            placeholder="Any other metrics or notes on traction"
            error={errors?.otherMetricsNotes}
            rows={2}
            maxLength={1000}
            field="otherMetricsNotes"
          />
        </div>

        {/* Add the missing Competitive Landscape field */}
        <FormTextarea
          label="Competitive Landscape"
          id="competitiveLandscape"
          value={formData.competitiveLandscape || ""}
          onChange={handleInputChange}
          placeholder="Describe key competitors in your market and your positioning relative to them."
          error={errors?.competitiveLandscape}
          required
          rows={4}
          maxLength={1500}
          icon={Shield}
          field="competitiveLandscape"
          className="mt-6"
        />

        <FormTextarea
          label="Competitive Advantage"
          id="competitiveAdvantage"
          value={formData.competitiveAdvantage || ""}
          onChange={handleInputChange}
          placeholder="Describe your competitive advantage over other companies in the market."
          error={errors?.competitiveAdvantage}
          required
          rows={4}
          maxLength={1500}
          icon={Star}
          field="competitiveAdvantage" // Top-level field
          className="mt-6"
        />
      </div>
    </div>
  );
};

export default MarketTraction;
