/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronRight,
  Star,
  Users,
  Trophy,
  Zap,
  Lightbulb,
  DollarSign,
  Briefcase,
} from "lucide-react";
import CompanyPartners from "./companies.jsx";
import Reviews from "./Reviews.jsx";
import Faqs from "./Faqs.jsx";
import Features from "./Features.jsx";
import bg from "../../Assets/bg.avif";
import { API_URL } from "../../Utils/constants.js";
import Pricing from "../../Common/Pricing.jsx";

const ProductReleaseCountdown = () => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchLaunchDate = async () => {
      try {
        const launchDate = new Date("2025-05-17T00:00:00Z").getTime(); // Example Date

        const calculateTimeLeft = () => {
          const now = new Date().getTime();
          const difference = launchDate - now;

          if (difference <= 0) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
          }

          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        };

        calculateTimeLeft(); // Initial calculation
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
      } catch (error) {
        console.error("Error setting launch date:", error);
        setTimeLeft({
          days: "N/A",
          hours: "N/A",
          minutes: "N/A",
          seconds: "N/A",
        });
      }
    };

    fetchLaunchDate();
  }, []);

  if (!timeLeft) return null;

  const isLaunched =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;
  const isError = typeof timeLeft.days === "string";

  return (
    <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-full px-4 sm:px-6 py-2 inline-block mt-6 text-xs sm:text-sm">
      {isLaunched ? (
        <p className="text-green-800 font-semibold flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          We Have Launched! Explore Now!
        </p>
      ) : isError ? (
        <p className="text-red-800 font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Launch Date Coming Soon!
        </p>
      ) : (
        <p className="text-orange-800 font-semibold flex items-center gap-1 sm:gap-2">
          <Zap className="w-4 h-4" />
          Launch in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
          {timeLeft.seconds}s
        </p>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white p-4 sm:py-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500 mb-2 sm:mb-3 mx-auto" />
    <h3 className="font-semibold text-xl sm:text-2xl text-gray-900 text-center">
      {value}
    </h3>
    <p className="text-gray-600 text-xs sm:text-sm mt-1 text-center">{title}</p>
  </div>
);

// New Component: Featured Opportunity Card
const OpportunityCard = ({
  title,
  type,
  description,
  link,
  icon: Icon,
  color,
}) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-1.5 rounded-lg ${color || "bg-orange-100"}`}>
        <Icon
          className={`w-5 h-5 ${color ? "text-white" : "text-orange-600"}`}
        />
      </div>
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${
          color ? "text-white" : "text-orange-600"
        } px-2 py-0.5 rounded ${color ? "bg-opacity-80" : "bg-orange-50"}`}
      >
        {type}
      </span>
    </div>
    <h3 className="text-base font-semibold text-gray-800 mb-2 flex-grow">
      {title}
    </h3>
    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
    <Link to={link || "#"} className="mt-auto group">
      <button className="w-full py-2 px-4 text-sm font-medium rounded-lg flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
        Learn More{" "}
        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </Link>
  </div>
);

