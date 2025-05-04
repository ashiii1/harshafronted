import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  DownloadCloud,
  Mail,
  BarChart,
  Calendar,
  Clock,
  ShieldCheck,
  Zap,
  Gift,
  Menu,
  ChevronRight,
  PlusCircle,
  UserPlus,
  Rocket,
  CrownIcon,
  Users,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const PaymentResultScreens = () => {
  // We'll use this to toggle between different screens for demo purposes

  const location = useLocation();
  const { status, planName, isAnnual } = location.state;
  const [currentStatus, setCurrentStatus] = useState(status);

  // Get the appropriate icon for the selected plan

  //onContinue, onTryAgain;
  const getPlanIcon = () => {
    switch (planName) {
      case "Boost Plan":
        return Rocket;
      case "Pro Fund Plan":
        return CrownIcon;
      default:
        return Users;
    }
  };

  const PlanIcon = getPlanIcon();

  // Success Screen
  const SuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border-2 border-green-100 overflow-hidden"
    >
      <div className="p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Welcome to Premium!
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Your payment was successful and you now have full access to all the
          premium features of {planName}.
        </p>

        {/* Plan Details Card */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 rounded-xl bg-orange-100">
              <PlanIcon className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">{planName}</h3>
              <p className="text-sm text-gray-500">
                {isAnnual ? "Annual subscription" : "Monthly subscription"}
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subscription starts</span>
              <span className="font-medium text-gray-900">
                February 25, 2025
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Next billing date</span>
              <span className="font-medium text-gray-900">
                {isAnnual ? "February 25, 2026" : "March 25, 2025"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment reference</span>
              <span className="font-medium text-gray-900">
                INV-25022025-873
              </span>
            </div>
          </div>
        </div>

        {/* Premium Unlocks */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-5">
            Your Premium Features
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
              <div className="p-2 rounded-lg bg-white">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Priority Access
                </h4>
                <p className="text-xs text-gray-600">
                  Stand out with featured listings and priority in searches
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="p-2 rounded-lg bg-white">
                <UserPlus className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Direct Messaging
                </h4>
                <p className="text-xs text-gray-600">
                  Connect with verified investors instantly
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
              <div className="p-2 rounded-lg bg-white">
                <BarChart className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Analytics Dashboard
                </h4>
                <p className="text-xs text-gray-600">
                  Track investor engagement with your profile
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
              <div className="p-2 rounded-lg bg-white">
                <Gift className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Exclusive Events
                </h4>
                <p className="text-xs text-gray-600">
                  Early access to networking opportunities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-4 mb-8 max-w-md mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Next Steps</h3>

          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-white">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              1
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">
                Complete your profile
              </h4>
              <p className="text-xs text-gray-600">
                Enhance your visibility to investors
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>

          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-white">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              2
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">
                Upload your pitch deck
              </h4>
              <p className="text-xs text-gray-600">
                Share your vision with potential investors
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>

          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-white">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              3
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">
                Connect with investors
              </h4>
              <p className="text-xs text-gray-600">
                Start building valuable relationships
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            //onClick={onContinue}
            className="py-4 px-8 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-4 px-8 rounded-xl font-semibold text-sm transition-all bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            View Receipt
            <DownloadCloud size={16} />
          </motion.button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-pink-50 py-6 px-8">
        <div className="flex items-center justify-center gap-3">
          <Mail className="w-5 h-5 text-orange-500" />
          <p className="text-sm text-gray-700">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Error Screen
  const ErrorScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border-2 border-red-100 overflow-hidden"
    >
      <div className="p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={40} className="text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Payment Unsuccessful
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          We couldn't process your payment for the {planName}. Please check your
          payment details and try again.
        </p>

        {/* Error Details Card */}
        <div className="bg-red-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Payment Declined
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your payment method was declined by your bank or payment
                provider. This could be due to:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 list-disc pl-4">
                <li>Insufficient funds</li>
                <li>Card expiration date mismatch</li>
                <li>Security verification failure</li>
                <li>Transaction limits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What to do next */}
        <div className="mb-8 max-w-md mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            What to do next?
          </h3>

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                1
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Check that your card details are correct and that your card
                  isn't expired
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                2
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Ensure you have sufficient funds available for the transaction
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                3
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Contact your bank to check if there are any restrictions on
                  your card
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                4
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Try a different payment method or card if available
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            //onClick={onTryAgain}
            className="py-4 px-8 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Try Again
            <RefreshCw size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-4 px-8 rounded-xl font-semibold text-sm transition-all bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            Contact Support
            <Mail size={16} />
          </motion.button>
        </div>
      </div>

      <div className="bg-gray-50 py-6 px-8">
        <div className="flex items-center justify-center gap-3">
          <Clock className="w-5 h-5 text-gray-500" />
          <p className="text-sm text-gray-700">
            Your subscription selection is saved for 24 hours.
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Pending/Processing Screen
  const ProcessingScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 overflow-hidden"
    >
      <div className="p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
            <RefreshCw size={40} className="text-blue-600 animate-spin" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Processing Payment
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          We're currently processing your payment for the {planName}. This might
          take a moment.
        </p>

        {/* Progress Indicator */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "80%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
          <p className="text-sm text-gray-500">
            Please don't close this window
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 rounded-xl bg-orange-100">
              <PlanIcon className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">{planName}</h3>
              <p className="text-sm text-gray-500">
                {isAnnual ? "Annual subscription" : "Monthly subscription"}
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-900">
                ₹{isAnnual ? "9,588" : "999"} {isAnnual ? "/year" : "/month"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment method</span>
              <span className="font-medium text-gray-900">
                Credit Card (****4242)
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentStatus("success")}
            className="py-4 px-8 rounded-xl font-semibold text-sm transition-all bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            Cancel
          </motion.button>
        </div>
      </div>

      <div className="bg-blue-50 py-6 px-8">
        <div className="flex items-center justify-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-500" />
          <p className="text-sm text-gray-700">
            Your payment information is secure and encrypted.
          </p>
        </div>
      </div>
    </motion.div>
  );

  // For demo purposes, toggle between different screens
  const getScreenByStatus = () => {
    switch (currentStatus) {
      case "success":
        return <SuccessScreen />;
      case "error":
        return <ErrorScreen />;
      case "processing":
        return <ProcessingScreen />;
      default:
        return <SuccessScreen />;
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {getScreenByStatus()}

        {/* Demo Controls - you would remove this in production */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setCurrentStatus("success")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentStatus === "success"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Show Success
          </button>
          <button
            onClick={() => setCurrentStatus("error")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentStatus === "error"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Show Error
          </button>
          <button
            onClick={() => setCurrentStatus("processing")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentStatus === "processing"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Show Processing
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentResultScreens;
