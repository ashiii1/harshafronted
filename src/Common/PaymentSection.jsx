import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PaymentSection = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const plan = useSelector((store) => store.plan);

  const { selectedPlan, isAnnual } = plan || {}; // ✅ Data receive kar rahe hain
  const navigate = useNavigate();

  // Calculate price based on selected plan and billing period
  const getPrice = () => {
    if (!selectedPlan) return { monthly: 999, annual: 799 }; // Default to Connect+ if no plan provided
    return {
      monthly: selectedPlan.monthlyPrice,
      annual: selectedPlan.annualPrice,
    };
  };

  const onComplete = () => {
    navigate("/paymentTransaction", {
      state: {
        status: "error",
        planName: "Connect+ Plan",
        isAnnual: true,
      },
    });
  };

  const price = getPrice();
  const currentPrice = isAnnual ? price.annual : price.monthly;
  const planName = selectedPlan?.name || "Connect+ Plan";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2); // Move to confirmation step
    }, 2000);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {step === 1 ? "Complete Your Subscription" : "Payment Successful!"}
          </motion.h2>
          {step === 1 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-xl mx-auto"
            >
              You're one step away from unlocking premium features with the{" "}
              {planName}
            </motion.p>
          )}
        </div>

        {step === 1 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Payment Form */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Payment Details
                  </h3>

                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 border-2 transition ${
                        paymentMethod === "card"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200"
                      }`}
                    >
                      <CreditCard
                        size={18}
                        className={
                          paymentMethod === "card"
                            ? "text-orange-500"
                            : "text-gray-500"
                        }
                      />
                      <span
                        className={`text-sm font-medium ${
                          paymentMethod === "card"
                            ? "text-orange-600"
                            : "text-gray-600"
                        }`}
                      >
                        Credit Card
                      </span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 border-2 transition ${
                        paymentMethod === "upi"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div
                        className={`text-sm font-medium ${
                          paymentMethod === "upi"
                            ? "text-orange-600"
                            : "text-gray-600"
                        }`}
                      >
                        UPI
                      </div>
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="number"
                              value={cardDetails.number}
                              onChange={handleInputChange}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              required
                            />
                            <CreditCard
                              size={18}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={cardDetails.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="expiry"
                                value={cardDetails.expiry}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                required
                              />
                              <Calendar
                                size={18}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                required
                              />
                              <Lock
                                size={18}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isProcessing}
                        className="w-full mt-6 py-4 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <>
                            <Clock className="animate-spin mr-2 h-5 w-5" />
                            Processing...
                          </>
                        ) : (
                          "Complete Payment"
                        )}
                      </motion.button>
                    </form>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="border-2 border-gray-100 rounded-xl p-6 text-center">
                      <div className="bg-gray-100 rounded-lg p-4 inline-block mb-4">
                        <svg viewBox="0 0 100 100" width="100" height="100">
                          <rect width="100" height="100" fill="#f5f5f5" />
                          <rect
                            x="30"
                            y="30"
                            width="40"
                            height="40"
                            fill="#333"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700 mb-2">
                        Scan with any UPI app
                      </p>
                      <p className="text-sm text-gray-500">Or pay to UPI ID:</p>
                      <p className="font-mono text-orange-600 font-medium">
                        innov8mate@upi
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="w-full mt-6 py-4 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <>
                            <Clock className="animate-spin mr-2 h-5 w-5" />
                            Verifying Payment...
                          </>
                        ) : (
                          "I've Completed Payment"
                        )}
                      </motion.button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 justify-center mt-6">
                    <Lock size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Secure payment powered by Stripe
                    </span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="w-full md:w-80 bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-orange-100">
                        {selectedPlan?.icon ? (
                          <selectedPlan.icon className="w-5 h-5 text-orange-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {planName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {isAnnual ? "Annual billing" : "Monthly billing"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Subscription fee</span>
                        <span className="font-medium">₹{currentPrice}/mo</span>
                      </div>

                      {isAnnual && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Billing period</span>
                          <span className="font-medium">12 months</span>
                        </div>
                      )}

                      {isAnnual && (
                        <div className="flex justify-between text-sm text-green-600 mb-2">
                          <span>Annual discount</span>
                          <span>-₹{(price.monthly - price.annual) * 12}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Total</span>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          ₹{isAnnual ? currentPrice * 12 : currentPrice}
                        </div>
                        <div className="text-xs text-gray-500">
                          {isAnnual ? "billed annually" : "billed monthly"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <ShieldCheck
                        size={16}
                        className="text-green-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-xs text-gray-600">
                        7-day free trial with all features included
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck
                        size={16}
                        className="text-green-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-xs text-gray-600">
                        Cancel anytime during trial, no charges
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border-2 border-green-100 overflow-hidden p-8 text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-500" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Subscription Activated!
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You now have access to all the premium features of the {planName}.
              Your 7-day free trial has begun.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-8 max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">{planName}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Billing cycle</span>
                <span className="font-medium text-gray-900">
                  {isAnnual ? "Annual" : "Monthly"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next billing date</span>
                <span className="font-medium text-gray-900">March 4, 2025</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="py-3 px-6 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl"
              >
                Get Started Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="py-3 px-6 rounded-xl font-semibold text-sm transition-all bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                View Billing Details
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-orange-50 rounded-full">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-700">
              Secure payments • 100% money-back guarantee • 24/7 support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
