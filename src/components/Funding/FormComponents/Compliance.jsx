import React from "react";
import { Scale, ShieldCheck, FileText } from "lucide-react";
// Import shared helper components
import { FormInput, FormTextarea, FormCheckbox } from "./FormHelpers";

const Compliance = ({
  formData,
  handleInputChange, // Use the standard input handler
  errors,
}) => {
  return (
    <div className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow">
      <FormInput
        label="Company Legal Name"
        id="legalName"
        value={formData.legalName}
        onChange={handleInputChange}
        placeholder="The official registered name of the company"
        error={errors?.legalName}
        required
        icon={Scale}
        field="legalName"
      />

      <FormInput
        label="Company Registration Number (Optional)"
        id="registrationNumber"
        value={formData.registrationNumber}
        onChange={handleInputChange}
        placeholder="e.g., EIN, Business Number"
        error={errors?.registrationNumber}
        icon={FileText}
        field="registrationNumber"
      />

      <FormTextarea
        label="Key Licenses & Certifications (Optional)"
        id="licensesCertifications"
        value={formData.licensesCertifications}
        onChange={handleInputChange}
        placeholder="List any important industry-specific licenses or certifications held by the company."
        error={errors?.licensesCertifications}
        rows={3}
        maxLength={500}
        icon={ShieldCheck}
        field="licensesCertifications"
      />

      <FormTextarea
        label="Intellectual Property Overview (Optional)"
        id="ipStatus"
        value={formData.ipStatus}
        onChange={handleInputChange}
        placeholder="Briefly describe the status of key intellectual property (e.g., patents filed, trademarks registered)."
        error={errors?.ipStatus}
        rows={3}
        maxLength={500}
        field="ipStatus"
      />

      {/* Use Checkbox for boolean */}
      <FormCheckbox
        label="Confirm compliance with relevant legal and regulatory requirements."
        id="regulatoryComplianceConfirmation"
        checked={formData.regulatoryComplianceConfirmation}
        onChange={handleInputChange}
        error={errors?.regulatoryComplianceConfirmation}
        field="regulatoryComplianceConfirmation"
      />
    </div>
  );
};

export default Compliance;