const Home = () => {
  const user = useSelector((state) => state.user?.user);

  // Sample data for Featured Opportunities (replace with API call later)
  const featuredOpportunities = [
    {
      id: "opp1",
      title: "Seeking Co-founder for AI-Powered EdTech Platform",
      type: "Co-founder",
      description:
        "Early-stage startup revolutionizing online learning needs a technical co-founder.",
      link: "/collaborate/123", // Example link
      icon: Users,
      color: "bg-blue-500", // Example color
    },
    {
      id: "opp2",
      title: "Feedback Needed: Sustainable Packaging Idea",
      type: "Feedback",
      description:
        "Developing a compostable packaging solution. Seeking feedback on viability.",
      link: "/ideas/456",
      icon: Lightbulb, // Assuming Lightbulb is imported
      color: "bg-green-500",
    },
    {
      id: "opp3",
      title: "Seed Funding Round for HealthTech Wearable",
      type: "Funding",
      description:
        "Raising $250k for our innovative health monitoring device. MVP ready.",
      link: "/funding/789",
      icon: DollarSign, // Assuming DollarSign is imported
      color: "bg-purple-500",
    },
    {
      id: "opp4",
      title: "Freelance UI/UX Designer for Mobile App",
      type: "Job/Gig",
      description:
        "Looking for a skilled designer for a 3-month project for our new social app.",
      link: "/jobs/101",
      icon: Briefcase, // Assuming Briefcase is imported
      color: "bg-red-500",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section - Adjusted padding */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
              Innov<span className="text-gray-900">8</span>Mate
            </h1>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg font-medium text-gray-600">
              Innovate • Create • Elevate
            </p>
            <ProductReleaseCountdown />
            <p className="mt-6 sm:mt-8 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 max-w-2xl mx-auto">
              Empowering Innovators to Build the Future Together
            </p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed sm:leading-8 text-gray-600 max-w-xl mx-auto">
              Connect with students, founders, and industry experts. Bring your
              ideas to life, find collaborators, secure funding, and launch your
              venture.
            </p>
            {!user && (
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link to="/signup">
                  <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 text-sm sm:text-base">
                    Join the Community
                  </button>
                </Link>
                <Link
                  to="/about"
                  className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1 transition-colors duration-300 text-sm sm:text-base"
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
            {user && (
              <div className="mt-8 sm:mt-10">
                <p className="text-lg text-gray-700 font-medium">
                  Welcome back, {user.firstName || user.username}!
                </p>
                <Link
                  to="/home"
                  className="mt-4 inline-block px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
        <div
          className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 opacity-10"
          aria-hidden="true"
        >
          <div className="w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-orange-300 to-red-300 blur-3xl"></div>
        </div>
        <div
          className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 opacity-10"
          aria-hidden="true"
        >
          <div className="w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-red-300 to-orange-300 blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section - Adjusted padding */}
      <section className="py-12 md:py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
            <StatCard icon={Users} title="Active Innovators" value="10,000+" />
            <StatCard icon={Star} title="Success Stories" value="500+" />
            <StatCard icon={Trophy} title="Projects Launched" value="1,000+" />
          </div>
        </div>
      </section>

      {/* Why Innov8mate Section - Adjusted padding */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">
                Why Choose Innov<span className="text-orange-500">8</span>Mate?
              </h2>
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start gap-4 transition-transform duration-300 hover:scale-105 group">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-orange-200">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                      Vibrant Innovation Ecosystem
                    </h3>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                      Connect with thousands of students, founders, mentors, and
                      investors.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 transition-transform duration-300 hover:scale-105 group">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-orange-200">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                      Personalized Experience
                    </h3>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                      Tailor your journey with AI-powered recommendations for
                      collaborators, funding, and resources.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 transition-transform duration-300 hover:scale-105 group">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-orange-200">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                      Comprehensive Opportunities
                    </h3>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                      Access hackathons, funding stages, project collaborations,
                      jobs, and mentorship programs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group order-1 lg:order-2">
              <img
                src={bg}
                alt="Collaboration and innovation illustration"
                className="rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-orange-200/50"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-transparent to-red-400/10 rounded-xl md:rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Adjusted padding */}
      <section className="py-12 md:py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
            Everything You Need to Innovate
          </h2>
          <Features />
        </div>
      </section>

      {/* ----- NEW: Featured Opportunities Section ----- */}
      <section className="py-12 md:py-16 bg-orange-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Latest Opportunities
          </h2>
          <p className="text-center text-base md:text-lg text-gray-600 mb-10 md:mb-12 max-w-2xl mx-auto">
            Find your next collaborator, co-founder, funding round, or project.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} {...opp} />
            ))}
          </div>
          <div className="text-center mt-10 md:mt-12">
            <Link
              to="/explore"
              className="px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
            >
              Explore All Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - Adjusted padding */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
            How Innov<span className="text-orange-500">8</span>Mate Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Share Your Vision
              </h3>
              <p className="text-sm text-gray-600">
                Post your startup pitch, innovative idea, or collaboration need
                using our simple tools.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect & Collaborate
              </h3>
              <p className="text-sm text-gray-600">
                Discover relevant people and projects. Connect with co-founders,
                mentors, investors, and skilled individuals.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Grow & Launch
              </h3>
              <p className="text-sm text-gray-600">
                Leverage resources, gain feedback, secure funding, and manage
                your project towards a successful launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Adjusted padding */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 md:mb-16 max-w-2xl mx-auto">
            Choose the plan that best fits your innovation journey. Get started
            for free!
          </p>
          <Pricing />
        </div>
      </section>

      {/* Reviews Section - Adjusted padding */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reviews />
        </div>
      </section>

      {/* Company Partners Section - Adjusted padding */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CompanyPartners />
        </div>
      </section>

      {/* FAQs Section - Adjusted padding */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Faqs />
        </div>
      </section>

      {/* Note: Footer component will be added by HomeLayout */}
    </div>
  );
};

export default Home;
