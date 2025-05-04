import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import GoogleAuth from "./GoogleAuth.jsx";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice";
import { signInUser, signUpUser } from "../apiServices";

// Component to render input fields with icons and error handling
const FormInput = ({
  id,
  type,
  placeholder,
  icon: Icon,
  register,
  error,
  inputProps = {},
}) => (
  <div>
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
        <Icon size={20} />
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border placeholder-gray-500 focus:ring-2 transition-all duration-200 text-sm sm:text-base text-gray-800 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
            : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      {/* Specific handling for password show/hide toggle */}
      {id === "password" && inputProps.toggleButton}
    </div>
    {error && (
      <p
        id={`${id}-error`}
        className="mt-1.5 text-red-500 text-xs sm:text-sm flex items-center gap-1"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        {error.message}
      </p>
    )}
  </div>
);

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch, // Watch password field if needed for confirm password
  } = useForm({
    mode: "onBlur", // Validate on blur
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      let responseData;
      if (isSignIn) {
        // Use signInUser service
        responseData = await signInUser(data.email, data.password);
        dispatch(addUser(responseData.user)); // Assuming responseData contains user
        navigate("/home");
      } else {
        // Use signUpUser service
        responseData = await signUpUser(
          data.email,
          data.username,
          data.password
        );
        // On successful signup, switch to sign-in view and maybe show a success message (optional)
        setIsSignIn(true);
        // Or display a message: setApiSuccess("Account created! Please sign in.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      // Display error message from the thrown error in apiServices
      setApiError(error.message || "An unexpected error occurred.");
    }
  };

  return (
    // Enhanced background and layout
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 px-4 py-12 sm:py-16">
      {/* Added subtle animation */}
      <div className="w-full max-w-md animate-fade-in-slow">
        {/* Enhanced card styling */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10">
          <div className="text-center mb-6 sm:mb-8">
            {/* Responsive heading */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isSignIn ? "Welcome Back!" : "Create Your Account"}
            </h2>
            {/* Responsive text */}
            <p className="text-sm sm:text-base text-gray-500">
              {isSignIn
                ? "Sign in to continue your innovation journey."
                : "Join Innov8mate and start collaborating."}
            </p>
          </div>

          {/* Google Auth */}
          <div className="mb-5 sm:mb-6">
            <GoogleAuth isSignIn={isSignIn} /> {/* Pass state to GoogleAuth */}
          </div>

          {/* Divider */}
          <div className="relative mb-5 sm:mb-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            {/* Email */}
            <FormInput
              id="email"
              type="email"
              placeholder="Email address"
              icon={Mail}
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              error={errors.email}
            />

            {/* Username (Sign Up only) */}
            {!isSignIn && (
              <FormInput
                id="username"
                type="text"
                placeholder="Username"
                icon={User}
                register={register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                })}
                error={errors.username}
              />
            )}

            {/* Password */}
            <FormInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              icon={Lock}
              register={register("password", {
                required: "Password is required",
                minLength: {
                  value: isSignIn ? 1 : 8, // No minLength check on signin
                  message: "Password must be at least 8 characters",
                },
                validate: isSignIn
                  ? undefined
                  : {
                      // No complex validation on signin
                      hasUpperCase: (value) =>
                        /[A-Z]/.test(value) ||
                        "Must include at least one uppercase letter",
                      hasLowerCase: (value) =>
                        /[a-z]/.test(value) ||
                        "Must include at least one lowercase letter",
                      hasNumber: (value) =>
                        /[0-9]/.test(value) ||
                        "Must include at least one number",
                    },
              })}
              error={errors.password}
              inputProps={{
                toggleButton: (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                ),
              }}
            />

            {/* Forgot Password Link (Sign In only) */}
            {isSignIn && (
              <div className="text-right">
                <Link
                  to="/password-reset" // Link to the password reset page
                  className="text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs sm:text-sm flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span>
                    {isSignIn ? "Signing in..." : "Creating account..."}
                  </span>
                </>
              ) : isSignIn ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Between Sign In/Up */}
          <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignIn(!isSignIn);
                setApiError(null); // Clear API error when toggling
              }}
              className="font-semibold text-orange-500 hover:text-orange-600 hover:underline focus:outline-none focus:underline"
            >
              {isSignIn ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
