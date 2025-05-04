import React from "react";
import {
  CheckCircle,
  XCircle,
  FileText,
  Users,
  User,
  Briefcase,
  DollarSign,
  TrendingUp,
  Globe,
  Scale,
  Eye,
  Map as MapIcon,
  LogOut,
  Loader2,
  Rocket,
  AlertCircle,
} from "lucide-react";

// Helper component to display a key-value pair
const DetailItem = ({
  label,
  value,
  isFile = false,
  isArray = false,
  isBoolean = false,
  isObject = false,
  link = false,
}) => {
  let displayValue = "Not Provided";

  if (isFile && value) {
    displayValue = (
      <span className="text-green-600 flex items-center">
        <CheckCircle size={14} className="mr-1" /> {value.name || "Uploaded"}
      </span>
    );
  } else if (isArray && Array.isArray(value) && value.length > 0) {
    // Simple array display - could be more detailed if needed
    displayValue = `${value.length} item(s)`;
  } else if (isBoolean) {
    displayValue = value ? (
      <span className="text-green-600 flex items-center">
        <CheckCircle size={14} className="mr-1" /> Yes
      </span>
    ) : (
      <span className="text-red-600 flex items-center">
        <XCircle size={14} className="mr-1" /> No
      </span>
    );
  } else if (isObject && value && Object.keys(value).length > 0) {
    // Simple object display - could list keys or count
    displayValue = `${
      Object.keys(value).filter((k) => value[k]).length
    } profile(s) provided`;
  } else if (value !== null && value !== undefined && value !== "") {
    displayValue = value;
  }

  return (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
      <dd
        className={`mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ${
          link && typeof value === "string"
            ? "text-blue-600 hover:underline truncate"
            : ""
        }`}
      >
        {link && typeof value === "string" ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {displayValue}
          </a>
        ) : (
          displayValue
        )}
      </dd>
    </div>
  );
};

