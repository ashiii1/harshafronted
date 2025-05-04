/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaRoad, FaGlobeAmericas, FaSignOutAlt, FaEye } from "react-icons/fa";

const FuturePlans = ({
  formData,
  handleTextAreaChange,
  errors,
  setErrors,
  handleNext,
  handlePrev,
}) => {
  const [isFormValid, setIsFormValid] = useState(false);

  const validate = () => {
    const newErrors = {};
    const requiredFields = ["roadmap", "expansionPlans", "exitStrategy"];

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} is required`;
      }
    });

    // Update errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    // Check if form is valid
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  const handleNextButton = () => {
    if (validate()) {
      handleNext();
    }
  };

  useEffect(() => {
    validate();
    console.log(formData);
  }, [formData]);

  const textArea = ({
    label,
    name,
    placeholder,
    value,
    onChange,
    error,
    rows = 4,
    icon: Icon,
  }) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center mb-1">
          {Icon && <Icon className="mr-2 text-orange-500 h-5 w-5" />}
          <label className="block font-medium">{label}</label>
        </div>
        <textarea
          name={name}
          rows={rows}
          value={value || ""}
          onChange={onChange}
          className={`
            block w-full rounded-md border
            focus:ring-orange-500 focus:border-orange-500
            transition-colors duration-200
            placeholder-gray-500
            ${error ? "border-red-300" : "border-gray-300"}
          `}
          placeholder={placeholder}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        <div className="flex justify-end">
          <p className="text-xs text-gray-500">
            {value ? value.length : 0}/1000
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 bg-white p-8 rounded-xl ">
      {/* Product Roadmap */}
      <div className="">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaRoad className="mr-2 text-orange-500" />
          Product Roadmap
        </h3>

        {textArea({
          label: "Product Roadmap Overview",
          name: "roadmap",
          placeholder:
            "Describe your product roadmap (e.g., Q3 2023: Launch enterprise version, Q4 2023: Expand to European market...)",
          value: formData.roadmap,
          onChange: (e) => handleTextAreaChange("roadmap", e.target.value),
          error: errors.roadmap,
        })}

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">
              Short-term Goals (6 months)
            </h4>
            {textArea({
              name: "shortTermGoals",
              placeholder: "List key goals for the next 6 months",
              value: formData.shortTermGoals,
              onChange: (e) =>
                handleTextAreaChange("shortTermGoals", e.target.value),
              error: errors.shortTermGoals,
              rows: 3,
            })}
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold text-indigo-800">
              Mid-term Goals (12 months)
            </h4>
            {textArea({
              name: "midTermGoals",
              placeholder: "List key goals for the next 12 months",
              value: formData.midTermGoals,
              onChange: (e) =>
                handleTextAreaChange("midTermGoals", e.target.value),
              error: errors.midTermGoals,
              rows: 3,
            })}
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800">
              Long-term Goals (24+ months)
            </h4>
            {textArea({
              name: "longTermGoals",
              placeholder: "List key goals beyond 24 months",
              value: formData.longTermGoals,
              onChange: (e) =>
                handleTextAreaChange("longTermGoals", e.target.value),
              error: errors.longTermGoals,
              rows: 3,
            })}
          </div>
        </div>
      </div>

      {/* Expansion Strategy */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaGlobeAmericas className="mr-2 text-orange-500" />
          Expansion Strategy
        </h3>

        {textArea({
          label: "Expansion Strategy Overview",
          name: "expansionPlans",
          placeholder:
            "Describe your geographic and market segment expansion plans",
          value: formData.expansionPlans,
          onChange: (e) =>
            handleTextAreaChange("expansionPlans", e.target.value),
          error: errors.expansionPlans,
        })}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Geographic Expansion</h4>
            {textArea({
              name: "geographicExpansion",
              placeholder: "Describe your geographic expansion plans",
              value: formData.geographicExpansion,
              onChange: (e) =>
                handleTextAreaChange("geographicExpansion", e.target.value),
              error: errors.geographicExpansion,
              rows: 3,
            })}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Market Segment Expansion</h4>
            {textArea({
              name: "marketSegmentExpansion",
              placeholder: "Describe your market segment expansion plans",
              value: formData.marketSegmentExpansion,
              onChange: (e) =>
                handleTextAreaChange("marketSegmentExpansion", e.target.value),
              error: errors.marketSegmentExpansion,
              rows: 3,
            })}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Team Growth Plans</h4>
            {textArea({
              name: "teamGrowth",
              placeholder: "Describe your team growth plans",
              value: formData.teamGrowth,
              onChange: (e) =>
                handleTextAreaChange("teamGrowth", e.target.value),
              error: errors.teamGrowth,
              rows: 3,
            })}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Strategic Partnerships</h4>
            {textArea({
              name: "strategicPartnerships",
              placeholder: "Describe your strategic partnership plans",
              value: formData.strategicPartnerships,
              onChange: (e) =>
                handleTextAreaChange("strategicPartnerships", e.target.value),
              error: errors.strategicPartnerships,
              rows: 3,
            })}
          </div>
        </div>
      </div>

      {/* Exit Strategy */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaSignOutAlt className="mr-2 text-orange-500" />
          Exit Strategy
        </h3>

        {textArea({
          label: "Exit Strategy Overview",
          name: "exitStrategy",
          placeholder: "Describe your exit strategy (e.g., acquisition, IPO)",
          value: formData.exitStrategy,
          onChange: (e) => handleTextAreaChange("exitStrategy", e.target.value),
          error: errors.exitStrategy,
        })}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Potential Acquirers</h4>
            {textArea({
              name: "potentialAcquirers",
              placeholder:
                "Describe potential acquirers or acquisition strategy",
              value: formData.potentialAcquirers,
              onChange: (e) =>
                handleTextAreaChange("potentialAcquirers", e.target.value),
              error: errors.potentialAcquirers,
              rows: 3,
            })}
          </div>

          <div>
            <h4 className="font-semibold mb-2">IPO Timeline & Strategy</h4>
            {textArea({
              name: "ipoTimeline",
              placeholder:
                "Describe your IPO timeline and strategy if applicable",
              value: formData.ipoTimeline,
              onChange: (e) =>
                handleTextAreaChange("ipoTimeline", e.target.value),
              error: errors.ipoTimeline,
              rows: 3,
            })}
          </div>
        </div>
      </div>

      {/* Strategic Vision */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
          <FaEye className="mr-2 text-blue-500" />
          Long-term Vision
        </h3>

        {textArea({
          name: "longTermVision",
          placeholder: "Describe your company's long-term vision",
          value: formData.longTermVision,
          onChange: (e) =>
            handleTextAreaChange("longTermVision", e.target.value),
          error: errors.longTermVision,
          rows: 4,
        })}

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Impact Goals</h4>
          {textArea({
            name: "impactGoals",
            placeholder:
              "Describe the broader impact goals your company aims to achieve",
            value: formData.impactGoals,
            onChange: (e) =>
              handleTextAreaChange("impactGoals", e.target.value),
            error: errors.impactGoals,
            rows: 3,
          })}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNextButton}
          disabled={!isFormValid}
          className={`ml-auto inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border border-transparent text-sm font-medium rounded-md text-white ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FuturePlans;
