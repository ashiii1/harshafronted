import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { FormCheckbox } from "./FormHelpers";

// File constraints (can be adjusted)
const fileConstraints = {
  pitchDeck: {
    types: [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    maxSizeMB: 10,
    label: "Pitch Deck",
    required: true,
  },
  financialStatements: {
    types: [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    maxSizeMB: 5,
    label: "Financial Statements",
    required: false,
  },
  businessPlan: {
    types: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxSizeMB: 5,
    label: "Business Plan",
    required: false,
  },
  otherDocuments: {
    types: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
    ],
    maxSizeMB: 5,
    label: "Document",
    maxCount: 5,
  },
};

// Helper to format file size
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Reusable File Upload Component for single files
const SingleFileInput = ({
  fieldKey,
  label,
  constraints,
  file,
  onFileChange,
  error,
  progress,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        const message = fileRejections[0].errors[0].message;
        onFileChange(fieldKey, null, message); // Pass error
      } else if (acceptedFiles.length > 0) {
        onFileChange(fieldKey, acceptedFiles[0], null); // Pass file, clear error
      }
    },
    accept: constraints.types.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize: constraints.maxSizeMB * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = () => {
    onFileChange(fieldKey, null, null); // Remove file, clear error
  };

  return (
    <div
      className={`p-4 border rounded-lg ${
        error ? "border-red-400 bg-red-50" : "border-gray-300"
      }`}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {constraints.required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-xs text-gray-500 ml-2">
          (Max {constraints.maxSizeMB}MB, Types:{" "}
          {constraints.types
            .map((t) => t.split("/")[1])
            .join(", ")
            .toUpperCase()}
          )
        </span>
      </label>
      {!file && progress === null && (
        <div
          {...getRootProps()}
          className={`mt-1 flex justify-center px-6 py-10 border-2 ${
            error ? "border-red-400" : "border-gray-300"
          } border-dashed rounded-md cursor-pointer hover:border-orange-400 transition-colors ${
            isDragActive ? "bg-orange-50" : "bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-1 text-center">
            <UploadCloud
              className={`mx-auto h-10 w-10 ${
                error ? "text-red-500" : "text-gray-400"
              }`}
            />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop the file here..."
                : "Drag 'n' drop, or click to select"}
            </p>
          </div>
        </div>
      )}
      {progress !== null && (
        <div className="mt-2 flex items-center justify-center text-sm text-orange-600">
          <Loader className="animate-spin h-4 w-4 mr-2" />
          Uploading... {progress}%
        </div>
      )}
      {file && progress === null && (
        <div className="mt-2 p-2 border border-gray-200 bg-white rounded flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate" title={file.name}>
              {file.name}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0">
              ({formatBytes(file.size)})
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-600 ml-2 p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

// Reusable File Upload Component for multiple files
const MultipleFilesInput = ({
  fieldKey,
  label,
  constraints,
  files,
  onFilesChange,
  errors,
}) => {
  const [localErrors, setLocalErrors] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const currentFiles = files || [];
      const newFiles = [...currentFiles];
      const currentErrors = [];

      fileRejections.forEach((rejection) => {
        currentErrors.push(
          `${rejection.file.name}: ${rejection.errors[0].message}`
        );
      });

      acceptedFiles.forEach((file) => {
        if (newFiles.length < constraints.maxCount) {
          newFiles.push(file);
        } else {
          currentErrors.push(
            `Cannot add ${file.name}: Maximum ${constraints.maxCount} files allowed.`
          );
        }
      });

      setLocalErrors(currentErrors);
      if (newFiles.length !== currentFiles.length) {
        onFilesChange(fieldKey, newFiles); // Update parent state only if files changed
      }
    },
    [files, constraints, fieldKey, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: constraints.types.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize: constraints.maxSizeMB * 1024 * 1024,
  });

  const handleRemove = (indexToRemove) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange(fieldKey, newFiles);
    setLocalErrors([]); // Clear errors on removal
  };

  const hasUploadError = errors?.[fieldKey] || localErrors.length > 0;

  return (
    <div
      className={`p-4 border rounded-lg ${
        hasUploadError ? "border-red-400 bg-red-50" : "border-gray-300"
      }`}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        <span className="text-xs text-gray-500 ml-2">
          (Max {constraints.maxCount} files, {constraints.maxSizeMB}MB each,
          Types:{" "}
          {constraints.types
            .map((t) => t.split("/")[1])
            .join(", ")
            .toUpperCase()}
          )
        </span>
      </label>
      <div
        {...getRootProps()}
        className={`mt-1 flex justify-center px-6 py-10 border-2 ${
          hasUploadError ? "border-red-400" : "border-gray-300"
        } border-dashed rounded-md cursor-pointer hover:border-orange-400 transition-colors ${
          isDragActive ? "bg-orange-50" : "bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-1 text-center">
          <UploadCloud
            className={`mx-auto h-10 w-10 ${
              hasUploadError ? "text-red-500" : "text-gray-400"
            }`}
          />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? "Drop files here..."
              : "Drag 'n' drop, or click to select"}
          </p>
        </div>
      </div>
      {files && files.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-gray-600">
            Uploaded files ({files.length}/{constraints.maxCount}):
          </p>
          {files.map((file, index) => (
            <div
              key={index}
              className="p-2 border border-gray-200 bg-white rounded flex items-center justify-between"
            >
              <div className="flex items-center space-x-2 overflow-hidden">
                <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span
                  className="text-sm text-gray-700 truncate"
                  title={file.name}
                >
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  ({formatBytes(file.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-gray-400 hover:text-red-600 ml-2 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Display errors from parent + local dropzone errors */}
      {(errors?.[fieldKey] || localErrors.length > 0) && (
        <div className="mt-2 space-y-1">
          {errors?.[fieldKey] && (
            <p className="text-xs text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors[fieldKey]}
            </p>
          )}
          {localErrors.map((err, i) => (
            <p key={i} className="text-xs text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentsUpload = ({
  formData,
  handleFileChange,
  handleMultipleFilesChange,
  handleInputChange,
  errors,
  uploadProgress,
}) => {
  // Adjusted handler to work with parent state management
  const onSingleFileChange = (fieldKey, file, error) => {
    handleFileChange(fieldKey, file, error);
  };

  const onMultipleFilesChange = (fieldKey, files) => {
    handleMultipleFilesChange(fieldKey, files);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow">
      <SingleFileInput
        fieldKey="pitchDeck"
        label={fileConstraints.pitchDeck.label}
        constraints={fileConstraints.pitchDeck}
        file={formData.pitchDeck}
        onFileChange={onSingleFileChange}
        error={errors?.pitchDeck}
        progress={uploadProgress?.pitchDeck ?? null}
      />

      <SingleFileInput
        fieldKey="financialStatements"
        label={fileConstraints.financialStatements.label}
        constraints={fileConstraints.financialStatements}
        file={formData.financialStatements}
        onFileChange={onSingleFileChange}
        error={errors?.financialStatements}
        progress={uploadProgress?.financialStatements ?? null}
      />

      <SingleFileInput
        fieldKey="businessPlan"
        label={fileConstraints.businessPlan.label}
        constraints={fileConstraints.businessPlan}
        file={formData.businessPlan}
        onFileChange={onSingleFileChange}
        error={errors?.businessPlan}
        progress={uploadProgress?.businessPlan ?? null}
      />

      <MultipleFilesInput
        fieldKey="otherDocuments"
        label="Other Supporting Documents"
        constraints={fileConstraints.otherDocuments}
        files={formData.otherDocuments || []} // Ensure it's an array
        onFilesChange={onMultipleFilesChange}
        errors={errors}
      />

      <div>
        <FormCheckbox
          label="I agree to the terms and conditions"
          id="termsAgreed"
          checked={formData.termsAgreed}
          onChange={handleInputChange}
          error={errors?.termsAgreed}
          field="termsAgreed"
        />
      </div>
    </div>
  );
};

export default DocumentsUpload;
