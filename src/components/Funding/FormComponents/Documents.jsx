/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  FileText,
  Video,
  Trash2,
  UploadCloud,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

const FounderForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  handleNext,
  handlePrev,
  stepsLength,
  currentStep,
}) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [localErrors, setLocalErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  // File type and size constraints
  const fileConstraints = {
    pitchDeck: {
      types: [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ],
      maxSize: 2, // MB
      typeNames: "PDF, PPT, PPTX",
    },
    additionalDocs: {
      types: [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
      ],
      maxSizeDoc: 2, // MB
      maxSizeVideo: 30, // MB
      typeNames: "PDF, PPT, PPTX, or video",
    },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error if field is filled
    if (value.trim()) {
      setLocalErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  };

  const validateFileSize = (file, maxSizeMB) => {
    return file.size <= maxSizeMB * 1024 * 1024;
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const constraints = fileConstraints[fieldName];

    // Reset previous errors
    setLocalErrors((prev) => ({ ...prev, [fieldName]: "" }));

    // Validate file type
    if (!validateFileType(file, constraints.types)) {
      setLocalErrors((prev) => ({
        ...prev,
        [fieldName]: `Error: Only ${constraints.typeNames} files are allowed.`,
      }));
      return;
    }

    // Validate file size
    const maxSize =
      fieldName === "pitchDeck"
        ? constraints.maxSize
        : file.type.startsWith("video")
        ? constraints.maxSizeVideo
        : constraints.maxSizeDoc;

    if (!validateFileSize(file, maxSize)) {
      setLocalErrors((prev) => ({
        ...prev,
        [fieldName]: `Error: File size must be less than ${maxSize}MB.`,
      }));
      return;
    }

    // Simulate upload progress
    simulateFileUpload(fieldName, file, () => {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
    });
  };

  const simulateFileUpload = (fieldName, file, onComplete) => {
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));

    const totalSteps = 10;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setUploadProgress((prev) => ({
        ...prev,
        [fieldName]: Math.round((currentStep / totalSteps) * 100),
      }));

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        onComplete();
        // Clear progress after 1 second
        setTimeout(() => {
          setUploadProgress((prev) => ({ ...prev, [fieldName]: null }));
        }, 1000);
      }
    }, 100); // Simulating upload in 1 second total
  };

  const handleAdditionalDocUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const constraints = fileConstraints.additionalDocs;

    // Clear previous errors
    setLocalErrors((prev) => ({ ...prev, additionalDocs: "" }));

    // Check if max number of files reached
    if (formData.additionalDocs.length >= 3) {
      setLocalErrors((prev) => ({
        ...prev,
        additionalDocs: "Error: Maximum 3 additional documents allowed.",
      }));
      return;
    }

    // Validate file type
    if (!validateFileType(file, constraints.types)) {
      setLocalErrors((prev) => ({
        ...prev,
        additionalDocs: `Error: Only ${constraints.typeNames} files are allowed.`,
      }));
      return;
    }

    // Validate file size based on type
    const maxSize = file.type.startsWith("video")
      ? constraints.maxSizeVideo
      : constraints.maxSizeDoc;

    if (!validateFileSize(file, maxSize)) {
      setLocalErrors((prev) => ({
        ...prev,
        additionalDocs: `Error: ${
          file.type.startsWith("video") ? "Video" : "Document"
        } size must be less than ${maxSize}MB.`,
      }));
      return;
    }

    // Simulate upload progress
    simulateFileUpload("additionalDoc", file, () => {
      setFormData((prev) => ({
        ...prev,
        additionalDocs: [...prev.additionalDocs, file],
      }));
    });
  };

  const removeAdditionalDoc = (index) => {
    const docs = [...formData.additionalDocs];
    docs.splice(index, 1);
    setFormData((prev) => ({ ...prev, additionalDocs: docs }));

    // Clear any error messages when removing files
    if (localErrors.additionalDocs) {
      setLocalErrors((prev) => ({ ...prev, additionalDocs: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.pitchDeck === null) {
      newErrors.pitchDeck = "pitchDeck field is required";
    }

    setLocalErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);

    // Update parent errors state if needed
    if (setErrors) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  // Helper to get file type icon
  const getFileIcon = (file) => {
    if (file.type.startsWith("video")) {
      return <Video className="text-blue-500" size={18} />;
    }
    return <FileText className="text-orange-500" size={18} />;
  };

  return (
    <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
      {/* Form Section Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Company Documents
        </h2>
        <p className="text-sm text-gray-500">
          Upload your pitch deck and additional supporting documents
        </p>
      </div>

      {/* Pitch Deck Upload */}
      <div
        className={`border ${
          localErrors.pitchDeck
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50"
        } p-5 rounded-lg transition-colors`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloud
            className={`${
              localErrors.pitchDeck ? "text-red-500" : "text-gray-500"
            } mb-2`}
            size={24}
          />
          <h3 className="text-md font-medium text-gray-800 mb-1">
            {formData.pitchDeck ? "Pitch Deck Uploaded" : "Upload Pitch Deck"}
          </h3>

          {formData.pitchDeck ? (
            <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-md w-full">
              {getFileIcon(formData.pitchDeck)}
              <span className="text-sm text-gray-700 truncate max-w-xs">
                {formData.pitchDeck.name}
              </span>
              <button
                onClick={() =>
                  setFormData((prev) => ({ ...prev, pitchDeck: null }))
                }
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">
                PDF, PPT or PPTX (Max 2MB)
              </p>
              <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "pitchDeck")}
                  accept=".pdf,.ppt,.pptx"
                />
              </label>
            </>
          )}

          {uploadProgress.pitchDeck !== undefined &&
            uploadProgress.pitchDeck !== null && (
              <div className="w-full mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-200"
                    style={{ width: `${uploadProgress.pitchDeck}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Uploading: {uploadProgress.pitchDeck}%
                </p>
              </div>
            )}

          {localErrors.pitchDeck && (
            <div className="flex items-center gap-1 mt-2 text-red-600">
              <AlertCircle size={14} />
              <p className="text-sm">{localErrors.pitchDeck}</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Documents */}
      <div
        className={`border ${
          localErrors.additionalDocs
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50"
        } p-5 rounded-lg`}
      >
        <h3 className="text-md font-medium text-gray-800 mb-2">
          Additional Documents (Optional)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload up to 3 additional files (PDFs, PPTs up to 2MB, Videos up to
          30MB)
        </p>

        {formData.additionalDocs.length > 0 && (
          <div className="space-y-2 mb-4">
            {formData.additionalDocs.map((doc, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  {getFileIcon(doc)}
                  <span className="text-sm text-gray-700 truncate max-w-xs">
                    {doc.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(doc.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={() => removeAdditionalDoc(index)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Remove file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {formData.additionalDocs.length < 3 && (
          <div className="text-center">
            <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <PlusCircle size={16} />
              <span>Add Document</span>
              <input
                type="file"
                className="hidden"
                onChange={handleAdditionalDocUpload}
                accept=".pdf,.ppt,.pptx,video/*"
              />
            </label>
          </div>
        )}

        {uploadProgress.additionalDoc !== undefined &&
          uploadProgress.additionalDoc !== null && (
            <div className="w-full mt-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-200"
                  style={{ width: `${uploadProgress.additionalDoc}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Uploading: {uploadProgress.additionalDoc}%
              </p>
            </div>
          )}

        {localErrors.additionalDocs && (
          <div className="flex items-center gap-1 mt-2 text-red-600">
            <AlertCircle size={14} />
            <p className="text-sm">{localErrors.additionalDocs}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep <= stepsLength && (
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className={`ml-auto px-6 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors ${
              !isFormValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {currentStep === stepsLength ? "Submit" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FounderForm;
