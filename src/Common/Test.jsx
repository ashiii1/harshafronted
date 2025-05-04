import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  MapPin,
  Briefcase,
  Book,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Phone,
  CheckCircleIcon,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

import PhoneInput from "react-phone-number-input";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import "react-phone-number-input/style.css";
import { API_URL } from "../Utils/constants";
import { useNavigate } from "react-router-dom";

const UserRegistration = () => {
  // State for form navigation
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const totalSteps = 5;
  const navigate = useNavigate();
  useEffect(() => {
    getUserIdFromCookie();
  }, []);
  const getUserIdFromCookie = () => {
    try {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

      if (!tokenCookie) {
        console.warn("Token not found in cookies");
        return;
      }

      const token = tokenCookie.split("=")[1];
      const decoded = jwtDecode(token);
      const id = decoded?.id;

      if (id) {
        console.log("UserID from token:", id);
        setUserId(id); // this will trigger the next useEffect
      }
    } catch (err) {
      console.error("Error decoding JWT:", err);
    }
  };

  useEffect(() => {
    fetchUserById();
  }, [userId]);

  const fetchUserById = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        withCredentials: true,
      });
      console.log("Fetched User:", response.data.data);
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  };

  // Profile image state
  const [profileImageUrl, setprofileImageUrl] = useState(
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  );

  // Work experience state
  const [workExperiences, setWorkExperiences] = useState([
    {
      id: 1,
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    },
  ]);

  // Form data state
  const [formData, setFormData] = useState({
    //email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    education: "",
    about: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    country: "",
    state: "",
    city: "",
    street: "",
    pincode: "",
    interests: [],
    skills: [],
  });

  // User type selection
  const [userTypes, setUserTypes] = useState([]);
  const [profilePreview, setProfilePreview] = useState(profileImageUrl);

  useEffect(() => {
    if (user) {
      const {
        authProvider,
        companyList,
        hackathonList,
        ideaList,
        projectList,
        jobList,
        friendList,
        ...data
      } = user;
      console.log("data", data);
      setFormData({ ...data });
      setprofileImageUrl(user.profileImageUrl || profileImageUrl);
      setProfilePreview(user.profileImageUrl || profileImageUrl);
      setWorkExperiences(user.workExperience || workExperiences);
      setUserTypes(user.userTypes || userTypes);
    }
  }, [user]);

  console.log("userData");
  console.log(";formdata", formData);

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Get countries data
  const countries = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  // Get states based on selected country
  const states = formData.country
    ? State.getStatesOfCountry(formData.country).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    : [];

  // Get cities based on selected country and state
  const cities =
    formData.country && formData.state
      ? City.getCitiesOfState(formData.country, formData.state).map((city) => ({
          value: city.name,
          label: city.name,
        }))
      : [];

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox inputs
  const handleCheckboxChange = (name, e) => {
    const { value, checked } = e.target;
    console.log(name, value, checked);
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...(formData[name] || []), value],
      });
    } else {
      setFormData({
        ...formData,
        [name]: (formData[name] || []).filter((item) => item !== value),
      });
    }
  };

  // Handle phone input
  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
  };
  // Handle profile image change
  const handleprofileImageUrlChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setprofileImageUrl(file);
      const imageUrl = URL.createObjectURL(file);
      setProfilePreview(imageUrl);
    }
  };

  // Handle user type selection
  const handleUserTypeSelection = (type) => {
    if (userTypes.includes(type)) {
      setUserType(userType.filter((t) => t !== type));
    } else {
      setUserTypes([...userTypes, type]);
    }
  };

  // Add work experience
  const addWorkExperience = (e) => {
    e.preventDefault();
    const newId =
      workExperiences.length > 0
        ? Math.max(...workExperiences.map((exp) => exp.id)) + 1
        : 1;

    setWorkExperiences([
      ...workExperiences,
      {
        id: newId,
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
      },
    ]);
  };

  // Remove work experience
  const removeWorkExperience = (id, e) => {
    e && e.preventDefault();
    if (workExperiences.length > 1) {
      setWorkExperiences(workExperiences.filter((exp) => exp.id !== id));
    }
  };

  console.log(userTypes);

  // Update work experience
  const updateWorkExperience = (id, field, value) => {
    console.log(id, field, value);
    console.log(workExperiences);
    setWorkExperiences(
      workExperiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  // Handle current job checkbox
  const handleCurrentJobChange = (id, checked) => {
    setWorkExperiences(
      workExperiences.map((exp) =>
        exp.id === id
          ? { ...exp, current: checked, endDate: checked ? "" : exp.endDate }
          : exp
      )
    );
  };

  // Navigation functions
  const nextStep = () => {
    if (validateCurrentStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    let validationErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.email) {
        validationErrors.email = "Email is required";
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        validationErrors.email = "Valid email is required";
        isValid = false;
      }

      if (!formData.username) {
        validationErrors.username = "Username is required";
        isValid = false;
      } else if (formData.username.length < 3) {
        validationErrors.username = "Username must be at least 3 characters";
        isValid = false;
      }

      // if (!formData.password) {
      //   validationErrors.password = "Password is required";
      //   isValid = false;
      // } else if (formData.password.length < 8) {
      //   validationErrors.password = "Password must be at least 8 characters";
      //   isValid = false;
      // }

      // if (formData.password !== formData.confirmPassword) {
      //   validationErrors.confirmPassword = "Passwords do not match";
      //   isValid = false;
      // }
    }

    setErrors(validationErrors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine all form data
    const finalFormData = {
      ...formData,
      userTypes: userTypes.join(","),
      workExperience: workExperiences,
    };

    console.log(finalFormData);

    try {
      const form = new FormData();

      // Append all fields manually
      form.append("profileImageUrl", profileImageUrl);
      // Append scalar fields
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value); // if any value is an array/object, see below
      });

      // Append `userTypes` (e.g., ['founder', 'investor']) as multiple fields
      userTypes.forEach((type, index) => {
        form.append(`userTypes[${index}]`, type);
      });

      // Append workExperiences as indexed fields
      workExperiences.forEach((exp, index) => {
        Object.entries(exp).forEach(([key, value]) => {
          form.append(`workExperience[${index}][${key}]`, value);
        });
      });

      const response = await axios.patch(`${API_URL}/user/update`, form, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      // Handle successful submission (e.g., redirect to dashboard)
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      // Handle error (e.g., display error message)
    }
  };

  // An array of common interests for dropdown selection
  const interestOptions = [
    "Technology",
    "Startups",
    "AI/ML",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Blockchain",
    "IoT",
    "Cybersecurity",
    "Product Management",
    "UX/UI Design",
    "Marketing",
    "Finance",
    "Healthcare",
    "Education",
    "Sustainability",
  ];

  // An array of common skills for dropdown selection
  const skillOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "Golang",
    "Swift",
    "Product Management",
    "UI/UX Design",
    "Data Analysis",
    "Machine Learning",
    "Digital Marketing",
    "Sales",
    "Project Management",
    "Agile/Scrum",
    "Business Development",
  ];

  // Work Experience Section Component
  const WorkExperienceSection = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Work Experience
      </label>

      {workExperiences.map((experience, index) => (
        <div
          key={experience.id}
          className="mb-4 p-4 border border-gray-300 rounded-md"
        >
          {workExperiences.length > 1 && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={(e) => removeWorkExperience(experience.id, e)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label
                htmlFor={`company-${experience.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Company
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id={`company-${experience.id}`}
                  value={experience.company}
                  onChange={(e) =>
                    updateWorkExperience(
                      experience.id,
                      "company",
                      e.target.value
                    )
                  }
                  type="text"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={`role-${experience.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                role
              </label>
              <input
                id={`role-${experience.id}`}
                value={experience.role}
                onChange={(e) =>
                  updateWorkExperience(experience.id, "role", e.target.value)
                }
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm placeholder-gray-500"
                placeholder="Job title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label
                htmlFor={`startDate-${experience.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                id={`startDate-${experience.id}`}
                value={
                  experience.startDate ? experience.startDate.slice(0, 7) : ""
                }
                onChange={(e) =>
                  updateWorkExperience(
                    experience.id,
                    "startDate",
                    e.target.value
                  )
                }
                type="month"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm placeholder-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor={`endDate-${experience.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                id={`endDate-${experience.id}`}
                value={experience.endDate ? experience.endDate.slice(0, 7) : ""}
                onChange={(e) =>
                  updateWorkExperience(experience.id, "endDate", e.target.value)
                }
                type="month"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm placeholder-gray-500"
                disabled={experience.currentlyWorking}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center">
              <input
                id={`currentlyWorking-${experience.id}`}
                checked={experience.currentlyWorking}
                onChange={(e) =>
                  handleCurrentJobChange(experience.id, e.target.checked)
                }
                type="checkbox"
                className="h-4 w-4 text-black-600 focus:ring-black-500 border-gray-300 rounded placeholder-gray-500"
              />
              <label
                htmlFor={`currentlyWorking-${experience.id}`}
                className="ml-2 block text-sm text-gray-700"
              >
                I currently work here
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor={`description-${experience.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id={`description-${experience.id}`}
              value={experience.description}
              onChange={(e) =>
                updateWorkExperience(
                  experience.id,
                  "description",
                  e.target.value
                )
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm"
              placeholder="Describe your responsibilities and achievements..."
              // Added explicit onFocus to maintain focus
              onFocus={(e) => e.currentTarget.focus()}
            ></textarea>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addWorkExperience}
        className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Another Experience
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-lg shadow-md center">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Join Innov8mate
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your Partner in Innovation
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-orange-500 h-2.5 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span
            className={`text-sm ${
              step >= 1 ? "text-gray-800 font-medium" : "text-gray-500"
            }`}
          >
            Basic Info
          </span>
          <span
            className={`text-sm ${
              step >= 2 ? "text-gray-800 font-medium" : "text-gray-500"
            }`}
          >
            Profile Details
          </span>
          <span
            className={`text-sm ${
              step >= 3 ? "text-gray-800 font-medium" : "text-gray-500"
            }`}
          >
            Location
          </span>
          <span
            className={`text-sm ${
              step >= 4 ? "text-gray-800 font-medium" : "text-gray-500"
            }`}
          >
            Interests & Skills
          </span>
          <span
            className={`text-sm ${
              step >= 5 ? "text-gray-800 font-medium" : "text-gray-500"
            }`}
          >
            User Type
          </span>
        </div>

        <div className="mt-8 space-y-6">
          {/* Step 1: Basic Information */}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Create Your Account
              </h3>

              <div className="flex flex-col items-center mb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-300">
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                    Change
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleprofileImageUrlChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">Profile Photo</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email{formData.email}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500 bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="you@example.com"
                      value={formData.email}
                      readOnly
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username<span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>

              {/* New Field: Vision for 5-10 years */}
              <div>
                <label
                  htmlFor="vision"
                  className="block text-sm font-medium text-gray-700"
                >
                  What do you want to achieve in 5–10 years?
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="vision"
                  name="vision"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                  placeholder="Tell us about your personal vision, goals, or ambitions..."
                  value={formData.vision}
                  onChange={handleInputChange}
                />
                {errors.vision && (
                  <p className="mt-1 text-sm text-red-600">{errors.vision}</p>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  By creating an account, you agree to our Terms of Service and
                  Privacy Policy.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Profile Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Profile Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Education
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Book className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="education"
                      name="education"
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                      placeholder="Bachelor's in Computer Science"
                      value={formData.education}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700"
                >
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className=" block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                  placeholder="Tell us a bit about yourself..."
                  value={formData.about}
                  onChange={handleInputChange}
                  onFocus={(e) => e.currentTarget.focus()}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="github"
                    className="block text-sm font-medium text-gray-700"
                  >
                    GitHub Profile
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Github className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="github"
                      name="github"
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                      placeholder="github.com/username"
                      value={formData.github}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    LinkedIn Profile
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Linkedin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                      placeholder="linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="twitter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Twitter Profile
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Twitter className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="twitter"
                      name="twitter"
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                      placeholder="twitter.com/username"
                      value={formData.twitter}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Personal Website
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Location</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                    value={formData.state}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a state</option>
                    {states.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <select
                    id="city"
                    name="city"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                    value={formData.city}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font
                    -medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500 sm:text-sm placeholder-gray-500"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Interests & Skills */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Interests & Skills
              </h3>

              <div>
                <label
                  htmlFor="interests"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Your Interests
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Choose areas you're interested in
                </p>
                <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {interestOptions.map((interest, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`interest-${index}`}
                        value={interest}
                        className="h-4 w-4 text-black-600 focus:ring-black-500 border-gray-300 rounded  placeholder-gray-500"
                        checked={formData.interests.includes(interest)}
                        onChange={(e) => handleCheckboxChange("interests", e)}
                      />
                      <label
                        htmlFor={`interest-${index}`}
                        className="ml-2 text-sm font-medium text-gray-700"
                      >
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Your Skills
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Choose skills you're proficient in
                </p>
                <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skillOptions.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`skill-${index}`}
                        value={skill}
                        className="h-4 w-4 text-black-600 focus:ring-black-500 border-gray-300 rounded  placeholder-gray-500"
                        checked={formData.skills.includes(skill)}
                        onChange={(e) => handleCheckboxChange("skills", e)}
                      />
                      <label
                        htmlFor={`skill-${index}`}
                        className="ml-2 text-sm font-medium text-gray-700"
                      >
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <WorkExperienceSection />
            </div>
          )}

          {/* Step 5: User Type */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                What brings you to Innov8mate?
              </h3>
              <p className="text-sm text-gray-500">
                Select one or more roles that describe you (you can change this
                later)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer hover:border-black-500 transition-colors ${
                    userTypes.includes("innovator")
                      ? "border-black bg-gray-100 text-red-500"
                      : "border-gray-300 text-red-500"
                  }`}
                  onClick={() => handleUserTypeSelection("innovator")}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-gray-900">
                      Innovator
                    </h4>
                    {userTypes.includes("innovator") && (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    I want to contribute to the startup ecosystem
                  </p>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer hover:border-black-500 transition-colors ${
                    userTypes.includes("entrepreneur")
                      ? "border-black bg-gray-100 text-white"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleUserTypeSelection("entrepreneur")}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-gray-900">
                      Entrepreneur
                    </h4>
                    {userTypes.includes("entrepreneur") && (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    I want to start my own startup or grow my existing business
                  </p>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer hover:border-black-500 transition-colors ${
                    userTypes.includes("investor")
                      ? "border-black bg-gray-100 text-white"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleUserTypeSelection("investor")}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-gray-900">
                      Investor
                    </h4>
                    {userTypes.includes("investor") && (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    I want to invest in startups and innovative projects
                  </p>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer hover:border-black-500 transition-colors ${
                    userTypes.includes("mentor")
                      ? "border-black bg-gray-100 text-white"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleUserTypeSelection("mentor")}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-gray-900">
                      Mentor
                    </h4>
                    {userTypes.includes("mentor") && (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    I want to mentor and guide aspiring entrepreneurs
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </button>
            ) : (
              <div></div> // Empty div to maintain spacing
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg flex items-center font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserRegistration;
