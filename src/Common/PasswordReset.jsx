import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, AlertCircle, Loader2 } from "lucide-react";
import { requestPasswordReset } from "../apiServices";

// Reusable FormInput component for consistency
const FormInput = React.forwardRef(
  (
    { icon: Icon, label, id, error, alertText = "Invalid input", ...props },
    ref
  ) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          id={id}
          ref={ref}
          {...props}
          className={`w-full py-3 rounded-xl border placeholder-gray-500 focus:ring focus:ring-opacity-50 transition-all text-gray-800 ${
            Icon ? "pl-11 pr-4" : "px-4" // Adjust padding based on icon presence
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-orange-500 focus:ring-orange-200"
          }`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-red-500 text-xs flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error.message || alertText}
        </p>
      )}
    </div>
  )
);
FormInput.displayName = "FormInput"; // Add display name for React DevTools

const PasswordReset = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // Add reset to clear form
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePasswordResetRequest = async (data) => {
    setError(null);
    setSuccess(null);
    try {
      console.log("Requesting password reset for:", data.email);
      await requestPasswordReset(data.email);
      setSuccess(
        "Password reset link sent successfully! Please check your email inbox (and spam folder)."
      );
      reset(); // Clear the form on success
    } catch (err) {
      console.error("Password reset request failed:", err);
      setError(err.message || "Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Added space-y-8 for spacing between elements */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            Forgot Your Password?
          </h2>
          <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
            No problem! Enter your email address below and we'll send you a link
            to reset it.
          </p>

          {/* Display Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2 transition-opacity duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {success}
            </div>
          )}

          {/* Display Error Message */}
          {error &&
            !success && ( // Only show error if there's no success message
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 transition-opacity duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

          {/* Show form only if success message is not displayed */}
          {!success && (
            <form
              // Use the renamed handler
              onSubmit={handleSubmit(handlePasswordResetRequest)}
              className="space-y-6" // Increased spacing
            >
              <FormInput
                id="email"
                type="email"
                placeholder="Enter your email address"
                icon={Mail}
                error={errors.email}
                alertText={
                  errors.email?.message || "Please enter a valid email"
                }
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Standard email pattern
                    message: "Invalid email address format",
                  },
                })}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending
                    Link...
                  </>
                ) : (
                  "Send Password Reset Link"
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Remember your password? {/* Use Link component */}
            <Link
              to="/signin" // Ensure this route matches your router setup
              className="font-medium text-orange-600 hover:text-orange-500 hover:underline focus:outline-none focus:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
