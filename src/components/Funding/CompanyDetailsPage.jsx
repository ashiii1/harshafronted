/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect, useRef } from "react";
import {
  Star,
  MapPin,
  Calendar,
  Map,
  Briefcase,
  DollarSign,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Tag,
  Check,
  ClipboardList,
  Target,
  TrendingUp,
  Scale,
  FileText,
} from "lucide-react";
import { BiDownload } from "react-icons/bi";
import {
  BuildingOffice2Icon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  LinkIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon,
  Bars3Icon,
  InformationCircleIcon,
  PhoneIcon as PhoneIconOutline,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { defaultCompanyData, revenueData } from "../../Utils/constants";
import { useParams, useNavigate } from "react-router-dom";

import {
  AtSignIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  DollarSignIcon,
  ClockIcon,
  MapIcon,
  MailIcon,
  GlobeIcon,
  UserIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  LightbulbIcon,
  Mail as MailIconLucide,
  Phone as PhoneIconLucide,
  User as UserIconLucide,
  Globe as GlobeIconLucide,
  Loader2,
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  BookOpen,
  Award,
  Users as UsersLucide,
  Factory,
  Briefcase as BriefcaseLucide,
} from "lucide-react";
import Badge from "../../Common/Badge.jsx";
// Define defaultLogo
const defaultLogo =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlLCBzYW5zLXNlcmlmIiBmaWxsPSIjOTRhM2I4Ij5Mb2dvPC90ZXh0Pjwvc3ZnPg==";

// Define getSocialIcon function
const getSocialIcon = (platform) => {
  switch (platform?.toLowerCase()) {
    case "linkedin":
      return <LinkedinIcon className="w-5 h-5" />;
    case "twitter":
    case "x":
      return <TwitterIcon className="w-5 h-5" />;
    case "facebook":
      return <FacebookIcon className="w-5 h-5" />;
    case "instagram":
      return <InstagramIcon className="w-5 h-5" />;
    case "github":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    default:
      return <GlobeIconLucide size={20} />;
  }
};

// StatCard Component
const StatCard = ({ icon, label, value, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center space-x-3 shadow-sm transition-shadow hover:shadow-md">
      <div className={`p-2 ${colors[color]} rounded-md`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-md font-semibold text-gray-800">{value || "N/A"}</p>
      </div>
    </div>
  );
};

// MetricRow Component
const MetricRow = ({ label, value, growth, subtext }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <div>
      <p className="text-sm text-gray-700">{label}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
    <div className="text-right">
      <p className="font-semibold text-sm text-gray-800">{value || "N/A"}</p>
      {growth && (
        <p
          className={`text-xs ${
            growth.startsWith("+") ? "text-green-600" : "text-red-600"
          }`}
        >
          {growth}
        </p>
      )}
    </div>
  </div>
);

// TeamMemberCard Component
const TeamMemberCard = ({ member }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center space-x-3">
      <img
        src={
          member.image ||
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSwgc2Fucy1zZXJpZiIgZmlsbD0iIzk0YTNiOCI+VXNlcjwvdGV4dD48L3N2Zz4="
        }
        alt={member.name}
        className="w-12 h-12 rounded-full object-cover border border-gray-300"
      />
      <div>
        <h4 className="font-semibold text-sm text-gray-800">
          {member.name || "Unnamed Member"}
        </h4>
        <p className="text-xs text-gray-600">
          {member.role || "No role specified"}
        </p>
        {member.experience && (
          <p className="text-xs text-gray-500 mt-0.5">{member.experience}</p>
        )}
      </div>
    </div>
  </div>
);

// AdvisorCard Component
const AdvisorCard = ({ advisor }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center space-x-3">
      <img
        src={
          advisor.image ||
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSwgc2Fucy1zZXJpZiIgZmlsbD0iIzk0YTNiOCI+QWR2aXNvcjwvdGV4dD48L3N2Zz4="
        }
        alt={advisor.name}
        className="w-12 h-12 rounded-full object-cover border border-gray-300"
      />
      <div>
        <h4 className="font-semibold text-sm text-gray-800">
          {advisor.name || "Unnamed Advisor"}
        </h4>
        <p className="text-xs text-gray-600">{advisor.role || "Advisor"}</p>
        {advisor.experience && (
          <p className="text-xs text-gray-500 mt-0.5">{advisor.experience}</p>
        )}
        {advisor.affiliation && (
          <p className="text-xs text-blue-600 mt-0.5">{advisor.affiliation}</p>
        )}
      </div>
    </div>
  </div>
);

// FundingRoundCard Component
const FundingRoundCard = ({ round }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2 last:mb-0">
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-semibold text-sm text-gray-800">
          {round.round || "Funding Round"}
        </h4>
        <p className="text-xs text-gray-600">{round.date || "Date Unknown"}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm text-gray-800">
          {round.amount || "Amount Undisclosed"}
        </p>
        {round.investors && (
          <p
            className="text-xs text-gray-600 truncate max-w-[150px]"
            title={round.investors}
          >
            {round.investors}
          </p>
        )}
      </div>
    </div>
  </div>
);

// DocumentCard Component
const DocumentCard = ({ document }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-150">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 overflow-hidden">
        <DocumentIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
        <div className="min-w-0">
          <h4
            className="font-medium text-sm text-gray-800 truncate"
            title={document.name}
          >
            {document.name || "Untitled Document"}
          </h4>
          <p className="text-xs text-gray-600">{document.type || "File"}</p>
        </div>
      </div>
      <button
        className="p-1.5 hover:bg-gray-200 rounded-md ml-2 flex-shrink-0"
        title="Download (Not Implemented)"
      >
        <BiDownload className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  </div>
);

// MarketSizeCard Component
const MarketSizeCard = ({ label, value, description }) => (
  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
    <p className="text-xs text-gray-600 mb-0.5">{label}</p>
    <h4 className="text-lg font-semibold text-gray-800">{value || "N/A"}</h4>
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </div>
);

// SocialLinkCard Component
const SocialLinkCard = ({ platform, url, icon }) => {
  if (!url) return null;

  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;

  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-2.5">
        <div className="text-gray-500 flex-shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 capitalize">
            {platform}
          </p>
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-xs hover:underline truncate block"
            title={fullUrl}
          >
            {displayUrl}
          </a>
        </div>
      </div>
    </div>
  );
};

// CertificationBadge Component
const CertificationBadge = ({ text }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-1.5 mb-1.5">
    <ShieldCheckIcon className="w-3 h-3 mr-1" />
    {text}
  </span>
);

// Section Wrapper Component
const DetailSection = ({ title, icon: Icon, children, id, subtitle }) => (
  <section id={id} className="mb-6 lg:mb-8 pt-4 scroll-mt-20">
    <div className="flex items-center mb-1">
      <Icon className="w-5 h-5 text-orange-600 mr-2" />
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    {subtitle && <p className="text-sm text-gray-500 mb-3 ml-7">{subtitle}</p>}
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      {children}
    </div>
  </section>
);

// ContactFounderForm Component
const ContactFounderForm = ({ company, onCancel }) => {
  const founderName = company?.founderName || "Founder";
  const founderEmail = company?.founderEmail || "";

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    investmentAmount: "",
    message: "",
    meetingRequest: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactForm({
      ...contactForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log("Submitting contact form:", {
      ...contactForm,
      targetCompanyName: company?.companyName,
      founderName: founderName,
      founderEmail: founderEmail,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send message.");
      console.error("Contact form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
          <CheckIcon className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-1">
          Message Sent!
        </h3>
        <p className="text-sm text-green-700">
          Your message to {founderName} at {company?.companyName} has been sent.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setError(null);
            setContactForm({
              name: "",
              email: "",
              company: "",
              investmentAmount: "",
              message: "",
              meetingRequest: false,
            });
          }}
          className="mt-3 text-sm text-green-700 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        Contact {founderName} at {company?.companyName || "this company"}
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        Express your interest in investing or collaborating.
      </p>

      {error && (
        <div className="bg-red-50 p-3 rounded-md border border-red-200">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Your Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={contactForm.name}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={contactForm.email}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Your Company / Affiliation
          </label>
          <input
            type="text"
            name="company"
            id="company"
            required
            value={contactForm.company}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="investmentAmount"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Potential Investment Amount (Optional)
          </label>
          <select
            name="investmentAmount"
            id="investmentAmount"
            value={contactForm.investmentAmount}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-white"
          >
            <option value="">Select amount range</option>
            <option value="$10K-$50K">$10K-$50K</option>
            <option value="$50K-$100K">$50K-$100K</option>
            <option value="$100K-$250K">$100K-$250K</option>
            <option value="$250K-$500K">$250K-$500K</option>
            <option value="$500K-$1M">$500K-$1M</option>
            <option value="$1M+">$1M+</option>
            <option value="Undisclosed">Prefer not to say</option>
          </select>
        </div>
      </div>
      <div className="col-span-1 md:col-span-2">
        <label
          htmlFor="message"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          required
          value={contactForm.message}
          onChange={handleInputChange}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          placeholder="Introduce yourself and explain your interest..."
        />
      </div>
      <div className="flex items-center pt-1">
        <input
          id="meetingRequest"
          name="meetingRequest"
          type="checkbox"
          checked={contactForm.meetingRequest}
          onChange={handleInputChange}
          className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
        <label
          htmlFor="meetingRequest"
          className="ml-2 block text-sm text-gray-800"
        >
          Request a meeting
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </div>
    </form>
  );
};

// ContactInformationSection Component
const ContactInformationSection = ({ company }) => {
  const scrollToForm = () => {
    document
      .getElementById("contact-founder")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const socialPlatforms = company?.socialLinks
    ? Object.entries(company.socialLinks).filter(([_, url]) => url)
    : [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <UserIconLucide size={18} className="mr-2 text-gray-600" />
            Founder Contact
          </h3>
          <div className="space-y-3">
            {company?.founderName && (
              <div className="flex items-center text-sm">
                <UserIconLucide
                  size={16}
                  className="text-gray-500 mr-3 flex-shrink-0"
                />
                <span className="text-gray-700 font-medium">
                  {company.founderName}
                </span>
              </div>
            )}
            {company?.founderEmail && (
              <div className="flex items-center text-sm">
                <AtSignIcon
                  size={16}
                  className="text-gray-500 mr-3 flex-shrink-0"
                />
                <a
                  href={`mailto:${company.founderEmail}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {company.founderEmail}
                </a>
              </div>
            )}
            {company?.founderPhone && (
              <div className="flex items-center text-sm">
                <PhoneIconLucide
                  size={16}
                  className="text-gray-500 mr-3 flex-shrink-0"
                />
                <a
                  href={`tel:${company.founderPhone}`}
                  className="text-blue-600 hover:underline"
                >
                  {company.founderPhone}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <LinkIcon size={18} className="mr-2 text-gray-600" />
            Online Presence
          </h3>
          <div className="space-y-3">
            {company?.website && (
              <div className="flex items-center text-sm">
                <GlobeIconLucide
                  size={16}
                  className="text-gray-500 mr-3 flex-shrink-0"
                />
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {company.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            {socialPlatforms.length > 0 ? (
              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Social Media
                </h4>
                <div className="flex items-center space-x-4">
                  {socialPlatforms.map(([platform, url]) => (
                    <SocialLinkCard
                      key={platform}
                      platform={platform}
                      url={url}
                      icon={getSocialIcon(platform)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              !company?.website && (
                <p className="text-sm text-gray-500 italic">
                  No website or social media links provided.
                </p>
              )
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-6">
        <button
          onClick={scrollToForm}
          className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
          Contact Founder / Express Interest
        </button>
      </div>
    </div>
  );
};

const InvestorQuickActions = ({ company }) => {
  const scrollToForm = () => {
    document
      .getElementById("contact-founder")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        title="Add to Watchlist"
      >
        <Star className="w-4 h-4" />
      </button>
      <button
        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        title="Share"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        onClick={scrollToForm}
        className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-md hover:bg-orange-700 transition-colors"
      >
        Contact
      </button>
    </div>
  );
};

// FeatureCard Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-indigo-50 rounded-md flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-semibold text-sm text-gray-800">
          {title || "Feature"}
        </h4>
        <p className="text-xs text-gray-600 mt-1">
          {description || "No description provided."}
        </p>
      </div>
    </div>
  </div>
);

// NEW FounderSection Component
const FounderSection = ({ company }) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4 mb-2">
      {/* Placeholder for founder image if available in data later */}
      {/* <img src={company.founderImage || defaultFounderImage} alt={company.founderName} className="w-16 h-16 rounded-full object-cover border border-gray-300"/> */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {company.founderName || "Founder Name Unavailable"}
        </h3>
        {/* Link to LinkedIn if available */}
        {company.founderLinkedIn && (
          <a
            href={
              company.founderLinkedIn.startsWith("http")
                ? company.founderLinkedIn
                : `https://${company.founderLinkedIn}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-blue-600 hover:underline mt-1"
          >
            <LinkedinIcon className="w-3.5 h-3.5 mr-1" />
            LinkedIn Profile
          </a>
        )}
      </div>
    </div>

    {company.founderBio && (
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-1">Bio</h4>
        <p className="text-sm text-gray-600">{company.founderBio}</p>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pt-2">
      {company.founderExperience && (
        <div className="flex items-start">
          <BriefcaseLucide
            size={16}
            className="text-gray-500 mr-3 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-xs text-gray-500">Experience</p>
            <p className="text-sm text-gray-700 font-medium">
              {company.founderExperience}
            </p>
          </div>
        </div>
      )}
      {company.founderEducation && (
        <div className="flex items-start">
          <BookOpen
            size={16}
            className="text-gray-500 mr-3 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-xs text-gray-500">Education</p>
            <p className="text-sm text-gray-700 font-medium">
              {company.founderEducation}
            </p>
          </div>
        </div>
      )}
    </div>

    {company.founderAchievements && (
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-1.5 flex items-center">
          <Award size={16} className="mr-2 text-yellow-500" />
          Key Achievements
        </h4>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
          {company.founderAchievements}
        </p>
      </div>
    )}
  </div>
);

const CompanyDetailsPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = [
    { id: "overview", label: "Overview", icon: BuildingOffice2Icon },
    { id: "founder", label: "Founder", icon: UserIconLucide },
    { id: "team", label: "Team & Advisors", icon: UsersIcon },
    { id: "business", label: "Business Details", icon: BriefcaseIcon },
    { id: "market-traction", label: "Market & Traction", icon: Target },
    { id: "financials", label: "Financials", icon: CurrencyDollarIcon },
    { id: "future", label: "Future Plans & Vision", icon: CalendarIcon },
    { id: "documents", label: "Documents", icon: DocumentIcon },
    { id: "presence", label: "Digital Presence", icon: GlobeAltIcon },
    { id: "compliance", label: "Compliance", icon: ShieldCheckIcon },
    { id: "contact", label: "Contact Information", icon: MailIconLucide },
    {
      id: "contact-founder",
      label: "Contact Founder",
      icon: ChatBubbleLeftRightIcon,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    console.log(`Fetching data for companyId: ${companyId}`);

    const timer = setTimeout(() => {
      let foundCompany = defaultCompanyData;

      if (foundCompany) {
        const robustCompanyData = {
          companyName: foundCompany.companyName || "Unnamed Company",
          companyLogo: foundCompany.companyLogo,
          tagline: foundCompany.tagline || "",
          pitch: foundCompany.pitch || "",
          sector: foundCompany.sector || "N/A",
          industry: foundCompany.industry || "N/A",
          stage: foundCompany.stage || "N/A",
          foundedDate: foundCompany.foundedDate || "N/A",
          location: foundCompany.location || "N/A",
          estimatedValuation: foundCompany.estimatedValuation || "N/A",
          founderName: foundCompany.founderName || "",
          founderEmail: foundCompany.founderEmail || "",
          founderPhone: foundCompany.founderPhone || "",
          founderLinkedIn: foundCompany.founderLinkedIn || "",
          founderBio: foundCompany.founderBio || "",
          founderExperience: foundCompany.founderExperience || "",
          founderEducation: foundCompany.founderEducation || "",
          founderAchievements: foundCompany.founderAchievements || "",
          teamSize: foundCompany.teamSize || "N/A",
          keyTeamMembers: foundCompany.keyTeamMembers || [],
          advisors: foundCompany.advisors || [],
          description: foundCompany.description || "",
          businessModel: foundCompany.businessModel || "",
          revenueModel: foundCompany.revenueModel || "",
          marketSize: foundCompany.marketSize || "",
          competition: foundCompany.competition || "",
          uniqueValue: foundCompany.uniqueValue || "",
          intellectualProperty: foundCompany.intellectualProperty || "",
          revenue: foundCompany.revenue || "N/A",
          revenueGrowth: foundCompany.revenueGrowth || "N/A",
          burnRate: foundCompany.burnRate || "N/A",
          runway: foundCompany.runway || "N/A",
          pastInvestments: foundCompany.pastInvestments || "",
          investmentNeeded: foundCompany.investmentNeeded || "N/A",
          sharesDiluted: foundCompany.sharesDiluted || "N/A",
          useOfFunds: foundCompany.useOfFunds || "",
          targetMarket: foundCompany.targetMarket || "",
          marketValidation: foundCompany.marketValidation || "",
          customerBase: foundCompany.customerBase || "",
          partnerships: foundCompany.partnerships || "",
          metrics: foundCompany.metrics || {},
          website: foundCompany.website || "",
          socialLinks: foundCompany.socialLinks || {},
          pressLinks: foundCompany.pressLinks || [],
          documents: foundCompany.documents || [],
          roadmap: foundCompany.roadmap || "",
          expansionPlans: foundCompany.expansionPlans || "",
          exitStrategy: foundCompany.exitStrategy || "",
          registrationDetails: foundCompany.registrationDetails || "",
          taxCompliance: foundCompany.taxCompliance || "",
          certifications: foundCompany.certifications || [],
          vision: foundCompany.vision || "",
          market: foundCompany.market || {},
          traction: foundCompany.traction || {},
          competitiveAdvantage: foundCompany.competitiveAdvantage || "",
          fundingHistory: foundCompany.fundingHistory || [],
        };
        setCompany(robustCompanyData);
        setError(null);
      } else {
        setError(`Failed to load company data.`);
        setCompany(null);
        console.error(`Company data simulation failed for ID: ${companyId}`);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [companyId]);

  useEffect(() => {
    if (isLoading || error) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (
              entry.intersectionRatio > 0.5 ||
              entry.boundingClientRect.top < window.innerHeight / 3
            ) {
              setActiveSection(entry.target.id);
            }
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.5, 0.9] }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [sections, isLoading, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-600">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
          <p className="text-lg font-medium">Loading Company Details...</p>
          <p className="text-sm">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
          <InformationCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Failed to Load Details
          </h2>
          <p className="text-sm text-red-700 mb-4">
            {error ||
              "Could not retrieve company information. Please try again later or check the company ID."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const CompanyOverview = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <img
          src={company.companyLogo || defaultLogo}
          alt={`${company.companyName} logo`}
          className="w-20 h-20 rounded-lg object-contain border border-gray-200 p-1 mr-0 mb-4 sm:mr-5 sm:mb-0 flex-shrink-0 bg-white"
          onError={(e) => {
            e.target.src = defaultLogo;
          }}
        />
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-gray-900">
            {company.companyName}
          </h1>
          <p className="text-gray-600 text-md mt-1">{company.tagline}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge color="orange">{company.sector}</Badge>
        <Badge color="purple">{company.industry}</Badge>
        <Badge color="blue">{company.stage}</Badge>
        <Badge color="emerald">
          <MapPinIcon className="w-3 h-3 mr-1 inline-block" />{" "}
          {company.location}
        </Badge>
        <Badge color="gray">
          <CalendarIcon className="w-3 h-3 mr-1 inline-block" /> Founded{" "}
          {company.foundedDate}
        </Badge>
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Company Description
        </h3>
        <p className="text-sm text-gray-700">
          {company.description || "No company description provided."}
        </p>
      </div>

      {company.pitch && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Elevator Pitch
          </h3>
          <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-md border border-gray-200">
            {company.pitch}
          </p>
        </div>
      )}
    </div>
  );

  const TeamSection = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-3">Core Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {company.keyTeamMembers && company.keyTeamMembers.length > 0 ? (
            company.keyTeamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">
              No key team members listed.
            </p>
          )}
        </div>
      </div>

      {company.advisors && company.advisors.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3">Advisors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {company.advisors.map((advisor, index) => (
              <AdvisorCard key={index} advisor={advisor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const FinancialsSection = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Funding Details
        </h3>
        <div className="space-y-1">
          <MetricRow
            label="Investment Needed"
            value={company.investmentNeeded}
          />
          <MetricRow
            label="Estimated Valuation"
            value={company.estimatedValuation}
          />
          <MetricRow
            label="Equity Offered (Dilution)"
            value={company.sharesDiluted}
          />
          <MetricRow label="Past Investments" value={company.pastInvestments} />
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Funding History
        </h3>
        {company.fundingHistory && company.fundingHistory.length > 0 ? (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {company.fundingHistory.map((round, index) => (
              <FundingRoundCard key={index} round={round} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No funding history provided.
          </p>
        )}
      </div>
    </div>
  );

  const DocumentsSection = () => (
    <div>
      <h3 className="text-md font-semibold text-gray-800 mb-3">Data Room</h3>
      {company.documents && company.documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {company.documents.map((doc, index) => (
            <DocumentCard key={index} document={doc} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No documents available.</p>
      )}
    </div>
  );

  const MarketTractionSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Market Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <MarketSizeCard
            label="Total Addressable Market (TAM)"
            value={company.market?.tam}
            description="Entire potential market"
          />
          <MarketSizeCard
            label="Serviceable Available Market (SAM)"
            value={company.market?.sam}
            description="Portion reachable"
          />
          <MarketSizeCard
            label="Serviceable Obtainable Market (SOM)"
            value={company.market?.som}
            description="Realistic target"
          />
        </div>
        {company.marketSize ? (
          <div className="space-y-1 text-gray-300">
            <p>
              <span className="font-medium text-gray-100">TAM:</span>{" "}
              {company.marketSize.tam || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-100">SAM:</span>{" "}
              {company.marketSize.sam || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-100">SOM:</span>{" "}
              {company.marketSize.som || "N/A"}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 italic">
            Market size data not available.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Target Market
          </h3>
          <p className="text-sm text-gray-700">
            {company.targetMarket || "N/A"}
          </p>
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Competition
          </h3>
          <p className="text-sm text-gray-700">
            {company.competition || "N/A"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Competitive Advantage
        </h3>
        {company.competitiveAdvantage && (
          <p className="text-sm text-gray-700">
            {company.competitiveAdvantage}
          </p>
        )}
      </div>
    </div>
  );

  const BusinessDetailsSection = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Business Model
        </h3>
        <p className="text-sm text-gray-700">
          {company.businessModel || "Not specified."}
        </p>
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Revenue Model
        </h3>
        <p className="text-sm text-gray-700">
          {company.revenueModel || "Not specified."}
        </p>
      </div>
      {company.uniqueValue && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Unique Value Proposition
          </h3>
          <p className="text-sm text-gray-700">{company.uniqueValue}</p>
        </div>
      )}
      {company.intellectualProperty && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Intellectual Property
          </h3>
          <p className="text-sm text-gray-700">
            {company.intellectualProperty}
          </p>
        </div>
      )}
    </div>
  );

  const DigitalPresenceSection = () => {
    const socialPlatforms = company?.socialLinks
      ? Object.entries(company.socialLinks).filter(([_, url]) => url)
      : [];

    return (
      <div className="space-y-5">
        {company.website && (
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              Website
            </h3>
            <a
              href={
                company.website.startsWith("http")
                  ? company.website
                  : `https://${company.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm break-all"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        {socialPlatforms.length > 0 && (
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              Social Media
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {socialPlatforms.map(([platform, url]) => (
                <SocialLinkCard
                  key={platform}
                  platform={platform}
                  url={url}
                  icon={getSocialIcon(platform)}
                />
              ))}
            </div>
          </div>
        )}

        {company.pressLinks && company.pressLinks.length > 0 && (
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              Press Mentions
            </h3>
            <ul className="space-y-2">
              {company.pressLinks.map((linkText, i) => {
                const isUrl =
                  linkText.includes("http") || linkText.includes("www.");
                const url = isUrl
                  ? linkText.startsWith("http")
                    ? linkText
                    : `https://${linkText}`
                  : null;
                const display = isUrl
                  ? linkText.replace(/^https?:\/\//, "")
                  : linkText;

                return (
                  <li
                    key={i}
                    className="text-sm text-gray-700 flex items-center"
                  >
                    <ExternalLink
                      size={14}
                      className="mr-2 text-gray-400 flex-shrink-0"
                    />
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {display}
                      </a>
                    ) : (
                      <span>{display}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {!company.website &&
          socialPlatforms.length === 0 &&
          (!company.pressLinks || company.pressLinks.length === 0) && (
            <p className="text-sm text-gray-500 italic">
              No digital presence information available.
            </p>
          )}
      </div>
    );
  };

  const FuturePlansSection = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Company Vision
        </h3>
        <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-md border border-gray-200">
          {company.vision || "No vision provided."}
        </p>
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Product Roadmap
        </h3>
        <p className="text-sm text-gray-700">
          {company.roadmap || "Not specified."}
        </p>
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Expansion Plans
        </h3>
        <p className="text-sm text-gray-700">
          {company.expansionPlans || "Not specified."}
        </p>
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Exit Strategy
        </h3>
        <p className="text-sm text-gray-700">
          {company.exitStrategy || "Not specified."}
        </p>
      </div>
    </div>
  );

  const ComplianceSection = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Legal & Registration
        </h3>
        <p className="text-sm text-gray-700 mb-1">
          <span className="font-medium">Structure:</span>{" "}
          {company.registrationDetails || "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Tax Compliance:</span>{" "}
          {company.taxCompliance || "N/A"}
        </p>
      </div>
      {company.certifications && company.certifications.length > 0 ? (
        <div className="flex flex-wrap">
          {company.certifications.map((cert, i) => (
            <CertificationBadge key={i} text={cert} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          No certifications listed.
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 p-4 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <div className="mb-4">
          <h2
            className="text-lg font-semibold text-gray-800 truncate"
            title={company.companyName}
          >
            {company.companyName || "Company Details"}
          </h2>
        </div>
        <nav className="space-y-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ${
                activeSection === section.id
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <section.icon
                className={`w-5 h-5 mr-2.5 flex-shrink-0 ${
                  activeSection === section.id
                    ? "text-orange-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
                aria-hidden="true"
              />
              <span className="truncate">{section.label}</span>
              {activeSection === section.id && (
                <ChevronRightIcon className="w-4 h-4 ml-auto text-orange-500" />
              )}
            </a>
          ))}
        </nav>
      </aside>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          aria-hidden="true"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {company.companyName || "Company Details"}
              </h2>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(section.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors duration-150 ${
                    activeSection === section.id
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  \
                  <section.icon
                    className={`w-5 h-5 mr-2.5 flex-shrink-0 ${
                      activeSection === section.id
                        ? "text-orange-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{section.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200 lg:hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800 truncate mr-2">
              {sections.find((s) => s.id === activeSection)?.label ||
                company.companyName ||
                "Details"}
            </h1>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto focus:outline-none p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="hidden lg:block border-b border-gray-200 pb-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {company.companyName}
                </h1>
                <p className="text-sm text-gray-600">
                  {company.tagline || "Innovating the future."}
                </p>
              </div>
              <InvestorQuickActions company={company} />
            </div>
          </div>

          <DetailSection
            title="Overview"
            icon={BuildingOffice2Icon}
            id="overview"
          >
            <CompanyOverview />
          </DetailSection>
          <DetailSection title="Founder" icon={UserIconLucide} id="founder">
            <FounderSection company={company} />
          </DetailSection>
          <DetailSection title="Team & Advisors" icon={UsersIcon} id="team">
            <TeamSection />
          </DetailSection>
          <DetailSection
            title="Business Details"
            icon={BriefcaseIcon}
            id="business"
          >
            <BusinessDetailsSection />
          </DetailSection>
          <DetailSection
            title="Market & Traction"
            icon={Target}
            id="market-traction"
          >
            <MarketTractionSection />
          </DetailSection>
          <DetailSection
            title="Financials"
            icon={CurrencyDollarIcon}
            id="financials"
          >
            <FinancialsSection />
          </DetailSection>
          <DetailSection
            title="Future Plans & Vision"
            icon={CalendarIcon}
            id="future"
          >
            <FuturePlansSection />
          </DetailSection>
          <DetailSection title="Documents" icon={DocumentIcon} id="documents">
            <DocumentsSection />
          </DetailSection>
          <DetailSection
            title="Digital Presence"
            icon={GlobeAltIcon}
            id="presence"
          >
            <DigitalPresenceSection />
          </DetailSection>
          <DetailSection
            title="Compliance"
            icon={ShieldCheckIcon}
            id="compliance"
          >
            <ComplianceSection />
          </DetailSection>
          <DetailSection
            title="Contact Information"
            icon={MailIconLucide}
            id="contact"
          >
            <ContactInformationSection company={company} />
          </DetailSection>
          <DetailSection
            title="Contact Founder"
            icon={ChatBubbleLeftRightIcon}
            id="contact-founder"
            subtitle="Reach out to express interest or request a meeting"
          >
            <ContactFounderForm company={company} />
          </DetailSection>
        </main>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;