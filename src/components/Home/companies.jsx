import React from "react";

// Import actual company logos
const companyLogos = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    alt: "Google Logo",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
    alt: "Microsoft Logo",
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
    alt: "Apple Logo",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
    alt: "Amazon Logo",
  },
  {
    name: "Facebook",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png",
    alt: "Facebook Logo",
  },
  // Add more logos if available
  {
    name: "LinkedIn",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png",
    alt: "LinkedIn Logo",
  },
];

const CompanyPartners = () => {
  // Removed outer section tag, assuming container and padding are handled by Home.jsx
  return (
    <>
      {/* Title and Description */}
      <div className="text-center mb-12 md:mb-16">
        {/* Adjusted heading size */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
          Trusted by Industry Leaders & Innovators
        </h2>
        {/* Adjusted paragraph size */}
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          We collaborate with leading organizations and academic institutions to
          foster innovation and create impactful solutions.
        </p>
      </div>

      {/* Logo Cloud */}
      <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-12 gap-y-8">
        {companyLogos.map((company) => (
          <div
            key={company.name}
            title={company.name} // Add title attribute for tooltip
            className="
               flex-shrink-0 
               px-4 
               py-2 
               flex 
               items-center 
               justify-center 
               grayscale 
               hover:grayscale-0 
               transition-all 
               duration-300 
               opacity-60 
               hover:opacity-100 
               transform 
               hover:scale-110
             "
            style={{ minWidth: "120px" }} // Set a min-width for consistency
          >
            <img
              src={company.logo}
              alt={company.alt}
              // Adjusted max-height for better scaling
              className="max-h-10 sm:max-h-12 max-w-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Optional: Link to partners page or more info */}
      <div className="text-center mt-12 md:mt-16">
        <p className="text-sm text-gray-500">
          And many more driving the future of innovation...
        </p>
        {/* Example link: 
         <a href="/partners" className="mt-4 inline-block text-orange-600 font-semibold hover:underline">
           See all partners
         </a> 
         */}
      </div>
    </>
  );
};

export default CompanyPartners;
