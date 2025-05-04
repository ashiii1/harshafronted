/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import {
  Upload,
  Linkedin,
  Globe,
  Check,
  ChevronRight,
  Briefcase,
  Target,
  DollarSign as DollarSignLucide,
  Calendar,
  Users,
  FileText as FileTextLucide,
  Link2,
  ShieldCheck,
  Info,
  Loader2,
  User as UserLucide,
  Rocket,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { API_URL } from "../../Utils/constants";

import axios from "axios";
import BasicInfo from "./FormComponents/BasicInfo";
import FounderDetails from "./FormComponents/FounderDetails";
import TeamInfo from "./FormComponents/TeamInfo";
import BusinessDetails from "./FormComponents/BusinessDetails";
import Financials from "./FormComponents/Financials";
import MarketTraction from "./FormComponents/MarketTraction";
import DigitalPresence from "./FormComponents/DigitalPresence";
import FuturePlansVision from "./FormComponents/FuturePlansVision";
import Compliance from "./FormComponents/Compliance";
import DocumentsUpload from "./FormComponents/DocumentsUpload";
import ReviewSubmit from "./FormComponents/ReviewSubmit";
import ProgressBar from "./FormComponents/ProgressBar";
import { defaultCompanyData } from "../../Utils/constants";

// --- Zod Schemas for Validation ---

// Helper for optional number preprocessing
const optionalStringToNumber = z.preprocess(
  (val) =>
    val === "" || val === null || val === undefined ? undefined : Number(val),
  z.number({ invalid_type_error: "Must be a number" }).optional()
);

// Helper for optional positive number
const optionalPositiveNumber = optionalStringToNumber.refine(
  (val) => val === undefined || val > 0,
  { message: "Must be positive if provided" }
);

// Helper for optional percentage
const optionalPercentage = optionalStringToNumber.refine(
  (val) => val === undefined || (val >= 0 && val <= 100),
  { message: "Must be between 0 and 100 if provided" }
);

const basicInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  tagline: z.string().optional(),
  pitch: z.string().max(300, "Pitch cannot exceed 300 characters").optional(),
  sector: z.string().min(1, "Sector is required"),
  industry: z.string().min(1, "Industry is required"),
  stage: z.string().min(1, "Stage is required"),
  foundedDate: z.string().optional(), // Could add date validation
  location: z.string().min(1, "Location is required"),
  estimatedValuation: optionalPositiveNumber,
});

const founderDetailsSchema = z.object({
  founderName: z.string().min(1, "Founder name is required"),
  founderEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Founder email is required"),
  founderPhone: z.string().optional(), // Could add phone format validation
  founderLinkedIn: z.string().url("Invalid LinkedIn URL").optional(),
  founderBio: z.string().max(1000).optional(),
  founderExperience: z.string().max(1500).optional(),
  founderAchievements: z.string().max(1000).optional(),
  founderEducation: z
    .array(
      z.object({
        degree: z.string().optional(),
        college: z.string().optional(),
      })
    )
    .optional(),
});

const teamInfoSchema = z.object({
  teamSize: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().int().positive("Team size must be a positive number")
  ),
  keyTeamMembers: z
    .array(
      z.object({
        name: z.string().optional(),
        role: z.string().optional(),
        experience: z.string().max(300).optional(),
        // image validation handled separately
      })
    )
    .optional(),
  advisors: z
    .array(
      z.object({
        name: z.string().optional(),
        expertise: z.string().optional(),
        affiliation: z.string().optional(),
        // image validation handled separately
      })
    )
    .optional(),
});

const businessDetailsSchema = z.object({
  companyDescription: z
    .string()
    .min(50, "Company description is required (min 50 characters)")
    .max(2000),
  problemStatement: z
    .string()
    .min(50, "Problem statement is required (min 50 characters)")
    .max(1500),
  solution: z
    .string()
    .min(50, "Solution description is required (min 50 characters)")
    .max(1500),
  productServiceDetails: z
    .string()
    .min(50, "Product/Service details are required (min 50 characters)")
    .max(2000),
  keyFeatures: z.array(z.string().max(100)).max(10).optional(),
  technologyStack: z.array(z.string().max(100)).max(10).optional(),
  businessModel: z.string().min(20, "Business model is required").max(1000),
  revenueModel: z.string().min(20, "Revenue model is required").max(1000),
  pricingStrategy: z.string().max(1000).optional(),
});

const marketTractionSchema = z.object({
  targetMarket: z
    .string()
    .min(20, "Target market description is required")
    .max(1500),
  marketSize: z
    .object({
      tam: z.string().optional(),
      sam: z.string().optional(),
      som: z.string().optional(),
    })
    .optional(),
  customerAcquisition: z
    .string()
    .min(20, "Customer acquisition strategy is required")
    .max(1500),
  tractionMetrics: z
    .object({
      mau: optionalPositiveNumber,
      mrr: optionalPositiveNumber,
      churnRate: optionalPercentage,
      clv: optionalPositiveNumber,
      cac: optionalPositiveNumber,
    })
    .optional(),
  otherMetricsNotes: z.string().max(1000).optional(),
  competitiveLandscape: z
    .string()
    .min(20, "Competitive landscape is required")
    .max(1500),
  competitiveAdvantage: z
    .string()
    .min(20, "Competitive advantage is required")
    .max(1500),
});

