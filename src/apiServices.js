import { API_URL } from "./Utils/constants";
import axios from "axios";

export const launchDate = async () => {
  try {
    const response = await axios.get(`${API_URL}/review/launch_date`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching launch date:", error);
    throw error;
  }
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const fetchUser = async () => {
  try {
    const response = await api.get(`/user/profile`, { withCredentials: true });
    return response?.data?.data;
  } catch (error) {
    console.error("User fetch error:", error);
    throw error;
  }
};

export const fetchIdea = async (id) => {
  try {
    const response = await api.get(`/ideas/${id}`, {
      // headers: { "Use-Redis-Cache": "true" },
      withCredentials: true,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching idea:", error);
    throw error;
  }
};

export const fetchRelatedIdeas = async (tags, id) => {
  if (!tags || tags.length === 0) return [];
  try {
    const response = await api.get(`/ideas/related`, {
      params: { tags: tags.join(","), excludeId: id },
      // headers: { "Use-Redis-Cache": "true" },
      withCredentials: true,
    });
    return response?.data?.data?.slice(0, 3);
  } catch (error) {
    console.error("Error fetching related ideas:", error);
    return [];
  }
};

export const handleLike = async (id, liked) => {
  try {
    const endpoint = liked ? "unlike" : "like";
    await api.post(`/ideas/${id}/${endpoint}`, {});

    await api.post(`/ideas/cache/invalidate`, {
      keys: [`idea:${id}`],
    });

    return !liked;
  } catch (error) {
    console.error("Error updating like:", error);
    throw error;
  }
};

export const handleBookmark = async (id, bookmarked) => {
  try {
    const endpoint = bookmarked ? "unbookmark" : "bookmark";
    await api.post(`/ideas/${id}/${endpoint}`, {});
    return !bookmarked;
  } catch (error) {
    console.error("Error updating bookmark:", error);
    throw error;
  }
};

export const initiateSupport = async (
  id,
  supportType,
  message,
  notifyOwner,
  supported
) => {
  try {
    const endpoint = supported ? "update-support" : "support";
    await api.post(`/ideas/${id}/${endpoint}`, {
      supportType,
      message,
      notifyOwner,
    });

    await api.post(`/ideas/cache/invalidate`, {
      keys: [`idea:${id}`],
    });

    return true;
  } catch (error) {
    console.error("Error updating support:", error);
    throw error;
  }
};

export const handleUnsupport = async (id) => {
  try {
    await api.post(`/ideas/${id}/unsupport`, {});

    await api.post(`/ideas/cache/invalidate`, {
      keys: [`idea:${id}`],
    });

    return false;
  } catch (error) {
    console.error("Error removing support:", error);
    throw error;
  }
};

// --- Helper Function for API Requests ---

/**
 * Performs a fetch request with common settings.
 * @param {string} endpoint - The API endpoint (e.g., '/signin').
 * @param {RequestInit} options - Fetch options (method, body, etc.).
 * @param {boolean} includeCredentials - Whether to include credentials. Defaults to true.
 * @returns {Promise<any>} - The JSON response data.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
const apiRequest = async (
  endpoint,
  options = {},
  includeCredentials = true
) => {
  const url = `${API_URL}${endpoint}`; // Construct full URL

  const defaultHeaders = {
    "Content-Type": "application/json",
    // Add other common headers if needed (e.g., Authorization if we store a token)
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (includeCredentials) {
    config.credentials = "include";
  }

  try {
    const response = await fetch(url, config);

    // Attempt to parse JSON regardless of status, as errors might be in the body
    let responseData;
    try {
      // Handle cases where response might be empty (e.g., 204 No Content)
      const text = await response.text();
      responseData = text ? JSON.parse(text) : null;
    } catch (jsonError) {
      // If JSON parsing fails, maybe it wasn't JSON or was empty
      console.warn(
        `Could not parse JSON response from ${endpoint}:`,
        jsonError
      );
      responseData = null; // Treat as no data
    }

    if (!response.ok) {
      // Throw an error that includes status and potential message from backend
      const error = new Error(
        responseData?.message ||
          responseData?.error ||
          `HTTP error! Status: ${response.status}`
      );
      error.status = response.status;
      error.data = responseData; // Attach full data for more context
      throw error;
    }

    return responseData; // Return parsed JSON data on success
  } catch (networkError) {
    // Handle network errors (fetch failure)
    console.error(`Network error calling ${endpoint}:`, networkError);
    // Re-throw a more specific error or a generic one
    throw new Error(
      `Network error when trying to reach the server. Please check your connection.`
    );
  }
};

// --- Authentication Services ---

export const signInUser = async (email, password) => {
  return apiRequest("/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const signUpUser = async (email, username, password) => {
  return apiRequest("/signup", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
};

// Assuming Google Auth might eventually call a backend endpoint
// export const authenticateWithGoogle = async (googleToken) => {
//   return apiRequest('/auth/google', {
//     method: 'POST',
//     body: JSON.stringify({ token: googleToken }),
//   });
// };

export const userLogout = async () => {
  // Logout endpoint might just need a POST request with credentials
  // Adjust if your backend expects something different
  return apiRequest("/logout", {
    method: "POST",
  });
};

// --- Password Reset Services ---

export const requestPasswordReset = async (email) => {
  return apiRequest("/password/reset", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// Add function for submitting the *new* password with token later
// export const resetPasswordWithToken = async (token, newPassword) => {
//   return apiRequest(`/password/reset/${token}`, { // Example endpoint
//     method: 'POST',
//     body: JSON.stringify({ password: newPassword }),
//     includeCredentials: false // Might not need credentials here
//   });
// };

// --- Review Services ---

export const fetchReviewsApi = async () => {
  // GET request, no body needed
  return apiRequest("/review/", {
    method: "GET",
  });
};

// --- User Profile Services ---

export const fetchUserProfile = async (userId) => {
  if (!userId) throw new Error("User ID is required to fetch profile.");
  // Use the axios instance 'api' if it handles credentials/base URL
  // Or use apiRequest helper if standard fetch is preferred
  try {
    const response = await api.get(`/user/profile/${userId}`);
    console.log("response", response); // Assuming endpoint structure
    return response?.data?.data; // Adjust based on actual response structure
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    // Re-throw a more specific error message if possible
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch user profile."
    );
  }
};

// --- Other Potential Services (Add as needed) ---

// export const fetchUserProfile = async (userId) => {
//   return apiRequest(`/users/${userId}`, { method: 'GET' });
// };

// export const updateUserProfile = async (userId, profileData) => {
//   return apiRequest(`/users/${userId}`, {
//     method: 'PUT',
//     body: JSON.stringify(profileData),
//   });
// };

// export const fetchProjects = async (params) => {
//   const queryString = new URLSearchParams(params).toString();
//   return apiRequest(`/projects?${queryString}`, { method: 'GET' });
// };
