import React from "react";
import PropTypes from "prop-types";

const Avatar = ({ src, alt, size = "md", status }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const statusClasses = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
  };

  return (
    <div className="relative inline-block">
      <img
        src={src || "/default-avatar.png"} // Fallback to a default avatar if src is not provided
        alt={alt}
        className={`rounded-full object-cover ${sizeClasses[size]}`}
      />
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${statusClasses[status]}`}
        />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  status: PropTypes.oneOf(["online", "offline", "busy"]),
};

export default Avatar;
