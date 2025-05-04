/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RocketIcon,
  UsersIcon,
  CrownIcon,
  CheckIcon,
  Zap,
  Shield,
  Clock,
  Star,
  Settings,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPlan } from "../Utils/planSlice";
import { setIsAnnualPlan } from "../Utils/planSlice";

const PricingToggle = ({ isAnnual, setIsAnnual }) => (
  <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
    <span
      className={`text-sm font-medium ${
        !isAnnual ? "text-orange-600" : "text-gray-500"
      }`}
    >
      Monthly
    </span>
    <button
      type="button"
      onClick={() => setIsAnnual(!isAnnual)}
      className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
        isAnnual ? "bg-orange-500" : "bg-gray-200"
      }`}
      aria-pressed={isAnnual}
      aria-label="Toggle billing period"
    >
      <motion.div
        className="absolute w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full top-[2px] sm:top-[2px] left-[3px] sm:left-[3px] shadow"
        initial={false}
        animate={{ x: isAnnual ? (window.innerWidth < 640 ? 24 : 28) : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
    <div className="flex items-center gap-1 sm:gap-2">
      <span
        className={`text-sm font-medium ${
          isAnnual ? "text-orange-600" : "text-gray-500"
        }`}
      >
        Annual
      </span>
      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
        Save 20%
      </span>
    </div>
  </div>
);

const FeatureTooltip = ({ text }) => (
  <div className="group relative flex items-center">
    <button
      type="button"
      className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-gray-400 cursor-help text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
      aria-label="More info"
    >
      ?
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 sm:w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-focus:opacity-100 group-hover:visible group-focus:visible transition-all z-10 pointer-events-none group-focus:pointer-events-auto">
      {text}
    </div>
  </div>
);

const plans = [
  {
    name: "Boost Plan",
    description:
      "Perfect for early-stage startups looking to increase visibility",
    monthlyPrice: 499,
    annualPrice: 399,
    icon: RocketIcon,
    features: [
      {
        text: "Priority Listing on investor search results",
        tooltip: "Appear at the top of investor searches in your category",
      },
      {
        text: "Highlighted profile with 'Featured Startup' badge",
        tooltip: "Stand out with a special badge on your profile",
      },
      {
        text: "2x more visibility in startup recommendations",
        tooltip: "Double your chances of being recommended to investors",
      },
    ],
    highlights: [
      { icon: Zap, text: "Faster investor matching" },
      { icon: Star, text: "Featured profile" },
    ],
  },
  {
    name: "Connect+ Plan",
    description: "Ideal for startups actively seeking investment",
    monthlyPrice: 999,
    annualPrice: 799,
    icon: UsersIcon,
    recommended: true,
    features: [
      {
        text: "Everything in Boost Plan",
        tooltip: "All features from the Boost Plan included",
      },
      {
        text: "Direct Messaging with verified investors",
        tooltip: "Instantly connect with interested investors",
      },
      {
        text: "Investor Engagement Analytics",
        tooltip: "Track and analyze investor interest in your startup",
      },
      {
        text: "Early access to community networking events",
        tooltip: "Get first access to exclusive events",
      },
    ],
    highlights: [
      { icon: Shield, text: "Verified investors" },
      { icon: Settings, text: "Advanced analytics" },
    ],
  },
  {
    name: "Pro Fund Plan",
    description: "For serious fundraising and maximum exposure",
    monthlyPrice: 1999,
    annualPrice: 1599,
    icon: CrownIcon,
    features: [
      {
        text: "Everything in Connect+ Plan",
        tooltip: "All features from the Connect+ Plan included",
      },
      {
        text: "One-on-One Investor Introductions",
        tooltip: "Personalized introductions to matching investors",
      },
      {
        text: "AI-Powered Pitch Deck Analysis",
        tooltip: "Get AI-driven insights to improve your pitch",
      },
      {
        text: "Featured on Innov8mate Social Media & Blog",
        tooltip: "Gain exposure through our platforms",
      },
    ],
    highlights: [
      { icon: BadgeCheck, text: "Premium support" },
      { icon: Clock, text: "Priority access" },
    ],
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const handleClick = (plan) => {
    setSelectedPlan(plan);
    console.log(plan);
    dispatcher(setPlan(plan));
    dispatcher(setIsAnnualPlan(isAnnual));
    navigate("/payment");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`
                relative 
                bg-white 
              rounded-2xl lg:rounded-3xl
                shadow-lg 
              border
                overflow-hidden
              flex flex-col h-full
                transition-all 
                duration-300 
                hover:shadow-xl 
              hover:-translate-y-1
              ${
                plan.recommended
                  ? "border-orange-500 border-2"
                  : "border-gray-100"
              }
              `}
          >
            {plan.recommended && (
              <div className="absolute -right-11 top-7 bg-orange-500 text-white px-10 py-1 text-xs font-semibold transform rotate-45 shadow-sm">
                Popular
              </div>
            )}

            <div className="p-6 lg:p-8 flex flex-col flex-grow">
              <div className="flex items-start gap-4 mb-5 sm:mb-6">
                <div
                  className={`p-2 sm:p-2.5 rounded-xl ${
                    plan.recommended ? "bg-orange-100" : "bg-gray-100"
                  }`}
                >
                  <plan.icon
                    className={`w-6 h-6 lg:w-7 lg:h-7 ${
                      plan.recommended ? "text-orange-600" : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                    ₹{isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-sm font-medium text-gray-500">/mo</span>
                </div>
                {isAnnual && (
                  <p className="text-green-600 text-sm font-medium mt-1">
                    Save ₹{(plan.monthlyPrice - plan.annualPrice) * 12}
                    annually
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-5 sm:pt-6 mb-6 sm:mb-8 flex-grow">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                  Includes:
                </h4>
                <ul className="space-y-3 lg:space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-600 leading-snug">
                          {feature.text}
                        </span>
                        <FeatureTooltip text={feature.tooltip} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => handleClick(plan)}
                whileTap={{ scale: 0.98 }}
                className={`
                  mt-auto 
                    w-full 
                  py-3 lg:py-3.5 
                  rounded-xl 
                    font-semibold 
                  text-sm 
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${
                      plan.recommended
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg focus:ring-orange-500"
                        : "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500"
                    }
                  `}
              >
                Get Started with {plan.name}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