const financialsSchema = z.object({
  fundingAmountSought: optionalPositiveNumber.refine(
    (val) => val !== undefined,
    {
      message: "Funding amount is required",
    }
  ),
  fundingStagePreferred: z
    .array(z.string())
    .min(1, "Select at least one preferred stage"),
  fundingUse: z
    .string()
    .min(20, "Use of funds description is required")
    .max(1000),
  currentRevenue: optionalPositiveNumber,
  revenueProjection: optionalPositiveNumber,
  capitalStructure: z.string().max(500).optional(),
  previousFunding: z
    .array(
      z.object({
        round: z.string().optional(),
        date: z.string().optional(),
        amount: optionalPositiveNumber,
        investors: z.string().optional(),
      })
    )
    .optional(),
});

const futurePlansVisionSchema = z.object({
  visionStatement: z.string().min(20, "Vision statement is required").max(1000),
  productRoadmap: z
    .string()
    .min(20, "Product roadmap overview is required")
    .max(2000),
  marketExpansion: z
    .string()
    .min(20, "Market expansion plans are required")
    .max(1500),
  exitStrategy: z.string().max(1000).optional(),
});

const digitalPresenceSchema = z.object({
  website: z.string().url("Invalid URL").min(1, "Website URL is required"),
  socialMedia: z
    .object({
      // linkedIn: z.string().url("Invalid URL").optional(),
      // twitter: z.string().url("Invalid URL").optional(),
      // facebook: z.string().url("Invalid URL").optional(),
      // instagram: z.string().url("Invalid URL").optional(),
      // other: z.string().url("Invalid URL").optional(),
      linkedIn: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
  pressMentions: z
    .array(
      z.object({
        title: z.string().optional(),
        url: z.string().url("Invalid URL").optional(),
      })
    )
    .optional(),
});

const complianceSchema = z.object({
  legalName: z.string().min(1, "Legal name is required"),
  registrationNumber: z.string().optional(),
  licensesCertifications: z.string().max(500).optional(),
  ipStatus: z.string().max(500).optional(),
  regulatoryComplianceConfirmation: z.boolean().refine((val) => val === true, {
    message: "Confirmation of compliance is required",
  }),
});

const documentsUploadSchema = z.object({
  pitchDeck: z.any().refine((val) => val !== null && val !== undefined, {
    message: "Pitch deck is required",
  }),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

// Combine all schemas
const validationSchemas = {
  1: basicInfoSchema,
  2: founderDetailsSchema,
  3: teamInfoSchema,
  4: businessDetailsSchema,
  5: marketTractionSchema,
  6: financialsSchema,
  7: futurePlansVisionSchema,
  8: digitalPresenceSchema,
  9: complianceSchema,
  10: documentsUploadSchema,
  // No validation needed for step 11 (Review)
};

// --- End Zod Schemas ---

const FounderForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [fileCache, setFileCache] = useState({}); // Cache to store File objects
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    total: 0,
    completed: 0,
    failed: 0,
  });
  const [fileResourceTracker, setFileResourceTracker] = useState({});
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [fileSignatures] = useState(new Map());

  const [formData, setFormData] = useState(() => {
    const initialData = JSON.parse(JSON.stringify(defaultCompanyData));

    // Initialize arrays properly
    initialData.founderEducation = Array.isArray(initialData.founderEducation)
      ? initialData.founderEducation
      : [];

    initialData.keyTeamMembers = Array.isArray(initialData.keyTeamMembers)
      ? initialData.keyTeamMembers.map((member) => ({
          name: "",
          role: "",
          experience: "",
          image: null,
          ...member,
        }))
      : [];

    initialData.advisors = Array.isArray(initialData.advisors)
      ? initialData.advisors.map((advisor) => ({
          name: "",
          expertise: "",
          affiliation: "",
          image: null,
          ...advisor,
        }))
      : [];

    initialData.keyFeatures = Array.isArray(initialData.keyFeatures)
      ? initialData.keyFeatures
      : [];

    initialData.technologyStack = Array.isArray(initialData.technologyStack)
      ? initialData.technologyStack
      : [];

    initialData.fundingStagePreferred = Array.isArray(
      initialData.fundingStagePreferred
    )
      ? initialData.fundingStagePreferred
      : [];

    initialData.previousFunding = Array.isArray(initialData.previousFunding)
      ? initialData.previousFunding.map((funding) => ({
          round: "",
          date: "",
          amount: "",
          investors: "",
          ...funding,
        }))
      : [];

    initialData.pressMentions = Array.isArray(initialData.pressMentions)
      ? initialData.pressMentions.map((mention) => ({
          title: "",
          url: "",
          ...mention,
        }))
      : [];

    initialData.otherDocuments = Array.isArray(initialData.otherDocuments)
      ? initialData.otherDocuments
      : [];

    // Initialize revenue data for charts
    initialData.revenueData = Array.isArray(initialData.revenueData)
      ? initialData.revenueData
      : [];

    // Initialize objects
    initialData.socialMedia = {
      linkedIn: "",
      twitter: "",
      facebook: "",
      instagram: "",
      other: "",
      ...(initialData.socialMedia || {}),
    };

    initialData.marketSize = {
      tam: "",
      sam: "",
      som: "",
      ...(initialData.marketSize || {}),
    };

    initialData.tractionMetrics = {
      mau: "",
      mrr: "",
      churnRate: "",
      clv: "",
      cac: "",
      ...(initialData.tractionMetrics || {}),
    };

    // Initialize other fields with default values
    const stringFields = [
      "targetMarket",
      "customerAcquisition",
      "competitiveLandscape",
      "competitiveAdvantage",
      "companyDescription",
      "problemStatement",
      "solution",
      "productServiceDetails",
      "businessModel",
      "revenueModel",
      "pricingStrategy",
      "fundingAmountSought",
      "fundingUse",
      "website",
      "legalStructure",
      "ipStatus",
      "regulatoryCompliance",
    ];

    stringFields.forEach((field) => {
      initialData[field] = initialData[field] || "";
    });

    // Boolean fields
    initialData.termsAgreed = !!initialData.termsAgreed;

    return initialData;
  });

  useEffect(() => {
    const savedData = localStorage.getItem("companyFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Fix marketSize saved as a plain string in old localStorage entries
        if (
          parsedData.marketSize &&
          typeof parsedData.marketSize === "string"
        ) {
          parsedData.targetMarket = parsedData.marketSize;
          delete parsedData.marketSize;
        }
        // Fix malformed marketSize objects from old storage (spread string into object)
        if (
          parsedData.marketSize &&
          typeof parsedData.marketSize === "object" &&
          Object.keys(parsedData.marketSize).some((k) => /^\d+$/.test(k))
        ) {
          // Reconstruct full string from numeric keys
          const indices = Object.keys(parsedData.marketSize)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => +a - +b);
          const fullText = indices
            .map((i) => parsedData.marketSize[i])
            .join("");
          // Assign to targetMarket if not already present
          if (!parsedData.targetMarket) parsedData.targetMarket = fullText;
          delete parsedData.marketSize;
        }
        if (
          parsedData.tractionMetrics &&
          typeof parsedData.tractionMetrics === "string"
        ) {
          // Remove malformed tractionMetrics strings so defaults apply
          delete parsedData.tractionMetrics;
        }
        setFormData((prevData) => {
          const merged = { ...prevData };

          // Merge in the saved data but preserve any file objects in current state
          Object.keys(parsedData).forEach((key) => {
            // Don't overwrite file objects in memory with null/undefined from storage
            if (!(merged[key] instanceof File) || parsedData[key] !== null) {
              merged[key] = parsedData[key];
            }
          });

          // Ensure arrays are properly initialized and merged
          for (const key of [
            "founderEducation",
            "keyTeamMembers",
            "advisors",
            "keyFeatures",
            "technologyStack",
            "fundingStagePreferred",
            "previousFunding",
            "pressMentions",
            "otherDocuments",
          ]) {
            if (parsedData[key] && Array.isArray(parsedData[key])) {
              // If we have array items in the current state that have File objects,
              // preserve those files when merging the arrays
              if (Array.isArray(merged[key]) && merged[key].length > 0) {
                // Create a new array where items from parsedData replace items in merged
                // except for properties that are File objects
                merged[key] = parsedData[key].map((item, i) => {
                  if (merged[key][i] && typeof merged[key][i] === "object") {
                    const mergedItem = { ...item };
                    // Preserve any File objects from the current state
                    Object.keys(merged[key][i]).forEach((prop) => {
                      if (merged[key][i][prop] instanceof File) {
                        mergedItem[prop] = merged[key][i][prop];
                      }
                    });
                    return mergedItem;
                  }
                  return item;
                });
              } else {
                merged[key] = parsedData[key];
              }
            } else if (!Array.isArray(merged[key])) {
              merged[key] = [];
            }
          }

          // Handle nested objects
          for (const key of ["socialMedia", "marketSize", "tractionMetrics"]) {
            if (parsedData[key] && typeof parsedData[key] === "object") {
              merged[key] = {
                ...(merged[key] || {}),
                ...parsedData[key],
              };
            }
          }

          return merged;
        });
      } catch (error) {
        console.error("Failed to parse saved form data:", error);
        localStorage.removeItem("companyFormData");
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = { ...formData };

    // Handle top-level File objects (like companyLogo, founderImage)
    Object.keys(dataToSave).forEach((key) => {
      if (dataToSave[key] instanceof File) {
        // If we already have a string URL or null, keep that instead of the File object
        if (typeof localStorage.getItem("companyFormData") === "string") {
          try {
            const existingData = JSON.parse(
              localStorage.getItem("companyFormData")
            );
            if (typeof existingData[key] === "string") {
              dataToSave[key] = existingData[key];
            } else {
              delete dataToSave[key];
            }
          } catch (e) {
            delete dataToSave[key];
          }
        } else {
          delete dataToSave[key];
        }
      }
    });

    // Handle File objects inside arrays (like team member/advisor images)
    if (Array.isArray(dataToSave.keyTeamMembers)) {
      dataToSave.keyTeamMembers = dataToSave.keyTeamMembers.map((item) => {
        const itemCopy = { ...item };
        // For team member images
        if (itemCopy.image instanceof File) {
          // Try to preserve the URL if it existed before
          try {
            const existingData = JSON.parse(
              localStorage.getItem("companyFormData") || "{}"
            );
            const existingTeamMembers = existingData.keyTeamMembers || [];
            // Find a matching team member by name or other criteria
            const existingMember = existingTeamMembers.find(
              (m) => m.name === itemCopy.name && m.role === itemCopy.role
            );

            if (existingMember && typeof existingMember.image === "string") {
              itemCopy.image = existingMember.image;
            } else {
              delete itemCopy.image;
            }
          } catch (e) {
            delete itemCopy.image;
          }
        }
        return itemCopy;
      });
    }

    if (Array.isArray(dataToSave.advisors)) {
      dataToSave.advisors = dataToSave.advisors.map((item) => {
        const itemCopy = { ...item };
        // For advisor images
        if (itemCopy.image instanceof File) {
          // Try to preserve the URL if it existed before
          try {
            const existingData = JSON.parse(
              localStorage.getItem("companyFormData") || "{}"
            );
            const existingAdvisors = existingData.advisors || [];
            // Find a matching advisor by name or other criteria
            const existingAdvisor = existingAdvisors.find(
              (a) =>
                a.name === itemCopy.name && a.expertise === itemCopy.expertise
            );

            if (existingAdvisor && typeof existingAdvisor.image === "string") {
              itemCopy.image = existingAdvisor.image;
            } else {
              delete itemCopy.image;
            }
          } catch (e) {
            delete itemCopy.image;
          }
        }
        return itemCopy;
      });
    }

    // Handle other array items
    ["previousFunding", "pressMentions", "otherDocuments"].forEach(
      (arrayName) => {
        if (Array.isArray(dataToSave[arrayName])) {
          dataToSave[arrayName] = dataToSave[arrayName].map((item) => {
            if (item && typeof item === "object") {
              const itemCopy = { ...item };
              Object.keys(itemCopy).forEach((prop) => {
                if (itemCopy[prop] instanceof File) {
                  delete itemCopy[prop];
                }
              });
              return itemCopy;
            }
            return item;
          });
        }
      }
    );

    localStorage.setItem("companyFormData", JSON.stringify(dataToSave));
  }, [formData]);

  const steps = [
    { id: 1, name: "Company Basics", icon: Info },
    { id: 2, name: "Founder Details", icon: UserLucide },
    { id: 3, name: "Team & Advisors", icon: Users },
    { id: 4, name: "Business Model", icon: Briefcase },
    { id: 5, name: "Market & Traction", icon: Target },
    { id: 6, name: "Financials", icon: DollarSignLucide },
    { id: 7, name: "Future Plans", icon: Calendar },
    { id: 8, name: "Digital Presence", icon: Globe },
    { id: 9, name: "Compliance", icon: ShieldCheck },
    { id: 10, name: "Documents", icon: FileTextLucide },
    { id: 11, name: "Review & Submit", icon: Check },
  ];

  const handleInputChange = useCallback((section, name, value) => {
    let updatedValue = value;
    console.log(section, name, value);
    if (typeof value === "string") {
      updatedValue = value.trimStart();
    }

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [name]: updatedValue,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    }
    if (section) {
      setErrors((prev) => ({ ...prev, [`${section}.${name}`]: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }, []);

  const handleNestedChange = useCallback(
    (section, index, field, value) => {
      console.log(section, index, field, value);
      handleInputChange(section, index, field, value);
    },
    [handleInputChange]
  );

  const handleArrayChange = useCallback((arrayName, index, field, value) => {
    console.log("handleArrayChange", arrayName, index, field, value);

    setFormData((prev) => {
      const newArray = [...(prev[arrayName] || [])];

      // Special case for string arrays like keyFeatures and technologyStack
      // where the field is the index itself
      if (
        (arrayName === "keyFeatures" || arrayName === "technologyStack") &&
        field === index
      ) {
        newArray[index] = value;
        return { ...prev, [arrayName]: newArray };
      }

      // Regular case for object arrays
      // First, ensure that the array has the item at specified index
      if (!newArray[index]) {
        // Instead of just warning, let's create the item if it doesn't exist
        console.log(
          `Creating missing item at index ${index} in array ${arrayName}`
        );
        while (newArray.length <= index) {
          newArray.push({});
        }
      }
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });

    setErrors((prev) => ({
      ...prev,
      [`${arrayName}[${index}].${field}`]: undefined,
    }));
  }, []);

  const handleArrayFileChange = useCallback(
    (arrayName, index, fieldName, file) => {
      if (file && file.size > 5 * 1024 * 1024) {
        alert("File size exceeds the limit (5MB).");
        return;
      }

      // Store the actual File object in fileCache for submission
      const cacheKey = `${arrayName}.${index}.${fieldName}`;

      if (file) {
        // Track the previous file's publicId for potential deletion
        if (fileResourceTracker[cacheKey]) {
          setFilesToDelete((prev) => [...prev, fileResourceTracker[cacheKey]]);
        }

        setFileCache((prev) => ({ ...prev, [cacheKey]: file }));

        // Also store in formData for UI display
        setFormData((prev) => {
          const newArray = [...(prev[arrayName] || [])];
          // Ensure that the array has the item at specified index
          if (!newArray[index]) {
            console.log(
              `Creating missing item at index ${index} in array ${arrayName} for file upload`
            );
            while (newArray.length <= index) {
              newArray.push({});
            }
          }
          newArray[index] = { ...newArray[index], [fieldName]: file };
          return { ...prev, [arrayName]: newArray };
        });
      } else {
        // Remove from file cache
        setFileCache((prev) => {
          const newCache = { ...prev };
          delete newCache[cacheKey];
          return newCache;
        });

        // Remove file reference from formData
        setFormData((prev) => {
          const newArray = [...(prev[arrayName] || [])];
          if (newArray[index]) {
            newArray[index] = { ...newArray[index], [fieldName]: null };
          }
          return { ...prev, [arrayName]: newArray };
        });
      }

      // Clear any errors
      setErrors((prev) => ({
        ...prev,
        [`${arrayName}[${index}].${fieldName}`]: undefined,
      }));
    },
    [fileResourceTracker]
  );

  const addArrayItem = useCallback((arrayName, newItemTemplate) => {
    setFormData((prev) => {
      // Special case for string arrays
      if (arrayName === "keyFeatures" || arrayName === "technologyStack") {
        return {
          ...prev,
          [arrayName]: [...(prev[arrayName] || []), newItemTemplate],
        };
      }

      // Normal case for object arrays
      return {
        ...prev,
        [arrayName]: [...(prev[arrayName] || []), { ...newItemTemplate }],
      };
    });
  }, []);

  const removeArrayItem = useCallback((arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: (prev[arrayName] || []).filter((_, i) => i !== index),
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`${arrayName}.${index}.`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  }, []);

  const handleFileChange = useCallback(
    (fieldName, file, error = null) => {
      if (error) {
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
        setFormData((prev) => ({ ...prev, [fieldName]: null }));
        setUploadProgress((prev) => ({ ...prev, [fieldName]: null }));
        return;
      }

      setErrors((prev) => ({ ...prev, [fieldName]: null }));

      // Store the actual File object in fileCache for submission
      if (file) {
        // Track the previous file's publicId for potential deletion
        if (fileResourceTracker[fieldName]) {
          setFilesToDelete((prev) => [...prev, fileResourceTracker[fieldName]]);
        }

        setFileCache((prev) => ({ ...prev, [fieldName]: file }));
        setFormData((prev) => ({ ...prev, [fieldName]: file }));

        // Start upload progress animation
        setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress <= 100) {
            setUploadProgress((prev) => ({ ...prev, [fieldName]: progress }));
          } else {
            clearInterval(interval);
            setUploadProgress((prev) => ({ ...prev, [fieldName]: null }));
          }
        }, 100);
      } else {
        setFileCache((prev) => {
          const newCache = { ...prev };
          delete newCache[fieldName];
          return newCache;
        });
        setFormData((prev) => ({ ...prev, [fieldName]: null }));
        setUploadProgress((prev) => ({ ...prev, [fieldName]: null }));
      }
    },
    [fileResourceTracker]
  );

  const handleMultipleFilesChange = useCallback((fieldName, files) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: files,
    }));
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
  }, []);

  const handleEducationChange = useCallback(
    (index, field, value) =>
      handleArrayChange("founderEducation", index, field, value),
    [handleArrayChange]
  );
  const addEducation = useCallback(() => {
    // Explicitly add an item with empty properties to prevent initialization issues
    addArrayItem("founderEducation", { degree: "", college: "" });
  }, [addArrayItem]);
  const removeEducation = useCallback(
    (index) => removeArrayItem("founderEducation", index),
    [removeArrayItem]
  );

  const handleTeamMemberChange = useCallback(
    (index, field, value) =>
      handleArrayChange("keyTeamMembers", index, field, value),
    [handleArrayChange]
  );
  const addTeamMember = useCallback(() => {
    // Explicitly add an item with all expected properties to prevent initialization issues
    addArrayItem("keyTeamMembers", {
      name: "",
      role: "",
      experience: "",
      image: null,
    });
  }, [addArrayItem]);
  const removeTeamMember = useCallback(
    (index) => removeArrayItem("keyTeamMembers", index),
    [removeArrayItem]
  );

  const handleAdvisorChange = useCallback(
    (index, field, value) => handleArrayChange("advisors", index, field, value),
    [handleArrayChange]
  );
  const addAdvisor = useCallback(
    () =>
      addArrayItem("advisors", {
        name: "",
        expertise: "",
        affiliation: "",
        image: null,
      }),
    [addArrayItem]
  );
  const removeAdvisor = useCallback(
    (index) => removeArrayItem("advisors", index),
    [removeArrayItem]
  );

  const handlePreviousFundingChange = useCallback(
    (index, field, value) =>
      handleArrayChange("previousFunding", index, field, value),
    [handleArrayChange]
  );
  const addPreviousFunding = useCallback(
    () =>
      addArrayItem("previousFunding", {
        round: "",
        date: "",
        amount: "",
        investors: "",
      }),
    [addArrayItem]
  );
  const removePreviousFunding = useCallback(
    (index) => removeArrayItem("previousFunding", index),
    [removeArrayItem]
  );

  const handlePressMentionChange = useCallback(
    (index, field, value) =>
      handleArrayChange("pressMentions", index, field, value),
    [handleArrayChange]
  );
  const addPressMention = useCallback(
    () => addArrayItem("pressMentions", { title: "", url: "" }),
    [addArrayItem]
  );
  const removePressMention = useCallback(
    (index) => removeArrayItem("pressMentions", index),
    [removeArrayItem]
  );

  // Function to upload a single file to Cloudinary
  const uploadFileToCloudinary = async (file, fileType) => {
    // Generate a signature to detect duplicate files
    const fileSignature = `${file.size}-${file.lastModified}-${file.name}`;

    // Check if we've already uploaded this exact file in this session
    if (fileSignatures.has(fileSignature)) {
      console.log("Reusing already uploaded file:", file.name);
      return fileSignatures.get(fileSignature);
    }

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("fileType", fileType);

      const endpoint =
        fileType === "image"
          ? `${API_URL}/upload/image`
          : fileType === "video"
          ? `${API_URL}/upload/video`
          : `${API_URL}/upload/document`;

      const response = await axios.post(endpoint, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          console.log(
            `Upload progress: ${Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )}%`
          );
        },
      });

      const result = {
        success: true,
        url:
          response.data.secureUrl ||
          response.data.secure_url ||
          response.data.path,
        publicId: response.data.publicId || response.data.public_id || "",
      };

      // Store the result for potential reuse
      fileSignatures.set(fileSignature, result);

      return result;
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || error.message || "Upload failed",
      };
    }
  };

  const validateStep = (step) => {
    const schema = validationSchemas[step];
    if (!schema) return true;

    try {
      // Debug current formData values for key fields in step 4 (BusinessDetails)
      if (step === 4) {
        console.log("Business Details validation:");
        console.log(
          "companyDescription:",
          formData.companyDescription?.length,
          formData.companyDescription?.substring(0, 20) + "..."
        );
        console.log(
          "problemStatement:",
          formData.problemStatement?.length,
          formData.problemStatement?.substring(0, 20) + "..."
        );
        console.log(
          "solution:",
          formData.solution?.length,
          formData.solution?.substring(0, 20) + "..."
        );
        console.log(
          "productServiceDetails:",
          formData.productServiceDetails?.length,
          formData.productServiceDetails?.substring(0, 20) + "..."
        );
      }

      // Debug for Market & Traction form
      if (step === 5) {
        console.log("Market & Traction validation:");

        // Verify marketSize is properly initialized as an object
        console.log("marketSize type:", typeof formData.marketSize);
        if (
          typeof formData.marketSize !== "object" ||
          formData.marketSize === null
        ) {
          console.log("Fixing marketSize - was not an object");
          formData.marketSize = { tam: "", sam: "", som: "" };
        }
        console.log("marketSize content:", formData.marketSize);

        // Verify tractionMetrics is properly initialized as an object
        console.log("tractionMetrics type:", typeof formData.tractionMetrics);
        if (
          typeof formData.tractionMetrics !== "object" ||
          formData.tractionMetrics === null
        ) {
          console.log("Fixing tractionMetrics - was not an object");
          formData.tractionMetrics = {
            mau: "",
            mrr: "",
            churnRate: "",
            clv: "",
            cac: "",
          };
        }
        console.log("tractionMetrics content:", formData.tractionMetrics);

        // Check competitive landscape field
        console.log(
          "competitiveLandscape:",
          formData.competitiveLandscape?.length,
          formData.competitiveLandscape?.substring(0, 20) + "..."
        );
        console.log(
          "competitiveAdvantage:",
          formData.competitiveAdvantage?.length,
          formData.competitiveAdvantage?.substring(0, 20) + "..."
        );
        console.log(
          "targetMarket:",
          formData.targetMarket?.length,
          formData.targetMarket?.substring(0, 20) + "..."
        );
      }

      schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = {};
        err.errors.forEach((e) => {
          formattedErrors[e.path.join(".")] = e.message;
          console.log(
            `Validation error at path ${e.path.join(".")}: ${e.message}`
          );
        });
        console.log("Validation Errors:", formattedErrors);
        setErrors(formattedErrors);
      } else {
        console.error("Unexpected validation error:", err);
        setErrors({
          submit: "An unexpected error occurred during validation.",
        });
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});
    setUploadingFiles(true);

    try {
      // Step 1: Collect all files that need to be uploaded
      const filesToUpload = [];
      const fileUrlMap = {};

      // Top-level files
      Object.keys(fileCache).forEach((key) => {
        if (!key.includes(".")) {
          filesToUpload.push({
            file: fileCache[key],
            key,
            type: fileCache[key].type.startsWith("image/")
              ? "image"
              : fileCache[key].type.startsWith("video/")
              ? "video"
              : "document",
          });
        }
      });

      // Team member images
      if (Array.isArray(formData.keyTeamMembers)) {
        formData.keyTeamMembers.forEach((member, index) => {
          const cacheKey = `keyTeamMembers.${index}.image`;
          if (fileCache[cacheKey]) {
            filesToUpload.push({
              file: fileCache[cacheKey],
              key: cacheKey,
              type: "image",
            });
          }
        });
      }

      // Advisor images
      if (Array.isArray(formData.advisors)) {
        formData.advisors.forEach((advisor, index) => {
          const cacheKey = `advisors.${index}.image`;
          if (fileCache[cacheKey]) {
            filesToUpload.push({
              file: fileCache[cacheKey],
              key: cacheKey,
              type: "image",
            });
          }
        });
      }

      // Other documents
      if (Array.isArray(formData.otherDocuments)) {
        formData.otherDocuments.forEach((file, idx) => {
          if (file instanceof File) {
            filesToUpload.push({
              file,
              key: `otherDocuments.${idx}`,
              type: "document",
            });
          }
        });
      }

      // Step 2: Upload files to Cloudinary (in batches)
      if (filesToUpload.length > 0) {
        setUploadStatus({
          total: filesToUpload.length,
          completed: 0,
          failed: 0,
        });

        const BATCH_SIZE = 3;
        for (let i = 0; i < filesToUpload.length; i += BATCH_SIZE) {
          const batch = filesToUpload.slice(
            i,
            i + Math.min(BATCH_SIZE, filesToUpload.length - i)
          );

          setErrors((prev) => ({
            ...prev,
            submit: `Uploading files ${i + 1}-${Math.min(
              i + BATCH_SIZE,
              filesToUpload.length
            )} of ${filesToUpload.length}...`,
          }));

          // Upload files in parallel
          const results = await Promise.all(
            batch.map(async ({ file, key, type }) => {
              const result = await uploadFileToCloudinary(file, type);
              setUploadStatus((prev) => ({
                ...prev,
                completed: result.success ? prev.completed + 1 : prev.completed,
                failed: !result.success ? prev.failed + 1 : prev.failed,
              }));
              return { key, result };
            })
          );

          // Save URLs from successful uploads
          results.forEach(({ key, result }) => {
            if (result.success) {
              fileUrlMap[key] = result.url;
            }
          });
        }

        // Check if any uploads failed
        if (uploadStatus.failed > 0) {
          throw new Error(
            `${uploadStatus.failed} files failed to upload. Please try again.`
          );
        }
      }

      // Step 3: Create submission data with Cloudinary URLs instead of files
      const submissionData = { ...formData };

      // Replace top-level files with URLs
      Object.keys(fileUrlMap).forEach((key) => {
        if (!key.includes(".")) {
          submissionData[key] = fileUrlMap[key];
        }
      });

      // Replace team member images with URLs
      if (Array.isArray(submissionData.keyTeamMembers)) {
        submissionData.keyTeamMembers = submissionData.keyTeamMembers.map(
          (member, index) => {
            const cacheKey = `keyTeamMembers.${index}.image`;
            if (fileUrlMap[cacheKey]) {
              return { ...member, image: fileUrlMap[cacheKey] };
            }
            return member;
          }
        );
      }

      // Replace advisor images with URLs
      if (Array.isArray(submissionData.advisors)) {
        submissionData.advisors = submissionData.advisors.map(
          (advisor, index) => {
            const cacheKey = `advisors.${index}.image`;
            if (fileUrlMap[cacheKey]) {
              return { ...advisor, image: fileUrlMap[cacheKey] };
            }
            return advisor;
          }
        );
      }

      // Replace other documents with URLs
      if (Array.isArray(submissionData.otherDocuments)) {
        submissionData.otherDocuments = submissionData.otherDocuments
          .map((doc, index) => {
            const cacheKey = `otherDocuments.${index}`;
            if (fileUrlMap[cacheKey]) {
              return fileUrlMap[cacheKey];
            }
            return doc instanceof File ? null : doc;
          })
          .filter(Boolean);
      }

      // Clean up any base64 strings
      Object.keys(submissionData).forEach((key) => {
        const val = submissionData[key];
        if (typeof val === "string" && val.startsWith("data:")) {
          delete submissionData[key];
        } else if (Array.isArray(val)) {
          submissionData[key] = val
            .map((item) => {
              if (typeof item === "string") {
                return item.startsWith("data:") ? null : item;
              }
              if (
                item &&
                typeof item === "object" &&
                item.image &&
                typeof item.image === "string" &&
                item.image.startsWith("data:")
              ) {
                const { image, ...rest } = item;
                return rest;
              }
              return item;
            })
            .filter((item) => item != null);
        }
      });

      // Step 4: Submit form data with Cloudinary URLs
      setErrors((prev) => ({ ...prev, submit: "Submitting form data..." }));

      try {
        // Use JSON request instead of FormData since files are already uploaded
        console.log("Submitting form data to backend...");

        // Make a simpler POST request with JSON content-type for easier debugging
        const response = await axios.post(
          `${API_URL}/fund`,
          { jsonData: submissionData },
          {
            headers: {
              "Content-Type": "application/json",
              withCredentials: true,
            },
          }
        );

        console.log("Backend Response:", response.data);

        // Clean up unused files after successful submission
        if (filesToDelete.length > 0) {
          try {
            console.log(`Cleaning up ${filesToDelete.length} unused files`);
            await axios.post(
              `${API_URL}/fund/delete-unused-files`,
              { publicIds: filesToDelete },
              {
                headers: {
                  "Content-Type": "application/json",
                  withCredentials: true,
                },
              }
            );
            console.log("Cleanup successful");
          } catch (cleanupError) {
            console.error("Failed to clean up unused files:", cleanupError);
            // Non-critical error, we can continue
          }
        }

        setErrors((prev) => ({
          ...prev,
          submit: "Company submitted successfully!",
        }));
        localStorage.removeItem("companyFormData");
        navigate("/funding");
      } catch (error) {
        console.error("Submission Error:", error);
        let errorMessage =
          "Failed to submit company details. Please try again.";
        if (error.response) {
          console.error("Backend Error Data:", error.response.data);
          errorMessage = error.response.data.message || errorMessage;
          if (typeof error.response.data.errors === "object") {
            setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
          }
        } else if (error.request) {
          errorMessage =
            "Could not connect to the server. Please check your network.";
        }
        setErrors((prev) => ({ ...prev, submit: errorMessage }));
      } finally {
        setIsSubmitting(false);
        setUploadingFiles(false);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      let errorMessage = "Failed to submit company details. Please try again.";
      if (error.response) {
        console.error("Backend Error Data:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
        if (typeof error.response.data.errors === "object") {
          setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
        }
      } else if (error.request) {
        errorMessage =
          "Could not connect to the server. Please check your network.";
      }
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      formData,
      setErrors,
      errors,
      handleInputChange,
      handleNestedChange,
      handleArrayChange,
      addArrayItem,
      removeArrayItem,
      handleFileChange,
      handleMultipleFilesChange,
      handleArrayFileChange,
      handleEducationChange,
      addEducation,
      removeEducation,
      handleTeamMemberChange,
      addTeamMember,
      removeTeamMember,
      handleAdvisorChange,
      addAdvisor,
      removeAdvisor,
      handlePreviousFundingChange,
      addPreviousFunding,
      removePreviousFunding,
      handlePressMentionChange,
      addPressMention,
      removePressMention,
      uploadProgress,
      setUploadProgress,
    };

    switch (currentStep) {
      case 1:
        return <BasicInfo {...commonProps} />;
      case 2:
        return <FounderDetails {...commonProps} />;
      case 3:
        return <TeamInfo {...commonProps} />;
      case 4:
        return <BusinessDetails {...commonProps} />;
      case 5:
        return <MarketTraction {...commonProps} />;
      case 6:
        return <Financials {...commonProps} />;
      case 7:
        return <FuturePlansVision {...commonProps} />;
      case 8:
        return <DigitalPresence {...commonProps} />;
      case 9:
        return <Compliance {...commonProps} />;
      case 10:
        return <DocumentsUpload {...commonProps} />;
      case 11:
        return (
          <ReviewSubmit
            formData={formData}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            goToStep={goToStep}
            steps={steps}
            uploadingFiles={uploadingFiles}
            uploadStatus={uploadStatus}
            errors={errors}
          />
        );
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="md:flex">
          {/* Sidebar / Progress Bar */}
          <div className="w-full md:w-1/4 bg-gray-900 p-8 md:sticky md:top-0 md:h-screen">
            <div className="h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-8">Innov8Mate</h2>
              <ProgressBar
                steps={steps}
                currentStep={currentStep}
                goToStep={goToStep}
                layout="vertical"
                showLabels={true}
                className="bg-transparent border-0 shadow-none flex-grow"
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="w-full md:w-3/4 p-0">
            <div className="bg-white p-8 md:p-12 border-b border-gray-100 sticky top-0 z-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                {steps[currentStep - 1].name}
              </h2>
              <p className="text-gray-600">
                Complete the details for step {currentStep} of {steps.length}.
              </p>
            </div>

            <div className="p-8 md:p-12 pt-6">
              <form onSubmit={handleSubmit} noValidate>
                {renderCurrentStep()}

                {/* Navigation Buttons (Rendered inside step components except Review) */}
                {currentStep !== 11 && (
                  <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentStep === 1}
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
                    >
                      Previous
                    </button>
                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className={`ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200`}
                      >
                        Next Step
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNext} // Go to Review Step
                        className={`ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
                      >
                        Review Application
                        <Check className="ml-2 h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Final Submit Button (Only on Review Step) */}
                {currentStep === steps.length && (
                  <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`ml-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-wait transition-all duration-200`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Rocket className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
                {errors.submit && (
                  <div
                    className={`mt-4 p-4 rounded-md ${
                      errors.submit.includes("success")
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    <div className="flex items-center">
                      {errors.submit.includes("success") ? (
                        <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 mr-2 text-red-400" />
                      )}
                      <p className="text-sm font-medium">{errors.submit}</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderForm;
