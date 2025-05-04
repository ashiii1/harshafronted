// components/BasicInfo.js
import {
  BuildingOffice2Icon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const BasicInfo = ({ formData, handleInputChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block font-medium">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            className={`block w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-indigo-500 transition-colors duration-200 ${
              errors.companyName ? "border-red-300" : ""
            }`}
            placeholder="Enter company name"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>
        {/* Add more fields here */}
      </div>
    </div>
  );
};

export default BasicInfo;
