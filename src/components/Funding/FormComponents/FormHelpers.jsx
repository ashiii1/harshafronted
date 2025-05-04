import React from "react";

// Helper Input Component
export const FormInput = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon: Icon,
  section = null,
  index = null,
  field = null,
  ...props
}) => {
  const inputId = `${id}${index !== null ? `-${index}` : ""}`;
  const inputName = field || id;

  // Determine the correct handler based on whether it's a top-level field, nested object, or array item
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (section !== null && index !== null) {
      // Array item: Use section, index, field, value signature
      onChange(section, index, inputName, newValue);
    } else if (section !== null) {
      // Nested object field: Use section, name, value signature
      onChange(section, inputName, newValue);
    } else {
      // Top-level field: Use name, value signature
      onChange(null, inputName, newValue);
    }
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`block text-sm font-medium text-gray-700 mb-1 ${
          error ? "text-red-600" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          type={type}
          id={inputId}
          name={inputName}
          value={value || ""}
          onChange={handleChange} // Use the conditional handler
          placeholder={placeholder}
          required={required}
          className={`block w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder:text-gray-500 ${
            Icon ? "pl-10" : ""
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

// Helper Textarea Component
export const FormTextarea = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rows = 4,
  maxLength = 500,
  minLength,
  icon: Icon,
  section = null,
  index = null,
  field = null,
}) => {
  const currentLength = value?.length || 0;
  const textareaId = `${id}${index !== null ? `-${index}` : ""}`;
  const textareaName = field || id;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (section !== null && index !== null) {
      onChange(section, index, textareaName, newValue);
    } else {
      onChange(null, textareaName, newValue); // Use (null, name, value)
    }
  };

  return (
    <div>
      <label
        htmlFor={textareaId}
        className={`block text-sm font-medium text-gray-700 mb-1 ${
          error ? "text-red-600" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute top-3 left-3">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <textarea
          id={textareaId}
          name={textareaName}
          rows={rows}
          value={value || ""}
          onChange={handleChange} // Use the conditional handler
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={`block w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder:text-gray-500 ${
            Icon ? "pl-10 pt-2" : ""
          }`}
        />
      </div>
      <div className="flex justify-between">
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        <div
          className={`mt-1 text-xs ${
            minLength && currentLength < minLength
              ? "text-red-600"
              : currentLength > maxLength - 50
              ? "text-orange-600"
              : "text-gray-500"
          } ml-auto flex items-center`}
        >
          {minLength && (
            <span
              className={`mr-2 ${
                currentLength < minLength ? "text-red-600" : "text-green-600"
              }`}
            >
              {currentLength < minLength
                ? `Min ${minLength} (${minLength - currentLength} more needed)`
                : "✓"}
            </span>
          )}
          <span>
            {currentLength}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper Select Component
export const FormSelect = ({
  label,
  id,
  value,
  onChange,
  error,
  required = false,
  children,
  icon: Icon,
  section = null,
  index = null,
  field = null,
}) => {
  const selectId = `${id}${index !== null ? `-${index}` : ""}`;
  const selectName = field || id;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (section !== null && index !== null) {
      onChange(section, index, selectName, newValue);
    } else {
      onChange(null, selectName, newValue); // Use (null, name, value)
    }
  };

  return (
    <div>
      <label
        htmlFor={selectId}
        className={`block text-sm font-medium text-gray-700 mb-1 ${
          error ? "text-red-600" : ""
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <select
          id={selectId}
          name={selectName}
          value={value || ""}
          onChange={handleChange} // Use the conditional handler
          required={required}
          className={`block w-full py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } bg-white rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
            Icon ? "pl-10 pr-3" : "px-3"
          } placeholder:text-gray-500`}
        >
          {children}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

// *** ADD Helper Checkbox Component ***
export const FormCheckbox = ({
  label,
  id,
  checked,
  onChange,
  error,
  field = null,
  // Add section/index if needed for array contexts later
}) => (
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        id={id}
        name={field || id}
        type="checkbox"
        checked={checked || false}
        // Assuming top-level for now, adjust if used in arrays
        onChange={(e) => onChange(null, field || id, e.target.checked)}
        className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
      />
    </div>
    <div className="ml-3 text-sm">
      <label
        htmlFor={id}
        className={`font-medium ${error ? "text-red-600" : "text-gray-700"}`}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  </div>
);
