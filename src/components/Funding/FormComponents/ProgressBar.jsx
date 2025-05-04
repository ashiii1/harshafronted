/* eslint-disable react/prop-types */
import React from "react";
import { cva } from "class-variance-authority";
import {
  CheckCircle,
  AlertCircle,
  UserCircle,
  FileText,
  Settings,
  Briefcase,
  CreditCard,
  Database,
  ListChecks,
  Upload,
} from "lucide-react";

// Step status variants
const stepStatusVariants = cva(
  "flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 relative",
  {
    variants: {
      status: {
        completed: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
        current:
          "bg-white border-2 border-orange-500 text-orange-600 shadow-lg shadow-orange-100",
        upcoming: "bg-gray-700 text-gray-400 border border-gray-600",
        error: "bg-red-100 text-red-600 border border-red-300",
      },
      size: {
        default: "w-10 h-10",
        large: "w-12 h-12",
      },
    },
    defaultVariants: {
      status: "upcoming",
      size: "default",
    },
  }
);

// Step label variants
const stepLabelVariants = cva(
  "text-sm font-medium transition-all duration-300 whitespace-nowrap",
  {
    variants: {
      status: {
        completed: "text-white",
        current: "text-orange-400 font-semibold",
        upcoming: "text-gray-400",
        error: "text-red-400",
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  }
);

// Default step icons if not provided
const defaultIcons = {
  1: UserCircle,
  2: FileText,
  3: Settings,
  4: Briefcase,
  5: Database,
  6: CreditCard,
  7: Upload,
  8: ListChecks,
  9: CheckCircle,
};

const ProgressBar = ({
  steps,
  currentStep,
  errors,
  layout = "vertical",
  showLabels = true,
  onStepClick,
  size,
  className,
}) => {
  // Generate default steps if none provided
  const formSteps =
    steps.length > 0
      ? steps
      : Array.from({ length: 9 }, (_, i) => ({
          id: i + 1,
          name: `Step ${i + 1}`,
          icon: defaultIcons[i + 1] || FileText,
        }));

  // Calculate progress percentage
  const progressPercentage = Math.min(
    100,
    ((currentStep - 1) / (formSteps.length - 1)) * 100
  );

  // For the last step, ensure it's 100%
  const adjustedProgressPercentage =
    currentStep >= formSteps.length ? 100 : progressPercentage;

  // Determine if step layout should be vertical or horizontal
  const isVertical = layout === "vertical";

  const getStepStatus = (stepId) => {
    if (errors && errors[stepId]) return "error";
    if (currentStep > stepId) return "completed";
    if (currentStep === stepId) return "current";
    return "upcoming";
  };

  return (
    <div className={`${className} ${isVertical ? "h-full" : ""}`}>
      <div
        className={`relative ${
          isVertical
            ? "flex flex-col space-y-6"
            : "flex items-start justify-between"
        }`}
      >
        {/* Step connector line */}
        <div
          className={`absolute ${
            isVertical
              ? "left-5 top-0 h-full w-0.5 bg-gray-700"
              : "left-0 top-5 h-0.5 w-full bg-gray-700"
          }`}
        >
          <div
            className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500 ease-in-out"
            style={{
              width: isVertical ? "100%" : `${adjustedProgressPercentage}%`,
              height: isVertical ? `${adjustedProgressPercentage}%` : "100%",
            }}
          ></div>
        </div>

        {/* Steps */}
        {formSteps.map((step) => {
          const status = getStepStatus(step.id);
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={`
                relative z-10
                ${
                  isVertical
                    ? "flex items-center"
                    : "flex flex-col items-center"
                }
                ${isVertical ? "" : "w-full"}
              `}
            >
              <button
                onClick={() =>
                  onStepClick && currentStep > step.id && onStepClick(step.id)
                }
                disabled={!onStepClick || currentStep < step.id}
                className={`
                  group
                  ${stepStatusVariants({ status, size })}
                  ${
                    onStepClick && currentStep > step.id
                      ? "cursor-pointer hover:scale-110"
                      : ""
                  }
                `}
                aria-current={currentStep === step.id ? "step" : undefined}
              >
                {status === "completed" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : status === "error" ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}

                {/* Tooltip on hover */}
                {!showLabels && (
                  <span
                    className={`
                    absolute ${
                      isVertical ? "left-14" : "top-12"
                    } bg-gray-800 text-white text-xs
                    rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity
                    pointer-events-none
                  `}
                  >
                    {step.name}
                  </span>
                )}
              </button>

              {showLabels && (
                <span
                  className={`text-sm
                  ${stepLabelVariants({ status })}
                  ${isVertical ? "ml-4" : "mt-2"}
                `}
                >
                  {step.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Details (Only show in dark background if explicitly requested) */}
      {className.includes("bg-transparent") ? null : (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formSteps[currentStep - 1]?.name || `Step ${currentStep}`}
              </h3>
              {formSteps[currentStep - 1]?.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {formSteps[currentStep - 1].description}
                </p>
              )}
            </div>
            <div className="text-sm font-medium text-gray-500">
              {currentStep} of {formSteps.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
