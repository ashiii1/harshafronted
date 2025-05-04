/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  BuildingOffice2Icon,
  MapPinIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import {
  Upload,
  Info,
  Building,
  Tag as TagIcon,
  MapPin,
  Calendar,
  DollarSign as DollarSignIcon,
  Briefcase,
  Server,
} from "lucide-react";
// Import the shared helper components
import { FormInput, FormTextarea, FormSelect } from "./FormHelpers";

const BasicInfo = ({
  formData,
  handleInputChange,
  errors,
  setErrors,
  handleFileChange,
}) => {
  const [logoPreview, setLogoPreview] = useState(null);

  // Initialize preview on mount or when formData changes
  useEffect(() => {
    if (formData.companyLogo instanceof File) {
      const objectUrl = URL.createObjectURL(formData.companyLogo);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (
      typeof formData.companyLogo === "string" &&
      formData.companyLogo
    ) {
      setLogoPreview(formData.companyLogo);
    } else {
      setLogoPreview(null);
    }
  }, [formData.companyLogo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        console.log("Logo file accepted:", acceptedFiles[0].name);
        handleFileChange("companyLogo", acceptedFiles[0]);
      }
    },
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    onDropRejected: (fileRejections) => {
      const errorMsg =
        fileRejections[0]?.errors[0]?.message ||
        "Invalid file type or size (max 2MB).";
      setErrors((prev) => ({ ...prev, companyLogo: errorMsg }));
    },
    onDropAccepted: (acceptedFiles) => {
      setErrors((prev) => ({ ...prev, companyLogo: null }));
    },
  });

  return (
    <div className="space-y-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start p-6">
        <div className="md:col-span-1 flex flex-col items-center space-y-2">
          <label className="block text-sm font-medium text-gray-700 self-start md:text-center w-full mb-2">
            Company Logo*
          </label>
          <div
            {...getRootProps()}
            className={`flex justify-center items-center p-4 border-2 ${
              errors?.companyLogo ? "border-red-500" : "border-gray-300"
            } border-dashed rounded-md cursor-pointer hover:border-orange-400 transition-colors w-full h-48 text-center ${
              isDragActive ? "bg-orange-50" : "bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-1 text-center flex flex-col items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="max-h-36 max-w-full object-contain rounded"
                />
              ) : (
                <>
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-600 mt-1">
                    {isDragActive ? "Drop here" : "Upload or drag"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF (max 2MB)
                  </p>
                </>
              )}
            </div>
          </div>
          {errors?.companyLogo && (
            <p className="mt-1 text-xs text-red-600 text-center w-full">
              {errors.companyLogo}
            </p>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <FormInput
            label="Company Name"
            id="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="e.g., Innovatech Solutions Inc."
            error={errors?.companyName}
            required
            icon={Building}
          />
          <FormInput
            label="Tagline / Slogan"
            id="tagline"
            value={formData.tagline}
            onChange={handleInputChange}
            placeholder="e.g., Revolutionizing the future"
            error={errors?.tagline}
            icon={TagIcon}
          />
          <FormTextarea
            label="Short Pitch / Elevator Pitch"
            id="pitch"
            value={formData.pitch}
            onChange={handleInputChange}
            placeholder="Briefly describe your company (max 300 characters)"
            error={errors?.pitch}
            maxLength={300}
            rows={3}
            icon={Info}
          />
          <FormSelect
            label="Sector"
            id="sector"
            value={formData.sector}
            onChange={handleInputChange}
            error={errors?.sector}
            required
            icon={Briefcase}
          >
            <option value="">Select Sector</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Retail">Retail</option>
            <option value="Energy">Energy</option>
            <option value="Other">Other</option>
          </FormSelect>
          <FormInput
            label="Industry"
            id="industry"
            value={formData.industry}
            onChange={handleInputChange}
            placeholder="e.g., SaaS, EdTech, FinTech"
            error={errors?.industry}
            required
            icon={Server}
          />
          <FormSelect
            label="Current Stage"
            id="stage"
            value={formData.stage}
            onChange={handleInputChange}
            error={errors?.stage}
            required
            icon={BuildingOffice2Icon}
          >
            <option value="">Select Stage</option>
            <option value="Idea">Idea</option>
            <option value="Pre-Seed">Pre-Seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B+">Series B+</option>
            <option value="Growth">Growth</option>
            <option value="Established">Established</option>
          </FormSelect>
          <FormInput
            label="Founded Date"
            id="foundedDate"
            type="date"
            value={formData.foundedDate}
            onChange={handleInputChange}
            error={errors?.foundedDate}
            icon={Calendar}
          />
          <FormInput
            label="Location"
            id="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., San Francisco, CA or Remote"
            error={errors?.location}
            required
            icon={MapPin}
          />
          <FormInput
            label="Estimated Valuation ($)"
            id="estimatedValuation"
            type="number"
            value={formData.estimatedValuation}
            onChange={handleInputChange}
            placeholder="e.g., 5000000"
            error={errors?.estimatedValuation}
            icon={DollarSignIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
