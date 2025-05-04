import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FAQS } from "../../Utils/constants";

const Faqs = () => {
  return (
    <div className="space-y-4 md:space-y-5">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 md:mb-12">
        Frequently Asked Questions
      </h2>

      {FAQS.map((question, index) => (
        <Question key={question.id || index} question={question} />
      ))}
    </div>
  );
};

function Question({ question }) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
        isOpen ? "shadow-md" : "hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${question.id}`}
        className={`
          flex items-center justify-between 
          w-full 
          p-4 sm:p-5 
          text-left 
          cursor-pointer 
          transition-colors duration-300
          ${
            isOpen
              ? "bg-orange-50 text-orange-700"
              : "bg-white hover:bg-gray-50"
          }
        `}
        onClick={() => setOpen(!isOpen)}
      >
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex-1 pr-4">
          {question.title}
        </h4>
        <div
          className={`flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <ChevronDown
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isOpen ? "text-orange-600" : "text-gray-500"
            }`}
          />
        </div>
      </button>

      <div
        id={`faq-content-${question.id}`}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 sm:p-5 bg-white border-t border-gray-100">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {question.info}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Faqs;
