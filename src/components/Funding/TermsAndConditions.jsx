import { useState } from "react";
import {
  X,
  Check,
  AlertTriangle,
  FileText,
  Shield,
  User,
  Briefcase,
  DollarSign,
  Lock,
} from "react-feather";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = ({ isOpen, onClose }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleAccept = () => {
    if (acceptedTerms && acceptedPrivacy) {
      // onAccept && onAccept();

      onClose();
      navigate("/funding/register");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Terms and Conditions
            </h2>
            <p className="text-gray-600 text-sm">
              Review before joining Innov8Mate funding program
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50 p-4 md:border-r border-gray-200 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto space-x-2 md:space-x-0 md:space-y-1">
            <button
              onClick={() => setActiveSection("general")}
              className={`flex items-center space-x-3 p-3 rounded-lg text-left w-full 
                ${
                  activeSection === "general"
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">General Terms</span>
            </button>
            <button
              onClick={() => setActiveSection("eligibility")}
              className={`flex items-center space-x-3 p-3 rounded-lg text-left w-full
                ${
                  activeSection === "eligibility"
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Eligibility</span>
            </button>
            <button
              onClick={() => setActiveSection("funding")}
              className={`flex items-center space-x-3 p-3 rounded-lg text-left w-full
                ${
                  activeSection === "funding"
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Funding Terms</span>
            </button>
            <button
              onClick={() => setActiveSection("company")}
              className={`flex items-center space-x-3 p-3 rounded-lg text-left w-full
                ${
                  activeSection === "company"
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Company Profiles</span>
            </button>
            <button
              onClick={() => setActiveSection("privacy")}
              className={`flex items-center space-x-3 p-3 rounded-lg text-left w-full
                ${
                  activeSection === "privacy"
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Privacy Policy</span>
            </button>
            <button
              onClick={() => setActiveSection("data")}
              className={`flex items-center space-x-3 p-3 rounded-lg text-left w-full
                ${
                  activeSection === "data"
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
            >
              <Lock className="w-5 h-5" />
              <span className="font-medium">Data Security</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === "general" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                  <p className="text-sm text-blue-700">
                    Last updated: March 1, 2025. Please read these terms
                    carefully before registering your company.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  1. Introduction
                </h3>
                <p className="text-gray-600">
                  Welcome to Innov8Mate ("Platform"). These Terms and Conditions
                  govern your use of our platform and the services we provide to
                  connect startups with potential investors.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  2. Acceptance of Terms
                </h3>
                <p className="text-gray-600">
                  By registering your company on Innov8Mate, you agree to be
                  bound by these Terms and Conditions, our Privacy Policy, and
                  any other policies referenced herein. If you do not agree with
                  any part of these terms, you may not use our services.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  3. Modifications to Terms
                </h3>
                <p className="text-gray-600">
                  We reserve the right to modify these Terms and Conditions at
                  any time. Changes will be effective immediately upon posting
                  to the Platform. Your continued use of the Platform following
                  any changes constitutes your acceptance of such changes.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  4. Platform Usage
                </h3>
                <p className="text-gray-600">
                  The Innov8Mate platform is designed to facilitate connections
                  between startups seeking funding and potential investors. We
                  do not guarantee that you will receive funding through our
                  Platform. Our role is limited to providing the technology and
                  infrastructure to facilitate these connections.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  5. Account Responsibility
                </h3>
                <p className="text-gray-600">
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account. You agree to notify us immediately of any
                  unauthorized use of your account.
                </p>
              </div>
            )}

            {activeSection === "eligibility" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  6. Eligibility Requirements
                </h3>
                <p className="text-gray-600">
                  To register your company on Innov8Mate, you must:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Be at least 18 years of age</li>
                  <li>
                    Have legal authority to represent the company you are
                    registering
                  </li>
                  <li>
                    Provide accurate and complete information about your company
                  </li>
                  <li>Have a legally registered business entity</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  7. Verification Process
                </h3>
                <p className="text-gray-600">
                  We reserve the right to verify the information provided during
                  registration. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Requesting official company documentation</li>
                  <li>Verifying business registration</li>
                  <li>Conducting background checks on key team members</li>
                  <li>Requesting financial statements or proof of traction</li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded flex">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Providing false or misleading information may result in
                    immediate termination of your account and potential legal
                    consequences.
                  </p>
                </div>
              </div>
            )}

            {activeSection === "funding" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  8. Funding Process
                </h3>
                <p className="text-gray-600">
                  Innov8Mate provides a platform for connecting startups with
                  investors, but does not directly provide funding. All
                  investment decisions are made independently by investors
                  according to their own criteria.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  9. Platform Fees
                </h3>
                <p className="text-gray-600">
                  Registration on Innov8Mate is free. However, we charge the
                  following fees:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>
                    A success fee of 2% on any funding secured through our
                    platform
                  </li>
                  <li>
                    Optional premium features which may be subject to
                    subscription fees
                  </li>
                  <li>
                    Administrative fees for certain verification processes
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  10. Investor Communications
                </h3>
                <p className="text-gray-600">
                  Any communications or negotiations with investors are your
                  responsibility. While we provide the platform for initial
                  connections, the terms of any investment are to be negotiated
                  directly between you and the investor.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  11. No Guarantees
                </h3>
                <p className="text-gray-600">
                  We do not guarantee that your company will receive funding
                  through our platform. Success depends on various factors
                  including your business model, traction, team, and market
                  conditions.
                </p>
              </div>
            )}

            {activeSection === "company" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  12. Company Profile
                </h3>
                <p className="text-gray-600">
                  When creating your company profile, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide accurate and up-to-date information</li>
                  <li>Upload only content that you have the rights to use</li>
                  <li>
                    Present your business truthfully without misleading claims
                  </li>
                  <li>Keep your profile updated as your business evolves</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  13. Content Ownership
                </h3>
                <p className="text-gray-600">
                  You retain all ownership rights to the content you provide.
                  However, by uploading content to our platform, you grant us a
                  non-exclusive, worldwide, royalty-free license to use,
                  reproduce, and display such content for the purpose of
                  providing our services.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  14. Content Restrictions
                </h3>
                <p className="text-gray-600">
                  You may not upload content that:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains false or misleading information</li>
                  <li>Promotes illegal activities</li>
                  <li>Is offensive, defamatory, or discriminatory</li>
                  <li>Contains malware or harmful code</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  15. Profile Review
                </h3>
                <p className="text-gray-600">
                  We reserve the right to review and approve all company
                  profiles before they are made visible to investors. We may
                  request changes or remove content that violates our policies.
                </p>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  16. Privacy Policy
                </h3>
                <p className="text-gray-600">
                  Our Privacy Policy describes how we collect, use, and share
                  your personal information. By using our Platform, you consent
                  to the data practices described in our Privacy Policy.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  17. Information Collection
                </h3>
                <p className="text-gray-600">
                  We collect the following information:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>
                    Company details (name, registration information, location)
                  </li>
                  <li>Team member information (names, roles, experience)</li>
                  <li>Business metrics (revenue, growth, customer data)</li>
                  <li>Funding history and requirements</li>
                  <li>Contact information for communication purposes</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  18. Information Sharing
                </h3>
                <p className="text-gray-600">
                  Your company information will be shared with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Registered investors on our platform</li>
                  <li>Our service providers who help operate the platform</li>
                  <li>Legal authorities when required by law</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">
                  19. Investor Access
                </h3>
                <p className="text-gray-600">
                  Investors on our platform will have access to your company
                  profile and the information you provide. You can control which
                  specific financial details are visible to investors through
                  your profile settings.
                </p>
              </div>
            )}

            {activeSection === "data" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  20. Data Security
                </h3>
                <p className="text-gray-600">
                  We implement reasonable security measures to protect your
                  information. However, no method of transmission over the
                  Internet is 100% secure, and we cannot guarantee absolute
                  security.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  21. Confidentiality
                </h3>
                <p className="text-gray-600">
                  While we take steps to protect your confidential information,
                  you should be aware that any information you provide may be
                  viewed by potential investors. Consider carefully what
                  information you choose to share.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  22. Non-Disclosure Agreements
                </h3>
                <p className="text-gray-600">
                  Investors on our platform agree to basic confidentiality
                  terms. However, if you require specific non-disclosure
                  agreements, you should arrange these directly with investors
                  before sharing sensitive information.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  23. Data Retention
                </h3>
                <p className="text-gray-600">
                  We retain your information for as long as your account is
                  active or as needed to provide services. You may request
                  deletion of your data, subject to legal retention
                  requirements.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  24. Third-Party Links
                </h3>
                <p className="text-gray-600">
                  Our Platform may contain links to third-party websites. We are
                  not responsible for the privacy practices or content of these
                  third-party sites.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Accept buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  checked={acceptedTerms}
                  onChange={() => setAcceptedTerms(!acceptedTerms)}
                />
              </div>
              <label htmlFor="terms" className="text-sm text-gray-700">
                I have read and agree to the Terms and Conditions, and
                understand my rights and obligations as a user of Innov8Mate.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="privacy"
                  type="checkbox"
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  checked={acceptedPrivacy}
                  onChange={() => setAcceptedPrivacy(!acceptedPrivacy)}
                />
              </div>
              <label htmlFor="privacy" className="text-sm text-gray-700">
                I consent to the collection, use, and sharing of my information
                as described in the Privacy Policy, including sharing my company
                profile with potential investors.
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={!acceptedTerms || !acceptedPrivacy}
                className={`px-5 py-2 rounded-lg text-white font-medium flex items-center 
                  ${
                    acceptedTerms && acceptedPrivacy
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                <Check className="w-4 h-4 mr-2" />
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
