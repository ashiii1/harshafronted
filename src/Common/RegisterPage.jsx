// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import {
//   Camera,
//   Mail,
//   User,
//   Phone,
//   MapPin,
//   Briefcase,
//   GraduationCap,
//   Code,
//   Heart,
//   Github,
//   Linkedin,
//   Twitter,
//   Globe,
//   Save,
// } from "lucide-react";
// import Select from "react-select";
// import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import { Country, State, City } from "country-state-city";

// const RegisterPage = ({ userData = {} }) => {
//   const [profile, setProfile] = useState({
//     firstName: userData.firstName || "",
//     lastName: userData.lastName || "",
//     email: userData.email || "",
//     username: userData.username || "",
//     about: userData.about || "",
//     phoneNumber: userData.phoneNumber || "",
//     country: userData.country || "",
//     street: userData.street || "",
//     city: userData.city || "",
//     state: userData.state || "",
//     pincode: userData.pincode || "",
//     education: userData.education || "",
//     interests: userData.interests || [],
//     skills: userData.skills || [],
//     github: userData.github || "",
//     linkedin: userData.linkedin || "",
//     twitter: userData.twitter || "",
//     website: userData.website || "",
//   });
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);

//   const countryOptions = Country.getAllCountries().map((country) => ({
//     value: country.isoCode,
//     label: country.name,
//   }));

//   const stateOptions = selectedCountry
//     ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
//         value: state.isoCode,
//         label: state.name,
//       }))
//     : [];

//   const cityOptions = selectedState
//     ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
//         (city) => ({
//           value: city.name,
//           label: city.name,
//         })
//       )
//     : [];

//   const customSelectStyles = {
//     control: (provided) => ({
//       ...provided,
//       padding: "6px",
//       borderRadius: "6px",
//       borderColor: "#D1D5DB", // Tailwind gray-300
//       boxShadow: "none",
//       "&:hover": { borderColor: "#FB923C" }, // Tailwind orange-500
//       "&:focus-within": {
//         borderColor: "#FB923C",
//         boxShadow: "0 0 0 2px rgba(251, 146, 60, 0.5)",
//       },
//     }),
//   };

//   const [profileImageUrl, setprofileImageUrl] = useState(userData.profileImageUrl || "");
//   const [imageFile, setImageFile] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleArrayChange = (e, field) => {
//     const values = e.target.value.split(",").map((item) => item.trim());
//     setProfile((prev) => ({
//       ...prev,
//       [field]: values,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setprofileImageUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     // Simulate saving data
//     setTimeout(() => {
//       setSaving(false);
//       // Show success message or redirect
//     }, 1500);

//     // Actual implementation would post to your API
//     // const formData = new FormData();
//     // Object.keys(profile).forEach(key => {
//     //   if (Array.isArray(profile[key])) {
//     //     profile[key].forEach(item => formData.append(key, item));
//     //   } else {
//     //     formData.append(key, profile[key]);
//     //   }
//     // });
//     // if (imageFile) {
//     //   formData.append('profileImageUrl', imageFile);
//     // }
//     // const response = await fetch('/api/profile/update', {
//     //   method: 'POST',
//     //   body: formData,
//     //   credentials: 'include'
//     // });
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//       <div className="p-8">
//         <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h1>
//         <p className="text-gray-600 mb-8">
//           Manage your name, password and account settings.
//         </p>

//         <form onSubmit={handleSubmit}>
//           {/* Profile Photo Section */}
//           <div className="mb-8">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Profile photo
//             </label>
//             <div className="flex items-center">
//               <div className="relative">
//                 {profileImageUrl ? (
//                   <img
//                     src={profileImageUrl}
//                     alt="Profile"
//                     className="w-20 h-20 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
//                     <User className="w-8 h-8 text-gray-400" />
//                   </div>
//                 )}
//                 <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer">
//                   <Camera className="w-4 h-4 text-gray-600" />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                   />
//                 </label>
//               </div>
//               <button
//                 type="button"
//                 className="ml-5 text-sm text-blue-600 hover:text-blue-500"
//               >
//                 Upload photo
//               </button>
//             </div>
//           </div>

