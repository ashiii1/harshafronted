import Navbar from "./components/Home/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./components/Home/Footer";
import axios from "axios";
import { addUser } from "./Utils/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import useOneline from "./Utils/hooks/useOnline.js";
import { API_URL } from "./Utils/constants.js";
import { useNavigate } from "react-router-dom";

// Error Boundary Component (as a functional component with React.Component)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Something went wrong
          </h1>
          <p className="text-red-500 mb-4">
            An unexpected error occurred. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Layout Component
const AppLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isOnline = useOneline();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      // Don't attempt to navigate if already loading user data
      if (user?._id) {
        console.log("user", user);
        setIsLoading(false);
        return; // Exit early if user is already logged in
      }

      const response = await axios.get(`${API_URL}/user/profile`, {
        withCredentials: true,
      });

      console.log(response);

      if (response?.data?.data) {
        dispatch(addUser(response.data.data));
        setIsLoading(false);
      } else {
        // It's not necessarily an error if no user data - could be not logged in
        navigate("/signup");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("User fetch error:", err);
      // Don't set error state for auth errors - just finish loading
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        setIsLoading(false);
      } else {
        setError(err);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Loading Overlay Component
  const LoadingOverlay = () => (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Loading</h3>
        <p className="mt-1 text-sm text-gray-500">This won't take long.</p>
      </div>
    </div>
  );

  const OfflineNotice = () => (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="text-center">
        <p className="text-3xl mb-4">🔴 Offline</p>
        <p className="text-xl text-gray-600">
          Please check your internet connection
        </p>
      </div>
    </div>
  );

  // Render logic
  if (!isOnline) {
    return <OfflineNotice />;
  }

  if (error) {
    console.error("AppLayout encountered error:", error);
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 min-h-[calc(100vh-100px)] bg-gray-50">
          {isLoading ? <LoadingOverlay /> : <Outlet />}
        </main>
        {/* <Footer /> */}
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;
