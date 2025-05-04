import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Grid,
  List,
  ArrowRight,
  Star,
  MapPin,
  Users,
  Calendar,
  BarChart2,
  Briefcase,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Tag,
  Check,
} from "react-feather";
import {
  Building,
  Loader2,
  AlertTriangle,
  Briefcase as BriefcaseLucide,
  Tag as TagLucide,
  MapPin as MapPinLucide,
  Link as LinkIcon,
  Star as StarLucide,
  Users as UsersLucide,
  ChevronRight,
  BarChart4,
  Zap,
  Target,
  PiggyBank,
  LineChart,
  Network,
} from "lucide-react";
import {
  Building2,
  // MapPin,
  // Calendar,
  // Tag,
  Award,
  // Briefcase,
  // Link as LinkIcon,
  // ArrowRight,
  // TrendingUp,
  // Users,
  // DollarSign,
  // Star,
  // ExternalLink,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TermsAndConditions from "./TermsAndConditions";

// Using sample data from the provided schema
import { sampleCompanies } from "../../Utils/constants";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    stage: "all",
    sector: "all",
    fundingRange: "all",
    location: "all",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [termsConditionsVisible, setTermsConditionsVisible] = useState(false);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call and initial data processing
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace sampleCompanies with actual API fetch
      const fetchedCompanies = sampleCompanies;

      setAllCompanies(fetchedCompanies);
      setFeaturedCompanies(
        fetchedCompanies.filter((company) => company.highlighted)
      );
    } catch (err) {
      console.error("Failed to load company data:", err);
      setError("Could not load startup data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sectors = useMemo(
    () => [...new Set(sampleCompanies.map((c) => c.sector))],
    []
  );
  const stages = useMemo(
    () => [...new Set(sampleCompanies.map((c) => c.stage))],
    []
  );
  const locations = useMemo(
    () => [...new Set(sampleCompanies.map((c) => c.location))],
    []
  );

  const filteredAndSortedCompanies = useMemo(() => {
    let result = allCompanies;

    // Apply Search
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply Filters
    if (filters.stage !== "all") {
      result = result.filter((c) => c.stage === filters.stage);
    }
    if (filters.sector !== "all") {
      result = result.filter((c) => c.sector === filters.sector);
    }

    // Apply Sorting
    if (sortBy === "newest") {
      result = result.sort(
        (a, b) => new Date(b.foundedDate) - new Date(a.foundedDate)
      );
    } else if (sortBy === "funding") {
      result = result.sort((a, b) => b.investmentNeeded - a.investmentNeeded);
    } else if (sortBy === "growth") {
      result = result.sort((a, b) => b.metrics.growth - a.metrics.growth);
    }

    return result;
  }, [allCompanies, filters, sortBy, searchTerm]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    colorClass = "text-orange-600",
    secondaryValue,
  }) => (
    <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 flex items-center gap-4">
      <div
        className={`p-2.5 rounded-lg bg-opacity-10 ${colorClass.replace(
          "text-",
          "bg-"
        )}`}
      >
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClass}`} />
      </div>
      <div className="flex-grow">
        <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5">
          {title}
        </h3>
        <p className="text-xl sm:text-2xl font-semibold text-gray-800">
          {value}
        </p>
        {secondaryValue && (
          <p className="text-xs text-gray-500 mt-0.5">{secondaryValue}</p>
        )}
      </div>
    </div>
  );

  const Badge = ({ text, color = "gray", icon: Icon }) => {
    const colors = {
      gray: "bg-gray-100 text-gray-700",
      orange: "bg-orange-100 text-orange-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
      blue: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          colors[color] || colors.gray
        }`}
      >
        {Icon && <Icon size={12} />} {text}
      </span>
    );
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    // Remove any existing currency symbols
    const numericValue = value.replace(/[$,]/g, "");

    // Format with commas for thousands
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    try {
      return formatter.format(Number(numericValue));
    } catch (e) {
      return value.startsWith("$") ? value : `$${value}`;
    }
  };

  const CompanyCardGrid = ({ company }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleCardClick = () => navigate(`/companydetails/${company.id}`);

    // Format funding amount for display
    const formattedFunding = formatCurrency(
      company.fundingAmountSought || company.investmentNeeded || ""
    );

    // Get first letter of company name for logo placeholder
    const firstLetter = company.companyName?.charAt(0) || "C";

    // Format tagline
    const tagline = company.tagline || company.pitch || "";

    // Format metrics for display
    const formatMetric = (metric) => {
      if (!metric) return null;
      if (typeof metric === "string" && metric.trim() === "") return null;
      return metric;
    };

    // Financial metrics
    const mrr = formatMetric(company.tractionMetrics?.mrr);
    const mau = formatMetric(company.tractionMetrics?.mau);
    const revenue = formatMetric(company.financialSummary?.revenue);
    const growthRate = formatMetric(company.tractionMetrics?.growthRate) || "";

    // Prepare metrics array (only include non-empty values)
    const metrics = [
      mrr && {
        label: "MRR",
        value: mrr,
        icon: <LineChart size={16} className="text-emerald-400" />,
      },
      mau && {
        label: "Users",
        value: mau,
        icon: <Users size={16} className="text-indigo-400" />,
      },
      revenue && {
        label: "Revenue",
        value: revenue,
        icon: <PiggyBank size={16} className="text-purple-400" />,
      },
      growthRate && {
        label: "Growth",
        value: growthRate,
        icon: <TrendingUp size={16} className="text-blue-400" />,
      },
    ].filter(Boolean);

    return (
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer flex flex-col h-full group"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {/* Animated Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20 opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)]"></div>

        {/* Glowing Border Effect on Hover */}
        <div
          className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(90deg, rgba(56,189,248,0) 0%, rgba(56,189,248,0.3) 50%, rgba(56,189,248,0) 100%)",
            backgroundSize: "200% 100%",
            animation: isHovered ? "shimmer 2s infinite" : "none",
          }}
        ></div>

        {/* Card Header with Logo & Name */}
        <div className="relative pt-6 px-6 pb-3">
          <div className="flex items-start">
            {/* Company Logo with Glow Effect */}
            <div className="mr-4 relative">
              <div
                className={`absolute inset-0 rounded-2xl bg-blue-500/30 blur-md transition-opacity duration-300 ${
                  isHovered ? "opacity-70" : "opacity-0"
                }`}
              ></div>
              <div className="w-16 h-16 rounded-2xl bg-slate-800 shadow-lg flex items-center justify-center border border-slate-700 overflow-hidden transform group-hover:scale-105 transition-all duration-300 relative z-10">
                {company.companyLogo ? (
                  <img
                    src={company.companyLogo}
                    alt={`${company.companyName} logo`}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {firstLetter}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Company Name & Featured Badge */}
            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {company.companyName}
                </h3>

                {company.highlighted && (
                  <span className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2.5 py-0.5 rounded-full shadow-md">
                    <Star size={12} className="animate-pulse" /> Featured
                  </span>
                )}
              </div>

              {tagline && (
                <p className="text-sm text-slate-300 line-clamp-1 mt-1 group-hover:text-indigo-200">
                  {tagline}
                </p>
              )}

              {/* Stage Tag with Glow */}
              {company.stage && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-500/30">
                    <Network size={12} />
                    <span>{company.stage}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider with Glowing Line */}
        <div className="px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-grow flex flex-col gap-5 relative z-10">
          {/* Tags Row */}
          <div className="flex flex-wrap gap-2">
            {company.sector && (
              <span className="text-xs bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <Tag size={12} className="text-indigo-400" /> {company.sector}
              </span>
            )}

            {company.industry && (
              <span className="text-xs bg-purple-900/40 text-purple-300 border border-purple-700/50 px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <Building2 size={12} className="text-purple-400" />{" "}
                {company.industry}
              </span>
            )}
          </div>

          {/* Company Info with Futuristic Icons */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
            {company.location && (
              <div className="flex items-center gap-2 group/item">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover/item:border-blue-500 transition-colors">
                  <MapPin size={15} className="text-blue-400" />
                </div>
                <span
                  className="text-slate-300 truncate group-hover/item:text-blue-300 transition-colors"
                  title={company.location}
                >
                  {company.location}
                </span>
              </div>
            )}

            {company.foundedDate && (
              <div className="flex items-center gap-2 group/item">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover/item:border-emerald-500 transition-colors">
                  <Calendar size={15} className="text-emerald-400" />
                </div>
                <span className="text-slate-300 truncate group-hover/item:text-emerald-300 transition-colors">
                  {company.foundedDate.includes("Founded")
                    ? company.foundedDate
                    : `Founded ${company.foundedDate}`}
                </span>
              </div>
            )}

            {company.teamSize && (
              <div className="flex items-center gap-2 group/item">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover/item:border-purple-500 transition-colors">
                  <Users size={15} className="text-purple-400" />
                </div>
                <span className="text-slate-300 truncate group-hover/item:text-purple-300 transition-colors">
                  {company.teamSize} team members
                </span>
              </div>
            )}

            {company.estimatedValuation && (
              <div className="flex items-center gap-2 group/item">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover/item:border-amber-500 transition-colors">
                  <Award size={15} className="text-amber-400" />
                </div>
                <span className="text-slate-300 truncate group-hover/item:text-amber-300 transition-colors">
                  {company.estimatedValuation.includes("Valuation")
                    ? company.estimatedValuation
                    : `Valuation: ${formatCurrency(
                        company.estimatedValuation
                      )}`}
                </span>
              </div>
            )}
          </div>

          {/* Metrics Display with Animated Charts */}
          {metrics.length > 0 && (
            <div className="mt-1">
              <p className="text-xs text-indigo-300 mb-2 font-medium flex items-center gap-1.5">
                <BarChart4 size={14} className="text-indigo-400" /> KEY METRICS
              </p>
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-slate-700/80 group-hover:border-indigo-500/30 transition-colors relative overflow-hidden"
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      {metric.icon} {metric.label}
                    </div>
                    <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Website Link with Hover Effect */}
          {company.website && (
            <div className="flex items-center gap-2 mt-1 group/link">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover/link:border-cyan-500 transition-colors">
                <LinkIcon size={15} className="text-cyan-400" />
              </div>
              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-cyan-300 hover:text-cyan-100 transition-colors text-sm flex items-center gap-1.5 relative"
              >
                <span className="truncate">
                  {company.website.replace(/^https?:\/\//, "")}
                </span>
                <ExternalLink size={12} className="flex-shrink-0" />
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 group-hover/link:w-full transition-all duration-300"></span>
              </a>
            </div>
          )}
        </div>

        {/* Card Footer with Glowing Button */}
        <div className="mt-auto border-t border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-300 mb-1 font-medium flex items-center gap-1.5">
                <Zap size={14} className="text-indigo-400" /> INVESTMENT
                OPPORTUNITY
              </p>
              <p className="text-lg text-white font-bold group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                <DollarSign
                  size={18}
                  className={`${
                    isHovered ? "text-indigo-400" : "text-indigo-500"
                  } transition-colors`}
                />
                {formattedFunding || "Contact for details"}
              </p>
            </div>

            <div className="relative">
              {/* Glowing background effect for button */}
              <div
                className={`absolute inset-0 rounded-xl bg-indigo-500/30 blur-md transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              ></div>

              <button
                className="relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center gap-2 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                aria-label={`View details for ${company.companyName}`}
              >
                <span>Explore</span>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${
                    isHovered ? "translate-x-0.5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </div>
    );
  };

  const CompanyCardList = ({ company }) => {
    const navigate = useNavigate();
    const handleCardClick = () => navigate(`/companydetails/${company.id}`);
    const stageColor =
      company.stage === "Seed"
        ? "green"
        : company.stage === "Series A"
        ? "purple"
        : "blue";
    const borderClass = company.highlighted
      ? "border-orange-200 hover:border-orange-300"
      : "border-gray-200 hover:border-gray-300";

    return (
      <div
        onClick={handleCardClick}
        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300  p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 group cursor-pointer ${borderClass}`}
      >
        {/* Logo */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center p-1 shadow-sm">
          {company.companyLogo ? (
            <img
              src={company.companyLogo}
              alt={`${company.companyName} logo`}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xl font-semibold text-gray-400">
              {company.companyName.charAt(0)}
            </span>
          )}
        </div>

        {/* Main Info */}
        <div className="flex-grow min-w-0">
          {/* Header: Name & Badges */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
            <h3
              className="text-base font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors"
              title={company.companyName}
            >
              {company.companyName}
            </h3>
            <div className="flex items-center gap-2 mt-1 sm:mt-0 flex-shrink-0">
              {company.highlighted && (
                <Badge text="Featured" color="orange" icon={StarLucide} />
              )}
              <Badge text={company.stage} color={stageColor} />
            </div>
          </div>
          {/* Pitch */}
          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
            {company.pitch || company.tagline}
          </p>
          {/* Metadata Row */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 group-hover:text-gray-700 transition-colors">
            <span className="inline-flex items-center gap-1">
              <MapPinLucide size={12} className="text-gray-400" />
              <span title={company.location} className="truncate">
                {company.location}
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <TagLucide size={12} /> {company.sector}
            </span>
            <span className="inline-flex items-center gap-1">
              <UsersLucide size={12} /> {company.teamSize} Team
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} /> Founded {company.foundedDate}
            </span>
          </div>
        </div>

        {/* Funding & Action */}
        <div className="w-full sm:w-auto flex sm:flex-col items-end justify-between sm:justify-center mt-2 sm:mt-0 sm:ml-3 flex-shrink-0 gap-1.5">
          <div className="text-right">
            <p className="text-xs text-gray-600 mb-0">Seeking</p>
            <p className="text-base font-semibold text-orange-600">
              {company.investmentNeeded}
            </p>
          </div>
          {/* Details Link/Button */}
          <span className="text-orange-500 group-hover:text-orange-600 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer">
            Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    );
  };

  const FilterPanel = () => (
    <div
      className={`bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-200 transition-all duration-300 overflow-hidden ${
        showFilters
          ? "max-h-[500px] opacity-100"
          : "max-h-0 opacity-0 p-0 border-0"
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Stage
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm py-2"
            value={filters.stage}
            onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
          >
            <option value="all">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Sector
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm py-2"
            value={filters.sector}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
          >
            <option value="all">All Sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Funding Range
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm py-2"
            value={filters.fundingRange}
            onChange={(e) =>
              setFilters({ ...filters, fundingRange: e.target.value })
            }
          >
            <option value="all">All Amounts</option>
            <option value="under1m">Under $1M</option>
            <option value="1m-5m">$1M - $5M</option>
            <option value="5m-10m">$5M - $10M</option>
            <option value="over10m">Over $10M</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Location
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm py-2"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end items-center mt-5 pt-4 border-t border-gray-200">
        <button
          onClick={() =>
            setFilters({
              stage: "all",
              sector: "all",
              fundingRange: "all",
              location: "all",
            })
          }
          className="text-gray-600 hover:text-red-600 text-sm font-medium mr-4 transition-colors px-3 py-1.5"
        >
          Reset
        </button>
        <button
          onClick={() => setShowFilters(false)}
          className="bg-orange-600 text-white px-4 py-1.5 rounded-md hover:bg-orange-700 text-sm font-medium transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  const InvestorInsights = () => (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Investor Insights
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm font-medium text-gray-700">
              AI & Machine Learning
            </span>
          </div>
          <span className="text-sm font-bold text-orange-500">+32%</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700">FinTech</span>
          </div>
          <span className="text-sm font-bold text-blue-500">+24%</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">CleanTech</span>
          </div>
          <span className="text-sm font-bold text-green-500">+18%</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm font-medium text-gray-700">
              HealthTech
            </span>
          </div>
          <span className="text-sm font-bold text-purple-500">+15%</span>
        </div>
      </div>
      <div className="mt-4 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Updated 2 hours ago</span>
          <button className="text-orange-500 text-sm font-medium flex items-center space-x-1 hover:text-orange-600">
            <span>Full Report</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  const FundingActivity = () => (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Recent Funding Activity
      </h3>
      <div className="space-y-3">
        {[
          {
            name: "NexGen Robotics",
            amount: "$12M",
            stage: "Series A",
            date: "2 days ago",
          },
          {
            name: "DataFlow Systems",
            amount: "$5M",
            stage: "Seed",
            date: "5 days ago",
          },
          {
            name: "EcoTech Solutions",
            amount: "$8M",
            stage: "Series A",
            date: "1 week ago",
          },
          {
            name: "MedPortal Health",
            amount: "$20M",
            stage: "Series B",
            date: "2 weeks ago",
          },
        ].map((deal, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-100"
          >
            <div>
              <h4 className="text-sm font-medium text-gray-800">{deal.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">{deal.stage}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{deal.date}</span>
              </div>
            </div>
            <span className="text-sm font-bold text-gray-800">
              {deal.amount}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2">
        <button className="text-orange-500 text-sm font-medium flex items-center space-x-1 hover:text-orange-600">
          <span>View All Activity</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  const ViewControls = () => (
    <div className="flex items-center gap-2">
      <select
        className="bg-white rounded-md border-gray-300 shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm py-2 pl-3 pr-8"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="funding">Funding Goal</option>
        <option value="growth">Growth Rate</option>
      </select>
      <div className="flex items-center bg-gray-100 rounded-md p-0.5 shadow-sm border border-gray-200">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-1.5 rounded-md transition-colors ${
            viewMode === "grid"
              ? "bg-white text-orange-600 shadow"
              : "text-gray-500 hover:bg-gray-200"
          }`}
          aria-label="Grid view"
        >
          <Grid size={18} />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-1.5 rounded-md transition-colors ${
            viewMode === "list"
              ? "bg-white text-orange-600 shadow"
              : "text-gray-500 hover:bg-gray-200"
          }`}
          aria-label="List view"
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {termsConditionsVisible && (
        <TermsAndConditions
          isOpen={termsConditionsVisible}
          onClose={() => setTermsConditionsVisible(false)}
        />
      )}

      <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Innov<span className="text-orange-600">8</span>Mate Funding
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                Discover startup investment opportunities.
              </p>
            </div>
            <nav className="flex space-x-1 sm:space-x-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setActiveTab("explore")}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
                  activeTab === "explore"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Explore
              </button>
              <button
                onClick={() => setTermsConditionsVisible(true)}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
                  activeTab === "need-funding"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Need Funding?
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
                  activeTab === "insights"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Insights
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "explore" && (
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative flex-grow w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search name, sector, location..."
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 w-full text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto justify-between md:justify-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  <Filter size={16} /> Filters{" "}
                  {showFilters ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                <ViewControls />
              </div>
            </div>

            <FilterPanel />

            {isLoading ? (
              <div className="text-center py-20 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                Loading startups...
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-600">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                {error}
              </div>
            ) : filteredAndSortedCompanies.length === 0 ? (
              <div className="text-center py-20 px-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Startups Found
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {featuredCompanies.length > 0 &&
                  !searchTerm &&
                  !Object.values(filters).some((f) => f !== "all") && (
                    <section>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Featured Startups
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-5">
                        {featuredCompanies.slice(0, 4).map((company) => (
                          <CompanyCardGrid key={company.id} company={company} />
                        ))}
                      </div>
                    </section>
                  )}

                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    All Startups ({filteredAndSortedCompanies.length})
                  </h2>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5">
                      {filteredAndSortedCompanies.map((company) => (
                        <CompanyCardGrid key={company.id} company={company} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredAndSortedCompanies.map((company) => (
                        <CompanyCardList key={company.id} company={company} />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
              <StatCard
                title="Total Investment (30d)"
                value="$1.2B"
                icon={DollarSign}
                colorClass="text-blue-600"
                secondaryValue="+12%"
              />
              <StatCard
                title="Active Startups"
                value="1,243"
                icon={Building}
                colorClass="text-orange-500"
                secondaryValue="+8%"
              />
              <StatCard
                title="Average Deal Size"
                value="$4.7M"
                icon={BarChart2}
                colorClass="text-purple-600"
              />
              <StatCard
                title="Avg. Time To Close"
                value="43 days"
                icon={Clock}
                colorClass="text-green-600"
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <InvestorInsights />
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <h3 className="font-bold mb-4">Trending Sectors</h3>
                <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400 rounded">
                  Chart Placeholder
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <FundingActivity />
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <h3 className="font-bold mb-4">Hot Deals</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Deal 1...</p>
                  <p className="text-sm text-gray-500">Deal 2...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "need-funding" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Ready to Fuel Your Growth?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join Innov8Mate's funding platform to connect with investors
                actively seeking startups like yours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 ring-4 ring-orange-50">
                  <Star size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1. Create Your Profile
                </h3>
                <p className="text-gray-600 text-sm px-2">
                  Build a compelling pitch deck and company profile to showcase
                  your potential.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 ring-4 ring-orange-50">
                  <Users size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2. Get Matched
                </h3>
                <p className="text-gray-600 text-sm px-2">
                  Our platform suggests relevant investors based on your stage,
                  sector, and goals.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 ring-4 ring-orange-50">
                  <DollarSign size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3. Secure Funding
                </h3>
                <p className="text-gray-600 text-sm px-2">
                  Engage directly, share documents securely, and close your
                  funding round faster.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setTermsConditionsVisible(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-semibold transition-all transform hover:scale-105"
              >
                Apply for Funding
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
