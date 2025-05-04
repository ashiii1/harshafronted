/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Trash2,
  DollarSign,
  TrendingUp,
  Package,
  Plus,
  ListChecks,
  Calendar,
  BarChart,
} from "lucide-react";
// Import shared helper components
import { FormInput, FormTextarea, FormSelect } from "./FormHelpers";

// Component for Funding Stage Checkboxes
const FundingStageCheckboxes = ({ selectedStages = [], onChange, error }) => {
  const stages = [
    "Pre-Seed",
    "Seed",
    "Series A",
    "Series B+",
    "Growth",
    "Other",
  ];

  const handleChange = (e) => {
    const { value, checked } = e.target;
    const currentStages = selectedStages || [];
    let newStages;
    if (checked) {
      newStages = [...currentStages, value];
    } else {
      newStages = currentStages.filter((stage) => stage !== value);
    }
    onChange(null, "fundingStagePreferred", newStages); // Update parent state
  };

  return (
    <div>
      <label
        className={`block text-sm font-medium text-gray-700 mb-2 ${
          error ? "text-red-600" : ""
        }`}
      >
        Funding Stage(s) Preferred
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {stages.map((stage) => (
          <div key={stage} className="flex items-center">
            <input
              id={`stage-${stage}`}
              name="fundingStagePreferred"
              type="checkbox"
              value={stage}
              checked={selectedStages.includes(stage)}
              onChange={handleChange}
              className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
            />
            <label
              htmlFor={`stage-${stage}`}
              className="ml-2 block text-sm text-gray-900"
            >
              {stage}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const PreviousFundingItem = ({
  item,
  index,
  handlePreviousFundingChange,
  removePreviousFunding,
  errors,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50/50 mb-3 relative">
    <button
      type="button"
      onClick={() => removePreviousFunding(index)}
      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors p-1"
      aria-label="Remove funding round"
    >
      <Trash2 size={16} />
    </button>

    <div>
      <label
        htmlFor={`round-${index}`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Round
      </label>
      <select
        id={`round-${index}`}
        value={item?.round || ""}
        onChange={(e) =>
          handlePreviousFundingChange(index, "round", e.target.value)
        }
        className="placeholder:text-gray-500 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
      >
        <option value="">Select Round</option>
        <option value="Pre-Seed">Pre-Seed</option>
        <option value="Seed">Seed</option>
        <option value="Series A">Series A</option>
        <option value="Series B">Series B</option>
        <option value="Series C+">Series C+</option>
        <option value="Grant">Grant</option>
        <option value="Angel">Angel</option>
        <option value="Other">Other</option>
      </select>
      {errors?.[`previousFunding[${index}].round`] && (
        <p className="mt-1 text-xs text-red-600">
          {errors?.[`previousFunding[${index}].round`]}
        </p>
      )}
    </div>

    <div>
      <label
        htmlFor={`date-${index}`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Date
      </label>
      <input
        type="month"
        id={`date-${index}`}
        value={item?.date || ""}
        onChange={(e) =>
          handlePreviousFundingChange(index, "date", e.target.value)
        }
        className="placeholder:text-gray-500 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
      />
      {errors?.[`previousFunding[${index}].date`] && (
        <p className="mt-1 text-xs text-red-600">
          {errors?.[`previousFunding[${index}].date`]}
        </p>
      )}
    </div>

    <div>
      <label
        htmlFor={`amount-${index}`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Amount ($)
      </label>
      <input
        type="number"
        id={`amount-${index}`}
        value={item?.amount || ""}
        onChange={(e) =>
          handlePreviousFundingChange(index, "amount", e.target.value)
        }
        placeholder="e.g., 50000"
        className="placeholder:text-gray-500 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
      />
      {errors?.[`previousFunding[${index}].amount`] && (
        <p className="mt-1 text-xs text-red-600">
          {errors?.[`previousFunding[${index}].amount`]}
        </p>
      )}
    </div>

    <div>
      <label
        htmlFor={`investors-${index}`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Lead Investors (Opt)
      </label>
      <input
        type="text"
        id={`investors-${index}`}
        value={item?.investors || ""}
        onChange={(e) =>
          handlePreviousFundingChange(index, "investors", e.target.value)
        }
        placeholder="e.g., VC Firm, Angel Name"
        className="placeholder:text-gray-500 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
      />
      {errors?.[`previousFunding[${index}].investors`] && (
        <p className="mt-1 text-xs text-red-600">
          {errors?.[`previousFunding[${index}].investors`]}
        </p>
      )}
    </div>
  </div>
);

// Component to handle monthly revenue data entry
const MonthlyRevenueSection = ({
  formData,
  handleInputChange,
  handleArrayChange,
  errors,
}) => {
  const [showChart, setShowChart] = useState(true);

  // Ensure revenueData is an array
  const revenueData = Array.isArray(formData.revenueData)
    ? formData.revenueData
    : [];

  // Add a new blank month entry
  const addMonthEntry = () => {
    const newEntry = { month: "", revenue: "" };
    handleInputChange(null, "revenueData", [...revenueData, newEntry]);
  };

  // Remove a month entry
  const removeMonthEntry = (index) => {
    const updatedData = revenueData.filter((_, i) => i !== index);
    handleInputChange(null, "revenueData", updatedData);
  };

  // Handle changes to individual month entries
  const handleMonthEntryChange = (index, field, value) => {
    handleArrayChange("revenueData", index, field, value);
  };

  // Prepare data for chart
  const chartData = revenueData
    .filter((item) => item.month && item.revenue)
    .sort((a, b) => new Date(a.month) - new Date(b.month))
    .map((item) => ({
      month: item.month,
      revenue: Number(item.revenue) || 0,
    }));

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700 flex items-center">
          <BarChart size={20} className="mr-2 text-orange-500" />
          Revenue History
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowChart(!showChart)}
            className="px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
          >
            {showChart ? "Hide Chart" : "Show Chart"}
          </button>
          <button
            type="button"
            onClick={addMonthEntry}
            className="flex items-center space-x-1 px-2.5 py-1.5 border border-dashed border-gray-400 rounded-md text-xs font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
          >
            <Plus size={14} />
            <span>Add Month</span>
          </button>
        </div>
      </div>

      {/* Revenue Chart */}
      {showChart && chartData.length > 0 && (
        <div className="h-64 bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("default", {
                    month: "short",
                    year: "2-digit",
                  });
                }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("default", {
                    month: "long",
                    year: "numeric",
                  });
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Revenue Data Entries */}
      <div className="space-y-3">
        {revenueData.map((entry, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50/50 relative"
          >
            <button
              type="button"
              onClick={() => removeMonthEntry(index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors p-1"
              aria-label="Remove month entry"
            >
              <Trash2 size={16} />
            </button>

            <div>
              <label
                htmlFor={`month-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Month
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Calendar
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="month"
                  id={`month-${index}`}
                  value={entry?.month || ""}
                  onChange={(e) =>
                    handleMonthEntryChange(index, "month", e.target.value)
                  }
                  placeholder="Select month"
                  className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              {errors?.[`revenueData[${index}].month`] && (
                <p className="mt-1 text-xs text-red-600">
                  {errors?.[`revenueData[${index}].month`]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`revenue-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Revenue ($)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <DollarSign
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="number"
                  id={`revenue-${index}`}
                  value={entry?.revenue || ""}
                  onChange={(e) =>
                    handleMonthEntryChange(index, "revenue", e.target.value)
                  }
                  placeholder="e.g., 5000"
                  className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              {errors?.[`revenueData[${index}].revenue`] && (
                <p className="mt-1 text-xs text-red-600">
                  {errors?.[`revenueData[${index}].revenue`]}
                </p>
              )}
            </div>
          </div>
        ))}

        {revenueData.length === 0 && (
          <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">
              Add monthly revenue data to display a trend chart for investors
            </p>
            <button
              type="button"
              onClick={addMonthEntry}
              className="mt-2 inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              <Plus size={16} className="mr-1" /> Add First Month
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Financials = ({
  formData,
  errors,
  handleInputChange,
  handleArrayChange,
  handlePreviousFundingChange,
  addPreviousFunding,
  removePreviousFunding,
}) => {
  // Ensure previousFunding is an array
  const previousFundingData = Array.isArray(formData.previousFunding)
    ? formData.previousFunding
    : [];

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow">
      {/* Funding Request Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Funding Request</h3>
        <FormInput
          label="Funding Amount Sought ($)"
          id="fundingAmountSought"
          type="number"
          value={formData.fundingAmountSought}
          onChange={handleInputChange}
          placeholder="e.g., 500000"
          error={errors?.fundingAmountSought}
          required
          icon={DollarSign}
          field="fundingAmountSought"
        />
        <FundingStageCheckboxes
          selectedStages={formData.fundingStagePreferred}
          onChange={handleInputChange}
          error={errors?.fundingStagePreferred}
        />
        <FormTextarea
          label="Use of Funds"
          id="fundingUse"
          value={formData.fundingUse}
          onChange={handleInputChange}
          placeholder="Briefly explain how the requested funds will be allocated (e.g., product development, marketing, hiring)."
          error={errors?.fundingUse}
          required
          rows={4}
          maxLength={1000}
          icon={ListChecks}
          field="fundingUse"
        />
      </div>

      {/* Current Financials Section */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-700">
          Current Financial Snapshot
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormInput
            label="Current Revenue (Annualized, $)"
            id="currentRevenue"
            type="number"
            value={formData.currentRevenue}
            onChange={handleInputChange}
            placeholder="e.g., 100000"
            error={errors?.currentRevenue}
            icon={DollarSign}
            field="currentRevenue"
          />
          <FormInput
            label="Revenue Projection (Next 12 Months, $)"
            id="revenueProjection"
            type="number"
            value={formData.revenueProjection}
            onChange={handleInputChange}
            placeholder="e.g., 250000"
            error={errors?.revenueProjection}
            icon={TrendingUp}
            field="revenueProjection"
          />
          <FormTextarea
            label="Capital Structure Summary (Optional)"
            id="capitalStructure"
            value={formData.capitalStructure}
            onChange={handleInputChange}
            placeholder="Brief overview of ownership and equity distribution."
            error={errors?.capitalStructure}
            rows={3}
            maxLength={500}
            field="capitalStructure"
          />
        </div>
      </div>

      {/* Add Monthly Revenue Section */}
      <MonthlyRevenueSection
        formData={formData}
        handleInputChange={handleInputChange}
        handleArrayChange={handleArrayChange}
        errors={errors}
      />

      {/* Previous Funding Section */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700">
            Previous Funding Rounds (If any)
          </h3>
          <button
            type="button"
            onClick={addPreviousFunding}
            className="flex items-center space-x-2 px-3 py-1.5 border border-dashed border-gray-400 rounded-md text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
          >
            <Plus size={16} />
            <span>Add Round</span>
          </button>
        </div>
        {previousFundingData.map((item, index) => (
          <PreviousFundingItem
            key={index}
            item={item}
            index={index}
            handlePreviousFundingChange={handlePreviousFundingChange}
            removePreviousFunding={removePreviousFunding}
            errors={errors}
          />
        ))}
        {previousFundingData.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No previous funding rounds added.
          </p>
        )}
      </div>
    </div>
  );
};

export default Financials;
