/* eslint-disable react/prop-types */
import {
  CheckCircleIcon,
  DocumentIcon,
  VideoCameraIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const Review = ({ formData, handlePrev, handleSubmit }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900">
          Review Your Submission
        </h3>
        <p className="mt-2 text-gray-600">
          Please review all details before final submission.
        </p>
      </div>

      {/* Company Information */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-800 flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 text-blue-500 mr-2" /> Company
          Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Detail label="Company Name" value={formData.companyName} />
          <Detail label="Industry" value={formData.industry} />
          <Detail label="Founded Year" value={formData.foundedYear} />
          <Detail label="Location" value={formData.location} />
        </div>
      </div>

      {/* Financial & Market Information */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-800 flex items-center">
          <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-2" />{" "}
          Financial & Market Traction
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Detail label="Funding Stage" value={formData.fundingStage} />
          <Detail
            label="Estimated Valuation"
            value={formData.estimatedValuation}
          />
          <Detail label="Revenue" value={formData.revenue} />
          <Detail label="Customer Base" value={formData.customerBase} />
        </div>
      </div>

      {/* Digital Presence */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-800 flex items-center">
          <GlobeAltIcon className="h-5 w-5 text-purple-500 mr-2" /> Digital
          Presence
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Detail label="Website" value={formData.website} />
          <Detail label="LinkedIn" value={formData.linkedin} />
          <Detail label="Twitter" value={formData.twitter} />
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-800 flex items-center">
          <DocumentIcon className="h-5 w-5 text-red-500 mr-2" /> Uploaded
          Documents
        </h4>
        <div className="space-y-2 mt-2">
          <FileDetail label="Pitch Deck" file={formData.pitchDeck} />
          <FileDetail label="Business Plan" file={formData.businessPlan} />
          <FileDetail
            label="Additional Documents"
            file={formData.additionalDocs}
          />
        </div>
      </div>

      {/* Pitch Video */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-800 flex items-center">
          <VideoCameraIcon className="h-5 w-5 text-indigo-500 mr-2" /> Pitch
          Video
        </h4>
        <FileDetail label="Pitch Video" file={formData.pitchVideo} />
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrev}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>

        <button
          onClick={handleSubmit}
          className="ml-auto px-6 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-900">
      {value || "Not Provided"}
    </p>
  </div>
);

const FileDetail = ({ label, file }) => (
  <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
    <span className="text-gray-700 text-sm">{label}</span>
    {file ? (
      <span className="text-green-600 text-sm flex items-center">
        <CheckCircleIcon className="h-4 w-4 mr-1" /> Uploaded
      </span>
    ) : (
      <span className="text-red-500 text-sm">Not Uploaded</span>
    )}
  </div>
);

export default Review;