// Helper to display file arrays
const FileArrayDetail = ({ label, files }) => {
  let displayValue = <span className="text-gray-500">None Uploaded</span>;
  if (Array.isArray(files) && files.length > 0) {
    displayValue = (
      <ul className="list-disc list-inside space-y-1">
        {files.map((file, index) => (
          <li key={index} className="text-sm text-green-600 flex items-center">
            <FileText size={14} className="mr-1 flex-shrink-0" />{" "}
            <span className="truncate" title={file.name}>
              {file.name}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {displayValue}
      </dd>
    </div>
  );
};

// Helper to render sections
const ReviewSection = ({ title, icon: Icon, children }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <h3 className="text-lg font-medium text-gray-800 flex items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
      {Icon && <Icon className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />}{" "}
      {title}
    </h3>
    <dl className="divide-y divide-gray-200 px-4 py-2">{children}</dl>
  </div>
);

// New component for displaying errors
const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-1 text-sm text-red-700">
            {error.includes("Authentication") ? (
              <div>
                <p className="font-medium mb-1">{error}</p>
                <p>
                  Please make sure you are logged in. Your session may have
                  expired.
                </p>
                <a
                  href="/login"
                  className="inline-block mt-2 text-red-700 hover:text-red-900 font-medium underline"
                >
                  Go to login page
                </a>
              </div>
            ) : (
              <p>{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewSubmit = ({
  formData,
  handleSubmit,
  isSubmitting,
  goToStep,
  steps,
  uploadingFiles,
  uploadStatus,
  errors,
}) => {
  // Group data logically for review
  const basicInfo = formData || {};
  const founderDetails = formData || {};
  const teamInfo = formData || {};
  const businessDetails = formData || {};
  const financials = formData || {};
  const marketTraction = formData || {};
  const digitalPresence = formData || {};
  const futurePlans = formData || {};
  const compliance = formData || {};
  const documents = formData || {};

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Review Your Application
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please carefully review all the information below before submitting.
        </p>
      </div>

      {/* Display any errors */}
      <ErrorDisplay error={errors?.submit} />

      {/* --- Review Sections --- */}
      <div className="space-y-4">
        <ReviewSection title="Basic Company Information" icon={Briefcase}>
          <DetailItem label="Company Name" value={basicInfo.companyName} />
          <DetailItem label="Tagline" value={basicInfo.tagline} />
          <DetailItem label="Short Pitch" value={basicInfo.pitch} />
          <DetailItem label="Sector" value={basicInfo.sector} />
          <DetailItem label="Industry" value={basicInfo.industry} />
          <DetailItem label="Stage" value={basicInfo.stage} />
          <DetailItem label="Founded Date" value={basicInfo.foundedDate} />
          <DetailItem label="Location" value={basicInfo.location} />
          <DetailItem
            label="Estimated Valuation"
            value={basicInfo.estimatedValuation}
          />
          <DetailItem
            label="Company Logo"
            value={basicInfo.companyLogo}
            isFile={true}
          />
        </ReviewSection>

        <ReviewSection title="Founder Details" icon={User}>
          <DetailItem label="Founder Name" value={founderDetails.founderName} />
          <DetailItem
            label="Founder Email"
            value={founderDetails.founderEmail}
          />
          <DetailItem
            label="Founder Phone"
            value={founderDetails.founderPhone}
          />
          <DetailItem
            label="Founder LinkedIn"
            value={founderDetails.founderLinkedIn}
            link={true}
          />
          <DetailItem label="Founder Bio" value={founderDetails.founderBio} />
          <DetailItem
            label="Founder Experience"
            value={founderDetails.founderExperience}
          />
          <DetailItem
            label="Founder Achievements"
            value={founderDetails.founderAchievements}
          />
          <DetailItem
            label="Founder Education"
            value={founderDetails.founderEducation}
            isArray={true}
          />
          <DetailItem
            label="Founder Photo"
            value={founderDetails.founderImage}
            isFile={true}
          />
        </ReviewSection>

        <ReviewSection title="Team Information" icon={Users}>
          <DetailItem label="Team Size" value={teamInfo.teamSize} />
          <DetailItem
            label="Key Team Members"
            value={teamInfo.keyTeamMembers}
            isArray={true}
          />
          <DetailItem
            label="Advisors"
            value={teamInfo.advisors}
            isArray={true}
          />
        </ReviewSection>

        <ReviewSection title="Business Details" icon={Briefcase}>
          <DetailItem
            label="Company Description"
            value={businessDetails.companyDescription}
          />
          <DetailItem
            label="Problem Statement"
            value={businessDetails.problemStatement}
          />
          <DetailItem label="Solution" value={businessDetails.solution} />
          <DetailItem
            label="Product/Service Details"
            value={businessDetails.productServiceDetails}
          />
          <DetailItem
            label="Business Model"
            value={businessDetails.businessModel}
          />
          <DetailItem
            label="Revenue Model"
            value={businessDetails.revenueModel}
          />
          <DetailItem
            label="Pricing Strategy"
            value={businessDetails.pricingStrategy}
          />
          <DetailItem
            label="Key Features"
            value={businessDetails.keyFeatures}
            isArray={true}
          />
          <DetailItem
            label="Technology Stack"
            value={businessDetails.technologyStack}
            isArray={true}
          />
        </ReviewSection>

        <ReviewSection title="Financials" icon={DollarSign}>
          <DetailItem
            label="Funding Sought Amount"
            value={financials.fundingAmountSought}
          />
          <DetailItem
            label="Funding Stage Preferred"
            value={financials.fundingStagePreferred}
            isArray={true}
          />
          <DetailItem label="Use of Funds" value={financials.useOfFunds} />
          <DetailItem
            label="Current Revenue (Annual)"
            value={financials.currentRevenue}
          />
          <DetailItem
            label="Revenue Projection (Next Year)"
            value={financials.revenueProjection}
          />
          <DetailItem
            label="Previous Funding Rounds"
            value={financials.previousFunding}
            isArray={true}
          />
          <DetailItem
            label="Capital Structure Summary"
            value={financials.capitalStructure}
          />
        </ReviewSection>

        <ReviewSection title="Market & Traction" icon={TrendingUp}>
          <DetailItem
            label="Target Market Description"
            value={marketTraction.targetMarket}
          />
          <DetailItem
            label="Market Size (TAM, SAM, SOM)"
            value={marketTraction.marketSize}
            isObject={true}
          />
          <DetailItem
            label="Traction Metrics (MAU, MRR, etc.)"
            value={marketTraction.tractionMetrics}
            isObject={true}
          />
          <DetailItem
            label="Customer Acquisition Strategy"
            value={marketTraction.customerAcquisition}
          />
          <DetailItem
            label="Competitive Landscape"
            value={marketTraction.competitiveLandscape}
          />
          <DetailItem
            label="Competitive Advantage"
            value={marketTraction.competitiveAdvantage}
          />
        </ReviewSection>

        <ReviewSection title="Digital Presence" icon={Globe}>
          <DetailItem
            label="Website"
            value={digitalPresence.website}
            link={true}
          />
          <DetailItem
            label="Social Media Profiles"
            value={digitalPresence.socialMedia}
            isObject={true}
          />
          <DetailItem
            label="Press Mentions"
            value={digitalPresence.pressMentions}
            isArray={true}
          />
        </ReviewSection>

        <ReviewSection title="Future Plans & Vision" icon={Eye}>
          <DetailItem
            label="Vision Statement"
            value={futurePlans.visionStatement}
          />
          <DetailItem
            label="Product Roadmap"
            value={futurePlans.productRoadmap}
          />
          <DetailItem
            label="Market Expansion"
            value={futurePlans.marketExpansion}
          />
          <DetailItem label="Exit Strategy" value={futurePlans.exitStrategy} />
        </ReviewSection>

        <ReviewSection title="Compliance & Legal" icon={Scale}>
          <DetailItem label="Legal Name" value={compliance.legalName} />
          <DetailItem
            label="Registration Number"
            value={compliance.registrationNumber}
          />
          <DetailItem
            label="Licenses & Certifications"
            value={compliance.licensesCertifications}
          />
          <DetailItem label="IP Status" value={compliance.ipStatus} />
          <DetailItem
            label="Regulatory Compliance Confirmed"
            value={compliance.regulatoryComplianceConfirmation}
            isBoolean={true}
          />
        </ReviewSection>

        <ReviewSection title="Uploaded Documents" icon={FileText}>
          <DetailItem
            label="Pitch Deck"
            value={documents.pitchDeck}
            isFile={true}
          />
          <DetailItem
            label="Financial Statements"
            value={documents.financialStatements}
            isFile={true}
          />
          <DetailItem
            label="Business Plan"
            value={documents.businessPlan}
            isFile={true}
          />
          <FileArrayDetail
            label="Other Documents"
            files={documents.otherDocuments}
          />
        </ReviewSection>
      </div>

      {/* --- Submit Button --- */}
      <div className="mt-6 text-center">
        {isSubmitting && (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
              <span className="text-lg font-medium">
                {uploadingFiles
                  ? `Uploading Files (${uploadStatus.completed}/${uploadStatus.total})...`
                  : "Submitting application..."}
              </span>
            </div>
            {uploadingFiles && uploadStatus.total > 0 && (
              <div className="w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (uploadStatus.completed / uploadStatus.total) * 100
                    }%`,
                  }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmit;
