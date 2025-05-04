/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Link,
  X,
  Plus,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Globe,
} from "lucide-react";

const CompanyLinksForm = ({
  values,
  onChange,
  handleNext,
  currentStep,
  stepsLength,
  errors,
  setErrors,
  handlePrev,
}) => {
  const [isFormValid, setIsFormValid] = useState(false);

  const handleNextButton = () => {
    if (!validate()) {
      handleNext();
    }
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "description",
      "businessModel",
      "revenueModel",
      "pricingStrategy",
      "competitiveAdvantage",
      "uniqueValue",
      "salesStrategy",
      "marketingStrategy",
      "channelStrategy",
      "customerSuccess",
    ];

    requiredFields.forEach((field) => {
      if (!values[field] || !values[field].toString().trim()) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} is required`;
      }
    });

    // Validate Key Features (max 5 items, each up to 100 characters)
    if (values.keyFeatures && values.keyFeatures.length > 0) {
      values.keyFeatures.forEach((feature, index) => {
        if (feature.length > 100) {
          newErrors[`keyFeatures_${index}`] =
            "Key feature must be less than 100 characters";
        }
      });
      if (values.keyFeatures.length > 5) {
        newErrors.keyFeatures = "Maximum 5 key features allowed";
      }
    }

    // Validate Technology Stack (max 5 items, each up to 100 characters)
    if (values.technologyStack && values.technologyStack.length > 0) {
      values.technologyStack.forEach((tech, index) => {
        if (tech.length > 100) {
          newErrors[`technologyStack_${index}`] =
            "Technology stack item must be less than 100 characters";
        }
      });
      if (values.technologyStack.length > 5) {
        newErrors.technologyStack = "Maximum 5 technology stack items allowed";
      }
    }

    // Update errors
    setErrors(newErrors);

    // Check if form is completely valid
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };
  const [newPressLink, setNewPressLink] = useState("");

  useEffect(() => {
    console.log(values);
  }, [values]);

  const handleSocialLinkChange = (platform, value) => {
    onChange({
      ...values,
      socialLinks: {
        ...values.socialLinks,
        [platform]: value,
      },
    });
  };

  const handleAddPressLink = () => {
    if (newPressLink && !values.pressLinks.includes(newPressLink)) {
      onChange({
        ...values,
        pressLinks: [...values.pressLinks, newPressLink],
      });
      setNewPressLink("");
    }
  };

  const handleRemovePressLink = (linkToRemove) => {
    onChange({
      ...values,
      pressLinks: values.pressLinks.filter((link) => link !== linkToRemove),
    });
  };

  const primaryColor = "orange";

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <Link className={`w-5 h-5 text-${primaryColor}-600`} />
        <h2 className="text-xl font-semibold text-gray-800">Company Links</h2>
      </div>

      {/* Website URL */}
      <div className="space-y-2">
        <label
          htmlFor="website"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Globe className="w-4 h-4 text-gray-500" />
          Company Website
        </label>
        <input
          type="url"
          id="website"
          value={values.website || ""}
          onChange={(e) => onChange({ ...values, website: e.target.value })}
          placeholder="https://your-company.com"
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 transition-all duration-200 placeholder-gray-500`}
        />
      </div>

      {/* Social Links */}
      <div className="space-y-5">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* LinkedIn */}
          <div className="group">
            <label
              htmlFor="linkedin"
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Linkedin className={`w-4 h-4 text-${primaryColor}-500`} />
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin"
              value={values.socialLinks?.linkedin || ""}
              onChange={(e) =>
                handleSocialLinkChange("linkedin", e.target.value)
              }
              placeholder="LinkedIn profile URL"
              className={`placeholder-gray-500 mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 group-hover:border-${primaryColor}-300 transition-all duration-200`}
            />
          </div>

          {/* Twitter */}
          <div className="group">
            <label
              htmlFor="twitter"
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Twitter className={`w-4 h-4 text-${primaryColor}-500`} />
              Twitter
            </label>
            <input
              type="url"
              id="twitter"
              value={values.socialLinks?.twitter || ""}
              onChange={(e) =>
                handleSocialLinkChange("twitter", e.target.value)
              }
              placeholder="Twitter profile URL"
              className={`placeholder-gray-500 mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 group-hover:border-${primaryColor}-300 transition-all duration-200`}
            />
          </div>

          {/* Facebook */}
          <div className="group">
            <label
              htmlFor="facebook"
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Facebook className={`w-4 h-4 text-${primaryColor}-500`} />
              Facebook
            </label>
            <input
              type="url"
              id="facebook"
              value={values.socialLinks?.facebook || ""}
              onChange={(e) =>
                handleSocialLinkChange("facebook", e.target.value)
              }
              placeholder="Facebook page URL"
              className={`placeholder-gray-500 mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 group-hover:border-${primaryColor}-300 transition-all duration-200`}
            />
          </div>

          {/* Instagram */}
          <div className="group">
            <label
              htmlFor="instagram"
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Instagram className={`w-4 h-4 text-${primaryColor}-500`} />
              Instagram
            </label>
            <input
              type="url"
              id="instagram"
              value={values.socialLinks?.instagram || ""}
              onChange={(e) =>
                handleSocialLinkChange("instagram", e.target.value)
              }
              placeholder="Instagram profile URL"
              className={`placeholder-gray-500 mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 group-hover:border-${primaryColor}-300 transition-all duration-200`}
            />
          </div>
        </div>
      </div>

      {/* Press Links */}
      <div className="space-y-5 bg-gray-50 p-5 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Press Links
        </h3>

        {/* Add new press link */}
        <div className="flex gap-2">
          <input
            type="url"
            value={newPressLink}
            onChange={(e) => setNewPressLink(e.target.value)}
            placeholder="Add press coverage or article URL"
            className={`placeholder-gray-500 flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 transition-all duration-200`}
          />
          <button
            onClick={handleAddPressLink}
            disabled={!newPressLink}
            className={`px-4 py-3 bg-${primaryColor}-600 text-white rounded-lg hover:bg-${primaryColor}-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors duration-200`}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Press links list */}
        <div className="space-y-3 mt-4">
          {values.pressLinks && values.pressLinks.length > 0 ? (
            values.pressLinks.map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 group hover:border-gray-300 transition-all duration-200"
              >
                <Link
                  className={`w-4 h-4 text-${primaryColor}-400 flex-shrink-0`}
                />
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {link}
                </span>
                <button
                  onClick={() => handleRemovePressLink(link)}
                  className={`p-2 hover:bg-${primaryColor}-100 rounded-full transition-all`}
                >
                  <X className={`w-4 h-4 text-${primaryColor}-500`} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm italic">
              No press links added yet
            </div>
          )}
        </div>
      </div>

      {currentStep < stepsLength && (
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          <button
            type="button"
            onClick={handleNextButton}
            disabled={isFormValid}
            className={`ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-red-500 hover:bg-orange-700 ${
              isFormValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyLinksForm;