//           {/* Personal Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 First name
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={profile.firstName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500 "
//                 placeholder="First name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Last name
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={profile.lastName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                 placeholder="Last name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={profile.email}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                   placeholder="email@example.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Username
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   name="username"
//                   value={profile.username}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                   placeholder="username"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* About Section */}
//           <div className="mb-8">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Bio
//             </label>
//             <textarea
//               name="about"
//               value={profile.about}
//               onChange={handleChange}
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//               placeholder="Type your message..."
//             ></textarea>
//           </div>

//           {/* Contact Information */}
//           <div className="mb-8">
//             <h2 className="text-lg font-medium text-gray-800 mb-4">
//               Contact Information
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number
//                 </label>
//                 <PhoneInput
//                   international
//                   defaultCountry="US"
//                   value={profile.phoneNumber}
//                   onChange={(value) => {
//                     setProfile((prev) => ({
//                       ...prev,
//                       phoneNumber: value || "",
//                     }));
//                   }}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                 />
//               </div>

//               {/* Country Select */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Country
//                 </label>
//                 <Select
//                   options={countryOptions}
//                   value={selectedCountry}
//                   onChange={(selected) => {
//                     setSelectedCountry(selected);
//                     setSelectedState(null); // Reset state when country changes
//                     setProfile((prev) => ({
//                       ...prev,
//                       country: selected.label,
//                       state: "",
//                       city: "",
//                     }));
//                   }}
//                   placeholder="Select Country"
//                   styles={customSelectStyles}
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Street Address
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="street"
//                     value={profile.street}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                     placeholder="Street address"
//                   />
//                 </div>
//               </div>

//               {/* City Select */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   City
//                 </label>
//                 <Select
//                   options={cityOptions}
//                   value={cityOptions.find(
//                     (city) => city.label === profile.city
//                   )}
//                   onChange={(selected) => {
//                     setProfile((prev) => ({
//                       ...prev,
//                       city: selected.label,
//                     }));
//                   }}
//                   placeholder="Select City"
//                   isDisabled={!selectedState}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   State
//                 </label>
//                 <Select
//                   options={stateOptions}
//                   value={selectedState}
//                   onChange={(selected) => {
//                     setSelectedState(selected);
//                     setProfile((prev) => ({
//                       ...prev,
//                       state: selected.label,
//                       city: "",
//                     }));
//                   }}
//                   placeholder="Select State"
//                   isDisabled={!selectedCountry}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   ZIP / Postal code
//                 </label>
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={profile.pincode}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                   placeholder="Postal code"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Professional Information */}
//           <div className="mb-8">
//             <h2 className="text-lg font-medium text-gray-800 mb-4">
//               Professional Information
//             </h2>

//             <div className="grid grid-cols-1 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Education
//                 </label>
//                 <div className="relative">
//                   <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="education"
//                     value={profile.education}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                     placeholder="Your highest education qualification"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Skills
//                 </label>
//                 <div className="relative">
//                   <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="skills"
//                     value={profile.skills.join(", ")}
//                     onChange={(e) => handleArrayChange(e, "skills")}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                     placeholder="Enter skills separated by commas (e.g. JavaScript, UI Design, Marketing)"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Interests
//                 </label>
//                 <div className="relative">
//                   <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="interests"
//                     value={profile.interests.join(", ")}
//                     onChange={(e) => handleArrayChange(e, "interests")}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                     placeholder="Enter interests separated by commas (e.g. AI, Startups, Innovation)"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Social Media */}
//           <div className="mb-8">
//             <h2 className="text-lg font-medium text-gray-800 mb-4">
//               Social Media
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   GitHub
//                 </label>
//                 <div className="relative">
//                   <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="github"
//                     value={profile.github}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                     placeholder="github.com/username"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   LinkedIn
//                 </label>
//                 <div className="relative">
//                   <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="linkedin"
//                     value={profile.linkedin}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                     placeholder="linkedin.com/in/username"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Twitter
//                 </label>
//                 <div className="relative">
//                   <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="twitter"
//                     value={profile.twitter}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                     placeholder="twitter.com/username"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Website
//                 </label>
//                 <div className="relative">
//                   <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="website"
//                     value={profile.website}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//                     placeholder="yourwebsite.com"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-md text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center"
//               disabled={saving}
//             >
//               {saving ? (
//                 <>
//                   <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="mr-2 h-4 w-4" />
//                   Save changes
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;

import React, { useState, useEffect } from "react";
import {
  Camera,
  Mail,
  User,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Save,
  Award,
  DollarSign,
  Target,
  Clock,
  Map,
  Zap,
  Users,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Country, State, City } from "country-state-city";

const RegisterPage = ({ userData = {} }) => {
  // Main profile state
  const [profile, setProfile] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    username: userData.username || "",
    about: userData.about || "",
    phoneNumber: userData.phoneNumber || "",
    country: userData.country || "",
    street: userData.street || "",
    city: userData.city || "",
    state: userData.state || "",
    pincode: userData.pincode || "",
    education: userData.education || "",
    workExperience: userData.workExperience || [],
    interests: userData.interests || [],
    skills: userData.skills || [],
    github: userData.github || "",
    linkedin: userData.linkedin || "",
    twitter: userData.twitter || "",
    website: userData.website || "",

    // User types
    userTypes: userData.userTypes || [],

    // Role-specific profiles
    profiles: {
      innovator: userData.profiles?.innovator || {
        ideaStage: "",
        sectorsOfFocus: [],
        pitchDeck: "",
        fundingNeeds: 0,
        teamSize: 0,
      },
      investor: userData.profiles?.investor || {
        investmentRange: { min: 0, max: 0 },
        sectorsOfInterest: [],
        previousInvestments: [],
        investmentStage: [],
      },
      collaborator: userData.profiles?.collaborator || {
        expertise: [],
        availabilityType: "",
        remotePreference: "",
        compensationPreference: "",
      },
      jobSeeker: userData.profiles?.jobSeeker || {
        desiredRoles: [],
        experienceLevel: "",
        desiredCompensation: { min: 0, max: 0 },
        willRelocate: false,
        remotePreference: "",
      },
    },
  });

  // UI States
  const [activeSection, setActiveSection] = useState("basic");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [profileImageUrl, setprofileImageUrl] = useState(
    userData.profileImageUrl || ""
  );
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [experienceIndex, setExperienceIndex] = useState(null);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // New experience form state
  const [newExperience, setNewExperience] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  });

  // Options for selects
  const roleOptions = [
    {
      value: "innovator",
      label: "Innovator",
      icon: <Zap size={16} className="mr-2" />,
    },
    {
      value: "investor",
      label: "Investor",
      icon: <DollarSign size={16} className="mr-2" />,
    },
    {
      value: "collaborator",
      label: "Collaborator",
      icon: <Users size={16} className="mr-2" />,
    },
    {
      value: "job_seeker",
      label: "Job Seeker",
      icon: <Briefcase size={16} className="mr-2" />,
    },
  ];

  const ideaStageOptions = [
    { value: "concept", label: "Concept" },
    { value: "mvp", label: "MVP" },
    { value: "beta", label: "Beta" },
    { value: "launched", label: "Launched" },
  ];

  const availabilityOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "advisory", label: "Advisory" },
  ];

  const remoteOptions = [
    { value: "remote", label: "Remote" },
    { value: "on-site", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const compensationOptions = [
    { value: "equity", label: "Equity" },
    { value: "salary", label: "Salary" },
    { value: "both", label: "Both" },
  ];

  const experienceLevelOptions = [
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "executive", label: "Executive" },
  ];

  const investmentStageOptions = [
    { value: "pre-seed", label: "Pre-seed" },
    { value: "seed", label: "Seed" },
    { value: "series-a", label: "Series A" },
    { value: "series-b", label: "Series B" },
    { value: "series-c", label: "Series C+" },
  ];

  // Country, state, city options
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    : [];

  const cityOptions = selectedState
    ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
        (city) => ({
          value: city.name,
          label: city.name,
        })
      )
    : [];

  // Select styles
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      padding: "6px",
      borderRadius: "6px",
      borderColor: "#D1D5DB",
      boxShadow: "none",
      "&:hover": { borderColor: "#FB923C" },
      "&:focus-within": {
        borderColor: "#FB923C",
        boxShadow: "0 0 0 2px rgba(251, 146, 60, 0.5)",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      backgroundColor: state.isSelected ? "#FB923C" : provided.backgroundColor,
      "&:hover": {
        backgroundColor: state.isSelected ? "#FB923C" : "#FFE4CC",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#FFE4CC",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#FB923C",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "#FB923C",
        color: "white",
      },
    }),
  };

  // Initialize country and state from userData if available
  useEffect(() => {
    if (userData.country) {
      const country = countryOptions.find((c) => c.label === userData.country);
      if (country) {
        setSelectedCountry(country);
      }
    }
    if (userData.state && selectedCountry) {
      const state = stateOptions.find((s) => s.label === userData.state);
      if (state) {
        setSelectedState(state);
      }
    }
  }, [countryOptions, stateOptions]);

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => {
      // Ensure we always create a new object instead of mutating the previous state directly
      const newProfile = JSON.parse(JSON.stringify(prev));

      // Handle nested profile properties
      if (name.includes(".")) {
        const keys = name.split(".");
        let obj = newProfile;

        // Iterate through keys except the last one
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {}; // Ensure object exists
          obj = obj[keys[i]];
        }

        obj[keys[keys.length - 1]] = value;
      } else {
        newProfile[name] = value;
      }

      return newProfile; // Return new updated state
    });
  };

  const handleSelectChange = (selected, { name }) => {
    setProfile((prev) => {
      const newProfile = { ...prev };

      // Handle nested profile properties
      if (name.includes(".")) {
        const [section, subsection, field] = name.split(".");
        newProfile[section][subsection][field] = selected
          ? Array.isArray(selected)
            ? selected.map((item) => item.value)
            : selected.value
          : Array.isArray(newProfile[section][subsection][field])
          ? []
          : "";
      } else {
        newProfile[name] = selected
          ? Array.isArray(selected)
            ? selected.map((item) => item.value)
            : selected.value
          : Array.isArray(newProfile[name])
          ? []
          : "";
      }

      return newProfile;
    });
  };

  const handleRoleChange = (selected) => {
    const roles = selected ? selected.map((item) => item.value) : [];
    setProfile((prev) => ({
      ...prev,
      userTypes: roles,
    }));
  };

  const handleRangeChange = (name, key, value) => {
    setProfile((prev) => {
      const newProfile = { ...prev };

      // Handle nested profile properties
      if (name.includes(".")) {
        const [section, subsection, field] = name.split(".");
        newProfile[section][subsection][field][key] = parseInt(value, 10) || 0;
      } else {
        newProfile[name][key] = parseInt(value, 10) || 0;
      }

      return newProfile;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setprofileImageUrl(URL.createObjectURL(file));
    }
  };

  // Work Experience Handlers
  const handleAddExperience = () => {
    setExperienceIndex(null);
    setNewExperience({
      company: "",
      role: "",
      duration: "",
      description: "",
    });
    setShowExperienceForm(true);
  };

  const handleEditExperience = (index) => {
    setExperienceIndex(index);
    setNewExperience(profile.workExperience[index]);
    setShowExperienceForm(true);
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveExperience = () => {
    if (!newExperience.company || !newExperience.role) {
      setFormErrors({
        ...formErrors,
        workExperience: "Company and Role are required",
      });
      return;
    }

    const updatedExperiences = [...profile.workExperience];

    if (experienceIndex !== null) {
      // Edit existing experience
      updatedExperiences[experienceIndex] = newExperience;
    } else {
      // Add new experience
      updatedExperiences.push(newExperience);
    }

    setProfile((prev) => ({
      ...prev,
      workExperience: updatedExperiences,
    }));

    setShowExperienceForm(false);
    setFormErrors({
      ...formErrors,
      workExperience: null,
    });
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = [...profile.workExperience];
    updatedExperiences.splice(index, 1);

    setProfile((prev) => ({
      ...prev,
      workExperience: updatedExperiences,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Validate form
    const errors = {};
    if (!profile.email) errors.email = "Email is required";
    if (!profile.username) errors.username = "Username is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSaving(false);
      return;
    }

    // Simulate saving data
    setTimeout(() => {
      setSaving(false);
      alert("Profile saved successfully!");
      // Show success message or redirect
    }, 1500);

    // Actual implementation would post to your API
    // const formData = new FormData();
    // // Flatten the profile data
    // Object.keys(profile).forEach(key => {
    //   if (typeof profile[key] === 'object' && profile[key] !== null && !Array.isArray(profile[key])) {
    //     // Handle nested objects
    //     Object.keys(profile[key]).forEach(nestedKey => {
    //       if (typeof profile[key][nestedKey] === 'object' && profile[key][nestedKey] !== null) {
    //         // Stringify nested objects
    //         formData.append(`${key}.${nestedKey}`, JSON.stringify(profile[key][nestedKey]));
    //       } else {
    //         formData.append(`${key}.${nestedKey}`, profile[key][nestedKey]);
    //       }
    //     });
    //   } else if (Array.isArray(profile[key])) {
    //     // Handle arrays
    //     if (key === 'workExperience') {
    //       formData.append(key, JSON.stringify(profile[key]));
    //     } else {
    //       profile[key].forEach(item => formData.append(key, item));
    //     }
    //   } else {
    //     formData.append(key, profile[key]);
    //   }
    // });
    // if (imageFile) {
    //   formData.append('profileImageUrl', imageFile);
    // }
    // const response = await fetch('/api/profile/register', {
    //   method: 'POST',
    //   body: formData,
    //   credentials: 'include'
    // });
  };

  // Section component
  const Section = ({ id, title, icon, children }) => {
    const isActive = activeSection === id;

    return (
      <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => setActiveSection(isActive ? null : id)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center text-lg font-medium text-gray-800">
            {icon}
            <span className="ml-2">{title}</span>
          </div>
          {isActive ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isActive && <div className="p-5">{children}</div>}
      </div>
    );
  };

  // Progress indicator
  const ProgressIndicator = () => {
    const totalSections = 6;
    const completedSections = Object.keys(profile).filter((key) => {
      if (key === "userTypes" && profile[key].length > 0) return true;
      if (key === "profiles") {
        return profile.userTypes.some((type) => {
          const sectionKeys = Object.keys(profile.profiles[type] || {});
          return sectionKeys.some((k) => profile.profiles[type][k]);
        });
      }
      return (
        profile[key] &&
        (typeof profile[key] === "string" ||
          (Array.isArray(profile[key]) && profile[key].length > 0) ||
          (typeof profile[key] === "object" &&
            Object.keys(profile[key]).length > 0))
      );
    }).length;

    const percentage = Math.min(
      Math.round((completedSections / totalSections) * 100),
      100
    );

    return (
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            Profile completion
          </span>
          <span className="text-sm font-medium text-gray-700">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to Innov8mate
        </h1>
        <p className="text-gray-600 mb-6">
          Complete your profile to get started with innovation, collaboration,
          and funding opportunities.
        </p>

        <ProgressIndicator />

        <form onSubmit={handleSubmit}>
          {/* Profile Photo & Basic Info */}
          <Section
            id="basic"
            title="Basic Information"
            icon={<User className="h-5 w-5 text-orange-500" />}
          >
            <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
              {/* Profile Photo */}
              <div className="w-full md:w-1/4 flex flex-col items-center">
                <div className="relative">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-orange-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-orange-50 flex items-center justify-center border-4 border-orange-100">
                      <User className="w-16 h-16 text-orange-300" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-orange-50 transition-colors">
                    <Camera className="w-5 h-5 text-orange-500" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Upload a professional profile photo
                </p>
              </div>

              {/* Basic Info Fields */}
              <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={(e) => e.target.value}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="Last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        formErrors.username
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500`}
                      placeholder="username"
                    />
                  </div>
                  {formErrors.username && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.username}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                placeholder="Tell us about yourself, your background, and what you hope to achieve with Innov8mate..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                A compelling bio helps others understand your expertise and
                goals
              </p>
            </div>
          </Section>

          {/* Roles Section */}
          <Section
            id="roles"
            title="Your Roles"
            icon={<Layers className="h-5 w-5 text-orange-500" />}
          >
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Select all the roles that describe how you want to engage with
                the platform. Each role unlocks specific features.
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am joining Innov8mate as a:
              </label>

              <Select
                isMulti
                options={roleOptions}
                value={roleOptions.filter((option) =>
                  profile.userTypes.includes(option.value)
                )}
                onChange={handleRoleChange}
                styles={customSelectStyles}
                formatOptionLabel={({ label, icon }) => (
                  <div className="flex items-center">
                    {icon}
                    {label}
                  </div>
                )}
                placeholder="Select your roles"
                className="mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {roleOptions.map((role) => (
                  <div
                    key={role.value}
                    className={`p-4 rounded-lg border-2 ${
                      profile.userTypes.includes(role.value)
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                    } transition-all duration-300`}
                  >
                    <div className="flex items-center">
                      {role.icon}
                      <h3 className="font-medium text-gray-800">
                        {role.label}
                      </h3>
                      {profile.userTypes.includes(role.value) && (
                        <Check className="ml-auto h-5 w-5 text-orange-500" />
                      )}
                    </div>

                    <p className="text-sm mt-2 text-gray-600">
                      {role.value === "innovator" &&
                        "Share ideas, find team members, and get funded"}
                      {role.value === "investor" &&
                        "Discover promising startups and support innovation"}
                      {role.value === "collaborator" &&
                        "Join exciting projects and contribute your skills"}
                      {role.value === "job_seeker" &&
                        "Find positions in innovative startups and companies"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Contact Information */}
          <Section
            id="contact"
            title="Contact Information"
            icon={<Phone className="h-5 w-5 text-orange-500" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={profile.phoneNumber}
                  onChange={(value) => {
                    setProfile((prev) => ({
                      ...prev,
                      phoneNumber: value || "",
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                />
              </div>

              {/* Country Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Select
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={(selected) => {
                    setSelectedCountry(selected);
                    setSelectedState(null); // Reset state when country changes
                    setProfile((prev) => ({
                      ...prev,
                      country: selected.label,
                      state: "",
                      city: "",
                    }));
                  }}
                  placeholder="Select Country"
                  styles={customSelectStyles}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="street"
                    value={profile.street}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="Street address"
                  />
                </div>
              </div>

              {/* State Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State / Province
                </label>
                <Select
                  options={stateOptions}
                  value={selectedState}
                  onChange={(selected) => {
                    setSelectedState(selected);
                    setProfile((prev) => ({
                      ...prev,
                      state: selected.label,
                      city: "",
                    }));
                  }}
                  placeholder="Select State"
                  styles={customSelectStyles}
                  isDisabled={!selectedCountry}
                />
              </div>

              {/* City Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Select
                  options={cityOptions}
                  value={
                    cityOptions.find(
                      (option) => option.label === profile.city
                    ) || null
                  }
                  onChange={(selected) => {
                    setProfile((prev) => ({
                      ...prev,
                      city: selected.label,
                    }));
                  }}
                  placeholder="Select City"
                  styles={customSelectStyles}
                  isDisabled={!selectedState}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal / Zip Code
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={profile.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                  placeholder="Postal / Zip code"
                />
              </div>
            </div>
          </Section>

          {/* Professional Section */}
          <Section
            id="professional"
            title="Professional Information"
            icon={<Briefcase className="h-5 w-5 text-orange-500" />}
          >
            <div className="space-y-6">
              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="Highest degree, University name"
                  />
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Work Experience
                  </label>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="inline-flex items-center px-3 py-1 border border-orange-500 text-sm font-medium rounded text-orange-600 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <Briefcase className="h-4 w-4 mr-1" />
                    Add Experience
                  </button>
                </div>

                {formErrors.workExperience && (
                  <div className="flex items-center mb-2 p-2 bg-red-50 text-red-600 rounded">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{formErrors.workExperience}</span>
                  </div>
                )}

                {/* Experience Form */}
                {showExperienceForm && (
                  <div className="mb-4 p-4 border border-orange-200 bg-orange-50 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={newExperience.company}
                          onChange={handleExperienceChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          name="role"
                          value={newExperience.role}
                          onChange={handleExperienceChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                          placeholder="Your role"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={newExperience.duration}
                        onChange={handleExperienceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                        placeholder="e.g. Jan 2020 - Present"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newExperience.description}
                        onChange={handleExperienceChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                        placeholder="Brief description of your responsibilities and achievements"
                      ></textarea>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowExperienceForm(false)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveExperience}
                        className="px-3 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {/* Experience List */}
                <div className="space-y-3">
                  {profile.workExperience.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No work experience added yet.
                    </p>
                  ) : (
                    profile.workExperience.map((exp, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-200 rounded-md bg-gray-50"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {exp.role}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {exp.company}
                            </p>
                            <p className="text-xs text-gray-500">
                              {exp.duration}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleEditExperience(index)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-sm text-gray-700 mt-1">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <CreatableSelect
                  isMulti
                  options={[]}
                  onChange={(selected) =>
                    setProfile((prev) => ({
                      ...prev,
                      skills: selected
                        ? selected.map((item) => item.value)
                        : [],
                    }))
                  }
                  value={profile.skills.map((skill) => ({
                    value: skill,
                    label: skill,
                  }))}
                  styles={customSelectStyles}
                  placeholder="Add your skills"
                  className="mb-1"
                />
                <p className="text-xs text-gray-500">
                  Type and press Enter to add custom skills
                </p>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <CreatableSelect
                  isMulti
                  options={[]}
                  onChange={(selected) =>
                    setProfile((prev) => ({
                      ...prev,
                      interests: selected
                        ? selected.map((item) => item.value)
                        : [],
                    }))
                  }
                  value={profile.interests.map((interest) => ({
                    value: interest,
                    label: interest,
                  }))}
                  styles={customSelectStyles}
                  placeholder="Add your interests"
                  className="mb-1"
                />
                <p className="text-xs text-gray-500">
                  Type and press Enter to add personal or professional interests
                </p>
              </div>
            </div>
          </Section>

          {/* Social Links */}
          <Section
            id="social"
            title="Social & Portfolio Links"
            icon={<Globe className="h-5 w-5 text-orange-500" />}
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="github"
                    value={profile.github}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="twitter"
                    value={profile.twitter}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Role-Specific Sections */}
          {/* Only show relevant sections based on selected user types */}

          {/* Innovator Section */}
          {profile.userTypes.includes("innovator") && (
            <Section
              id="innovator"
              title="Innovator Profile"
              icon={<Zap className="h-5 w-5 text-orange-500" />}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Idea Stage
                  </label>
                  <Select
                    options={ideaStageOptions}
                    value={
                      ideaStageOptions.find(
                        (option) =>
                          option.value === profile.profiles.innovator.ideaStage
                      ) || null
                    }
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.innovator.ideaStage",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Select your idea stage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sectors of Focus
                  </label>
                  <CreatableSelect
                    isMulti
                    options={[
                      { value: "fintech", label: "FinTech" },
                      { value: "healthtech", label: "HealthTech" },
                      { value: "edtech", label: "EdTech" },
                      { value: "climate", label: "Climate Tech" },
                      { value: "ai", label: "AI & Machine Learning" },
                    ]}
                    value={profile.profiles.innovator.sectorsOfFocus.map(
                      (sector) => ({ value: sector, label: sector })
                    )}
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.innovator.sectorsOfFocus",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Add sectors your idea addresses"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Do you have a pitch deck?
                  </label>
                  <select
                    name="profiles.innovator.pitchDeck"
                    value={profile.profiles.innovator.pitchDeck}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes, ready to share</option>
                    <option value="in-progress">Working on it</option>
                    <option value="no">Not yet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Funding Needs (USD)
                  </label>
                  <input
                    type="number"
                    name="profiles.innovator.fundingNeeds"
                    value={profile.profiles.innovator.fundingNeeds}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Team Size
                  </label>
                  <input
                    type="number"
                    name="profiles.innovator.teamSize"
                    value={profile.profiles.innovator.teamSize}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                    placeholder="Number of team members"
                    min="0"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* Investor Section */}
          {profile.userTypes.includes("investor") && (
            <Section
              id="investor"
              title="Investor Profile"
              icon={<DollarSign className="h-5 w-5 text-orange-500" />}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Range (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Min
                      </label>
                      <input
                        type="number"
                        value={profile.profiles.investor.investmentRange.min}
                        onChange={(e) =>
                          handleRangeChange(
                            "profiles.investor.investmentRange",
                            "min",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                        placeholder="Minimum"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Max
                      </label>
                      <input
                        type="number"
                        value={profile.profiles.investor.investmentRange.max}
                        onChange={(e) =>
                          handleRangeChange(
                            "profiles.investor.investmentRange",
                            "max",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                        placeholder="Maximum"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sectors of Interest
                  </label>
                  <CreatableSelect
                    isMulti
                    options={[
                      { value: "fintech", label: "FinTech" },
                      { value: "healthtech", label: "HealthTech" },
                      { value: "edtech", label: "EdTech" },
                      { value: "climate", label: "Climate Tech" },
                      { value: "ai", label: "AI & Machine Learning" },
                    ]}
                    value={profile.profiles.investor.sectorsOfInterest.map(
                      (sector) => ({ value: sector, label: sector })
                    )}
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.investor.sectorsOfInterest",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Add sectors you're interested in"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Investment Stages
                  </label>
                  <Select
                    isMulti
                    options={investmentStageOptions}
                    value={investmentStageOptions.filter((option) =>
                      profile.profiles.investor.investmentStage.includes(
                        option.value
                      )
                    )}
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.investor.investmentStage",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Select investment stages"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Investments (Optional)
                  </label>
                  <CreatableSelect
                    isMulti
                    options={[]}
                    value={profile.profiles.investor.previousInvestments.map(
                      (inv) => ({ value: inv, label: inv })
                    )}
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.investor.previousInvestments",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Add previous investments"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter names of companies you've invested in
                  </p>
                </div>
              </div>
            </Section>
          )}

          {/* Collaborator Section */}
          {profile.userTypes.includes("collaborator") && (
            <Section
              id="collaborator"
              title="Collaborator Profile"
              icon={<Users className="h-5 w-5 text-orange-500" />}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Areas of Expertise
                  </label>
                  <CreatableSelect
                    isMulti
                    options={[
                      {
                        value: "software_development",
                        label: "Software Development",
                      },
                      {
                        value: "product_management",
                        label: "Product Management",
                      },
                      { value: "design", label: "Design" },
                      { value: "marketing", label: "Marketing" },
                      { value: "data_science", label: "Data Science" },
                    ]}
                    value={profile.profiles.collaborator.expertise.map(
                      (exp) => ({ value: exp, label: exp })
                    )}
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.collaborator.expertise",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Add your areas of expertise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <Select
                    options={availabilityOptions}
                    value={
                      availabilityOptions.find(
                        (option) =>
                          option.value ===
                          profile.profiles.collaborator.availabilityType
                      ) || null
                    }
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.collaborator.availabilityType",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Select your availability"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remote Preference
                  </label>
                  <Select
                    options={remoteOptions}
                    value={
                      remoteOptions.find(
                        (option) =>
                          option.value ===
                          profile.profiles.collaborator.remotePreference
                      ) || null
                    }
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.collaborator.remotePreference",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Select remote preference"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compensation Preference
                  </label>
                  <Select
                    options={compensationOptions}
                    value={
                      compensationOptions.find(
                        (option) =>
                          option.value ===
                          profile.profiles.collaborator.compensationPreference
                      ) || null
                    }
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.collaborator.compensationPreference",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Select compensation preference"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* Job Seeker Section */}
          {profile.userTypes.includes("job_seeker") && (
            <Section
              id="job_seeker"
              title="Job Seeker Profile"
              icon={<Briefcase className="h-5 w-5 text-orange-500" />}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desired Roles
                  </label>
                  <CreatableSelect
                    isMulti
                    options={[
                      {
                        value: "software_engineer",
                        label: "Software Engineer",
                      },
                      { value: "product_manager", label: "Product Manager" },
                      { value: "designer", label: "Designer" },
                      { value: "marketing", label: "Marketing Specialist" },
                      { value: "data_scientist", label: "Data Scientist" },
                    ]}
                    value={profile.profiles.jobSeeker.desiredRoles.map(
                      (role) => ({ value: role, label: role })
                    )}
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.jobSeeker.desiredRoles",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Add roles you're seeking"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <Select
                    options={experienceLevelOptions}
                    value={
                      experienceLevelOptions.find(
                        (option) =>
                          option.value ===
                          profile.profiles.jobSeeker.experienceLevel
                      ) || null
                    }
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.jobSeeker.experienceLevel",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Select your experience level"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desired Compensation (USD/year)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Min
                      </label>
                      <input
                        type="number"
                        value={
                          profile.profiles.jobSeeker.desiredCompensation.min
                        }
                        onChange={(e) =>
                          handleRangeChange(
                            "profiles.jobSeeker.desiredCompensation",
                            "min",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                        placeholder="Minimum"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Max
                      </label>
                      <input
                        type="number"
                        value={
                          profile.profiles.jobSeeker.desiredCompensation.max
                        }
                        onChange={(e) =>
                          handleRangeChange(
                            "profiles.jobSeeker.desiredCompensation",
                            "max",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                        placeholder="Maximum"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remote Preference
                  </label>
                  <Select
                    options={remoteOptions}
                    value={
                      remoteOptions.find(
                        (option) =>
                          option.value ===
                          profile.profiles.jobSeeker.remotePreference
                      ) || null
                    }
                    onChange={(selected) =>
                      handleSelectChange(selected, {
                        name: "profiles.jobSeeker.remotePreference",
                      })
                    }
                    styles={customSelectStyles}
                    placeholder="Select remote preference"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="willRelocate"
                    checked={profile.profiles.jobSeeker.willRelocate}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        profiles: {
                          ...prev.profiles,
                          jobSeeker: {
                            ...prev.profiles.jobSeeker,
                            willRelocate: e.target.checked,
                          },
                        },
                      }));
                    }}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="willRelocate"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I am willing to relocate for the right opportunity
                  </label>
                </div>
              </div>
            </Section>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={saving}
              className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                saving ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RegisterPage;
