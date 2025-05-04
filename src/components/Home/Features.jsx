import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { APP_FEATURES } from "../../Utils/constants";

const FeatureCard = ({ Image, heading, tagline, link, btnName, Icon }) => {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={Image}
            alt={heading}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        </div>

        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            {Icon && (
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            )}
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              {heading}
            </h3>
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-grow mb-4 sm:mb-6">
            {tagline}
          </p>

          <Link to={link} className="mt-auto group">
            <button
              className="w-full py-2.5 px-4 sm:py-3 sm:px-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-md 
              flex items-center justify-center gap-2 
              transition-all duration-300 
              hover:from-orange-600 hover:to-orange-700 
              hover:shadow-lg text-sm sm:text-base"
            >
              <span>{btnName}</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {APP_FEATURES.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default Features;
