import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Utils/constants";

const GOOGLE_CLIENT_ID =
  "984573641146-39mve29435gc6hk3ndooehl9oiukjukg.apps.googleusercontent.com";

const GoogleSignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google) {
      console.error("Google API not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
    });

    const container = document.getElementById("google-button");
    if (container) {
      window.google.accounts.id.renderButton(container, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        logo_alignment: "center",
      });
    } else {
      console.error("Google button container not found!");
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      console.error("Invalid Google Sign-In response");
      return;
    }
    console.log(response.credential);

    try {
      const { data } = await axios.post(
        `${API_URL}/google/verify`,
        { credential: response.credential },
        { withCredentials: true } // Ensuring cookies are stored
      );
      navigate("/home");
    } catch (error) {
      console.error(
        "Google sign-in failed:",
        error.response?.data || error.message
      );
    }
  };

  return <div id="google-button"></div>;
};

export default GoogleSignIn;
