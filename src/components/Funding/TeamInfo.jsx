// Fix the onImageChange function in TeamMemberItem to properly handle file uploads
const onImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const validation = validateImage(file);
  const errorKey = `keyTeamMembers[${index}].image`;
  if (!validation.isValid) {
    setErrors((prev) => ({ ...prev, [errorKey]: validation.message }));
    return;
  }

  setErrors((prev) => ({ ...prev, [errorKey]: null }));
  // Important: Use handleArrayFileChange instead of handleFileChange to preserve the item's other fields
  handleFileChange("keyTeamMembers", index, "image", file);
};

// Same fix for AdvisorItem's onImageChange
const onImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const validation = validateImage(file);
  const errorKey = `advisors[${index}].image`;
  if (!validation.isValid) {
    setErrors((prev) => ({ ...prev, [errorKey]: validation.message }));
    return;
  }

  setErrors((prev) => ({ ...prev, [errorKey]: null }));
  // Important: Use handleArrayFileChange instead of handleFileChange to preserve the item's other fields
  handleFileChange("advisors", index, "image", file);
};
