import React from "react";
import { X } from "lucide-react"; // Using lucide-react for consistency

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onClick={onClose} // Close modal on overlay click
    >
      {/* Modal Content */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Terms and Conditions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-grow p-4 md:p-6 space-y-4 text-gray-700 text-sm md:text-base">
          {/* ============================================================ */}
          {/* ========= IMPORTANT: REPLACE WITH YOUR ACTUAL TERMS ========== */}
          {/* ============================================================ */}

          <p className="text-xs text-gray-500 mb-4">
            Last updated: [Insert Date]
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            1. Introduction
          </h3>
          <p>
            Welcome to Innov8Mate ("Company", "we", "our", "us")! These Terms
            and Conditions ("Terms") govern your use of our website located at
            [Your Website URL] and any related services provided by Innov8Mate
            (collectively, the "Service").
          </p>
          <p>
            By accessing or using our Service, you agree to be bound by these
            Terms and our Privacy Policy. If you disagree with any part of the
            terms, then you may not access the Service.
          </p>
          <p>
            Our Privacy Policy also governs your use of our Service and explains
            how we collect, safeguard and disclose information that results from
            your use of our web pages. Please read it here: [Link to Your
            Privacy Policy]
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            2. Eligibility
          </h3>
          <p>
            To use our Service, you must be at least 18 years old and have the
            legal capacity to enter into a binding agreement. By using the
            Service, you represent and warrant that you meet these requirements.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            3. Accounts
          </h3>
          <p>
            When you create an account with us, you must provide information
            that is accurate, complete, and current at all times. Failure to do
            so constitutes a breach of the Terms, which may result in immediate
            termination of your account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to
            access the Service and for any activities or actions under your
            password, whether your password is with our Service or a third-party
            service.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must
            notify us immediately upon becoming aware of any breach of security
            or unauthorized use of your account.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            4. Use of Service
          </h3>
          <p>
            You agree to use the Service only for lawful purposes and in
            accordance with these Terms. You agree not to use the Service:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              In any way that violates any applicable national or international
              law or regulation.
            </li>
            <li>
              For the purpose of exploiting, harming, or attempting to exploit
              or harm minors in any way.
            </li>
            <li>
              To transmit, or procure the sending of, any advertising or
              promotional material, including any "junk mail," "chain letter,"
              "spam," or any other similar solicitation.
            </li>
            <li>
              To impersonate or attempt to impersonate the Company, a Company
              employee, another user, or any other person or entity.
            </li>
            {/* Add more prohibited uses */}
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            5. Intellectual Property
          </h3>
          <p>
            The Service and its original content (excluding Content provided by
            users), features and functionality are and will remain the exclusive
            property of Innov8Mate and its licensors. The Service is protected
            by copyright, trademark, and other laws of both the [Your Country]
            and foreign countries.
          </p>

          {/* -------- ADD MANY MORE SECTIONS AS REQUIRED -------- */}
          {/* Examples: Termination, Disclaimer of Warranties, Limitation of Liability, Governing Law, Changes to Terms, etc. */}
          <h3 className="text-lg font-semibold text-gray-800 mt-4">[...]</h3>
          <p>[...]</p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            N. Contact Information
          </h3>
          <p>
            If you have any questions about these Terms, please contact us at:
            [Your Contact Email or Link]
          </p>

          {/* ============================================================ */}
          {/* =================== END OF PLACEHOLDER =================== */}
          {/* ============================================================ */}

          <p className="mt-6 font-semibold text-gray-800">
            By clicking "Accept" or continuing to use the Service, you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms and Conditions.
          </p>
        </div>

        {/* Footer / Close Button */}
        <div className="flex justify-end p-4 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
