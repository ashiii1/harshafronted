import HackathonImage from "../Assets/images/HackathonImage.avif";
import CollaborationImage from "../Assets/images/CollaborationImage.avif";
import FundingImage from "../Assets/images/FundingImage.avif";
import HiringImage from "../Assets/images/HiringImage.avif";
import IdeasImage from "../Assets/images/IdeasImage.avif";
import {
  FaCode,
  FaBriefcase,
  FaLightbulb,
  FaUsers,
  FaCoins,
} from "react-icons/fa";

export const API_URL = "https://innov8mate.onrender.com";
export const stats = [
  { name: "Ideas supported", value: "100+" },
  { name: "Project collaborations", value: "300+" },
  { name: "Companies funded", value: "40" },
  { name: "Jobs Hired", value: "25" },
];

export const contactInfo = [
  {
    title: "Collaborate",
    email: "innov8mate@gmail.com",
    phone: "+91 8978735015",
  },
  {
    title: "Join our team",
    email: "innov8mate@gmail.com",
    phone: "+91 8978735015",
  },
  { title: "Issues", email: "innov8mate@gmail.com", phone: "+91 8978735015" },
  {
    title: "Collaborate",
    email: "innov8mate@gmail.com",
    phone: "+91 8978735015",
  },
];

export const people = [
  {
    name: "Harsha Vardhan",
    role: "Founder / CEO",
    imageUrl: "https://source.unsplash.com/400x400/?smile",
  },
  {
    name: "chandini",
    role: "CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "leela prasad",
    role: "CFO",
    imageUrl: "https://source.unsplash.com/400x400/?hero",
  },
  {
    name: "Banda Bhargav",
    role: "COO/ Developer",
    imageUrl: "https://source.unsplash.com/400x400/?founder",
  },
  {
    name: "Rajamouli",
    role: "VFX",
    imageUrl:
      "https://imgs.search.brave.com/LjZr6_a1VVBIL5XxIQjqp5cCRDXel5bEGYblGiLz_jw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9j/L2MxL1NTX1JhamFt/b3VsaSxfMjAyMS5q/cGc",
  },
  {
    name: "Prasanth Neel",
    role: "Architect",
    imageUrl:
      "https://imgs.search.brave.com/5GAHRXSjZ47ZSGYRsuol-NB3IKbT9i6CBRjo4-JtGEw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9h/L2FhL1ByYXNoYW50/aF9OZWVsX2luXzIw/MjIuanBn",
  },
];

export const categories = [
  { value: "all", label: "All Categories" },
  { value: "tech", label: "Technology" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "startup", label: "Startups" },
];
export const FAQS = [
  {
    id: 1,
    title: "Are the Placement Opportunities are available?",
    info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui facere in labore maxime, assumenda iure sed tenetur alias omnis eveniet similique laborum, neque porro unde ducimus officiis animi vitae! Quidem.",
  },
  {
    id: 2,
    title: "How Do I track my progress?",
    info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui facere in labore maxime, assumenda iure sed tenetur alias omnis eveniet similique laborum, neque porro unde ducimus officiis animi vitae! Quidem.",
  },
  {
    id: 3,
    title: "Is there any Customer Support?",
    info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui facere in labore maxime, assumenda iure sed tenetur alias omnis eveniet similique laborum, neque porro unde ducimus officiis animi vitae! Quidem.",
  },
  {
    id: 4,
    title: "How I get started?",
    info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui facere in labore maxime, assumenda iure sed tenetur alias omnis eveniet similique laborum, neque porro unde ducimus officiis animi vitae! Quidem.",
  },
];

export const APP_FEATURES = [
  {
    Image: HackathonImage,
    heading: "Hackathons",
    tagline: "Showcase your skills by participating in hackathons",
    btnName: "Participate",
    link: "/hackathons",
    Icon: FaCode, // 👨‍💻 Coding Icon
  },
  {
    Image: HiringImage,
    heading: "Hiring",
    tagline: "Find the job that matches your skills & get hired",
    btnName: "Explore",
    link: "/jobs",
    Icon: FaBriefcase, // 💼 Job Icon
  },
  {
    Image: IdeasImage,
    heading: "Ideas Submission",
    tagline: "Elevate your prototypes for funding",
    btnName: "Explore",
    link: "/pitchideas",
    Icon: FaLightbulb, // 💡 Idea Icon
  },
  {
    Image: CollaborationImage,
    heading: "Project Collaborations",
    tagline: "Collaborate with people to create projects",
    btnName: "Collaborate",
    link: "/collaboration",
    Icon: FaUsers, // 🤝 Teamwork Icon
  },
  {
    Image: FundingImage,
    heading: "Funding",
    tagline: "Be an investor and founder",
    btnName: "Invest",
    link: "/funding",
    Icon: FaCoins, // 💰 Investment Icon
  },
];

export const navItems = [
  { name: "Home", path: "/home" },
  { name: "About Us", path: "/about" },
  { name: "Jobs", path: "/jobs/dashboard" },
  { name: "Freelancers", path: "/freelancers" },
  { name: "Collaboration", path: "/collaboration" },
  { name: "Pitch Ideas", path: "/pitchideas" },
  { name: "Funding", path: "/funding" },
  { name: "Explore", path: "/explore" },
];

export const IDEA_CATEGORIES = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Environment",
  "Social Impact",
  "Entertainment",
  "E-commerce",
];

export const IDEA_SECTORS = [
  "Consumer",
  "Enterprise",
  "Government",
  "Non-profit",
  "Research",
  "Manufacturing",
  "Retail",
  "Agriculture",
];

export const sampleCompanies = [
  {
    id: 0,
    companyName: "TechFlow AI",
    companyLogo:
      "data:image/jpeg;base64,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",
    tagline: "Revolutionizing workflow automation with AI",
    pitch:
      "TechFlow AI is building the next generation of intelligent workflow automation tools that adapt to your business needs.",
    sector: "Artificial Intelligence",
    industry: "Enterprise Software",
    stage: "Series A",
    fundingRound: "Open",
    foundedDate: "2022",
    location: "San Francisco, CA",
    estimatedValuation: "$15M",
    teamSize: "28",
    metrics: {
      mrr: "$250K",
      growth: "+25%",
      customers: "150+",
      arr: "$3M",
      grossMargin: "75%",
      cash: "$800K",
    },
    founder: {
      name: "Sarah Chen",
      email: "sarah@techflowai.com",
      bio: "Serial entrepreneur with 15+ years of experience in technology and innovation.",
      experience: "15+ years in Tech",
      education: "MBA, Stanford",
      image: "https://placehold.co/100x100/FF6B35/FFFFFF/png?text=SC",
    },
    investmentNeeded: "$5M",
    traction: {
      userGrowth: "+150%",
      retention: "95%",
      nps: "75",
    },
    market: {
      tam: "$50B",
      sam: "$15B",
      som: "$2B",
    },
    highlighted: true,
  },
  {
    id: 1,
    companyName: "HealthSync",
    companyLogo: "https://placehold.co/400x300/FF6B35/FFFFFF/png?text=HS",
    tagline: "AI-powered healthcare management",
    pitch:
      "HealthSync is revolutionizing patient care with AI-powered predictive analytics and care coordination.",
    sector: "HealthTech",
    industry: "Healthcare Services",
    stage: "Seed",
    fundingRound: "Open",
    foundedDate: "2023",
    location: "Boston, MA",
    estimatedValuation: "$8M",
    teamSize: "15",
    metrics: {
      mrr: "$120K",
      growth: "+40%",
      customers: "45+",
      arr: "$1.4M",
      grossMargin: "68%",
      cash: "$400K",
    },
    founder: {
      name: "David Wilson",
      email: "david@healthsync.io",
      bio: "Former healthcare executive with 12+ years in medical technology innovation.",
      experience: "12+ years in Healthcare",
      education: "MD, Harvard Medical School",
      image: "https://placehold.co/100x100/FF6B35/FFFFFF/png?text=DW",
    },
    investmentNeeded: "$3M",
    traction: {
      userGrowth: "+120%",
      retention: "90%",
      nps: "82",
    },
    market: {
      tam: "$85B",
      sam: "$22B",
      som: "$3B",
    },
    highlighted: false,
  },
  {
    id: 2,
    companyName: "GreenLogistics",
    companyLogo: "https://placehold.co/400x300/FF6B35/FFFFFF/png?text=GL",
    tagline: "Sustainable supply chain solutions",
    pitch:
      "GreenLogistics is creating carbon-neutral logistics infrastructure for the global supply chain.",
    sector: "Logistics",
    industry: "Supply Chain",
    stage: "Series B",
    fundingRound: "Open",
    foundedDate: "2020",
    location: "Chicago, IL",
    estimatedValuation: "$45M",
    teamSize: "62",
    metrics: {
      mrr: "$750K",
      growth: "+18%",
      customers: "230+",
      arr: "$9M",
      grossMargin: "52%",
      cash: "$3.2M",
    },
    founder: {
      name: "Maria Rodriguez",
      email: "maria@greenlogistics.com",
      bio: "Supply chain expert with 18+ years experience in global logistics.",
      experience: "18+ years in Logistics",
      education: "MBA, University of Chicago",
      image: "https://placehold.co/100x100/FF6B35/FFFFFF/png?text=MR",
    },
    investmentNeeded: "$12M",
    traction: {
      userGrowth: "+75%",
      retention: "88%",
      nps: "77",
    },
    market: {
      tam: "$120B",
      sam: "$35B",
      som: "$8B",
    },
    highlighted: true,
  },
  {
    id: 3,
    companyName: "FinGenius",
    companyLogo: "https://placehold.co/400x300/FF6B35/FFFFFF/png?text=FG",
    tagline: "Democratizing financial intelligence",
    pitch:
      "FinGenius provides AI-powered financial insights and automation for businesses of all sizes.",
    sector: "FinTech",
    industry: "Financial Services",
    stage: "Seed",
    fundingRound: "Open",
    foundedDate: "2023",
    location: "New York, NY",
    estimatedValuation: "$5M",
    teamSize: "12",
    metrics: {
      mrr: "$95K",
      growth: "+55%",
      customers: "72+",
      arr: "$1.1M",
      grossMargin: "80%",
      cash: "$350K",
    },
    founder: {
      name: "James Patel",
      email: "james@fingenius.io",
      bio: "Former Wall Street quant with 10+ years in algorithmic trading systems.",
      experience: "10+ years in Finance",
      education: "PhD in Financial Engineering, MIT",
      image: "https://placehold.co/100x100/FF6B35/FFFFFF/png?text=JP",
    },
    investmentNeeded: "$2.5M",
    traction: {
      userGrowth: "+180%",
      retention: "92%",
      nps: "79",
    },
    market: {
      tam: "$65B",
      sam: "$18B",
      som: "$1.5B",
    },
    highlighted: false,
  },
  {
    id: 4,
    companyName: "EduSpark",
    companyLogo: "https://placehold.co/400x300/FF6B35/FFFFFF/png?text=ES",
    tagline: "Personalized education through AI",
    pitch:
      "EduSpark is transforming education with adaptive learning technology that personalizes the learning journey for every student.",
    sector: "EdTech",
    industry: "Education",
    stage: "Series A",
    fundingRound: "Open",
    foundedDate: "2021",
    location: "Austin, TX",
    estimatedValuation: "$18M",
    teamSize: "32",
    metrics: {
      mrr: "$220K",
      growth: "+32%",
      customers: "180+",
      arr: "$2.6M",
      grossMargin: "78%",
      cash: "$950K",
    },
    founder: {
      name: "Aisha Johnson",
      email: "aisha@eduspark.com",
      bio: "Former educator with 14+ years experience in curriculum development and EdTech.",
      experience: "14+ years in Education",
      education: "PhD in Education, Stanford",
      image: "https://placehold.co/100x100/FF6B35/FFFFFF/png?text=AJ",
    },
    investmentNeeded: "$6M",
    traction: {
      userGrowth: "+140%",
      retention: "96%",
      nps: "88",
    },
    market: {
      tam: "$40B",
      sam: "$12B",
      som: "$2.2B",
    },
    highlighted: true,
  },
  {
    id: 5,
    companyName: "CleanEnergyX",
    companyLogo: "https://placehold.co/400x300/FF6B35/FFFFFF/png?text=CE",
    tagline: "Accelerating the clean energy transition",
    pitch:
      "CleanEnergyX is developing next-gen energy storage solutions to accelerate global adoption of renewable energy.",
    sector: "CleanTech",
    industry: "Energy",
    stage: "Series A",
    fundingRound: "Open",
    foundedDate: "2021",
    location: "Denver, CO",
    estimatedValuation: "$22M",
    teamSize: "24",
    metrics: {
      mrr: "$185K",
      growth: "+28%",
      customers: "35+",
      arr: "$2.2M",
      grossMargin: "62%",
      cash: "$1.1M",
    },
    founder: {
      name: "Alex Chen",
      email: "alex@cleanenergyx.com",
      bio: "Materials scientist with 16+ years experience in energy storage research.",
      experience: "16+ years in Energy",
      education: "PhD in Materials Science, Caltech",
      image: "https://placehold.co/100x100/FF6B35/FFFFFF/png?text=AC",
    },
    investmentNeeded: "$8M",
    traction: {
      userGrowth: "+90%",
      retention: "95%",
      nps: "81",
    },
    market: {
      tam: "$110B",
      sam: "$28B",
      som: "$4B",
    },
    highlighted: false,
  },
];

export const userMockData = {
  username: "harsha_innovator",
  firstName: "Harsha",
  lastName: "Patel",
  email: "harsha@innov8mate.com",
  about:
    "Passionate software developer and founder of Innov8mate. I believe in creating technology that empowers innovators around the world to build the future. I specialize in creating scalable web applications and have a keen interest in AI/ML solutions for real-world problems.",
  profileImageUrl: "/api/placeholder/400/400",
  country: "India",
  city: "Bangalore",
  state: "Karnataka",
  education: "B.Tech in Computer Science",
  interests: ["AI/ML", "Startups", "Web Development", "Product Design"],
  skills: [
    "React",
    "Node.js",
    "MongoDB",
    "UI/UX Design",
    "Python",
    "Project Management",
  ],
  github: "github.com/harsha-innovator",
  linkedin: "linkedin.com/in/harsha-innovator",
  twitter: "twitter.com/harsha_innov8",
  website: "harsha-innovator.dev",
  phoneNumber: "+91 9876543210",
  workExperience: [
    {
      company: "Tech Innovators Inc.",
      role: "Senior Developer",
      startDate: new Date(2022, 1, 1),
      endDate: null,
      currentlyWorking: true,
      description:
        "Leading development of cutting-edge web applications for innovation-focused startups. Implementing modern tech stacks with React, Node.js, and serverless architectures to deliver scalable solutions.",
    },
    {
      company: "CodeCraft Solutions",
      role: "Junior Developer",
      startDate: new Date(2020, 5, 1),
      endDate: new Date(2021, 12, 31),
      currentlyWorking: false,
      description:
        "Developed responsive web applications and contributed to open-source projects. Worked in an agile development environment to deliver client solutions across multiple industries.",
    },
  ],
  projectList: [
    {
      owner: true,
      collaborator: false,
      project: {
        _id: "1",
        title: "Innov8mate Platform",
        description:
          "A platform connecting innovators with investors and collaborators. Features include project showcasing, idea validation, and resource matching.",
        image: "/api/placeholder/100/100",
        tags: ["Web App", "React", "Node.js"],
        status: "In Progress",
        collaborators: 5,
      },
    },
    {
      owner: false,
      collaborator: true,
      project: {
        _id: "2",
        title: "AI Mentor",
        description:
          "An AI-powered mentorship platform for young entrepreneurs. Uses natural language processing to provide personalized guidance and resources.",
        image: "/api/placeholder/100/100",
        tags: ["AI/ML", "Python", "React"],
        status: "Completed",
        collaborators: 3,
      },
    },
    {
      owner: true,
      collaborator: false,
      project: {
        _id: "3",
        title: "Innovation Hub",
        description:
          "A collaborative workspace management tool for innovation centers and coworking spaces.",
        image: "/api/placeholder/100/100",
        tags: ["SaaS", "React", "MongoDB"],
        status: "Planning",
        collaborators: 2,
      },
    },
  ],
  ideaList: [
    {
      owner: true,
      supporter: false,
      idea: {
        _id: "1",
        title: "Smart Innovation Hub",
        description: "A physical+digital space for innovators to collaborate",
        upvotes: 42,
        tags: ["Space", "Collaboration", "Innovation"],
      },
    },
    {
      owner: false,
      supporter: true,
      idea: {
        _id: "2",
        title: "Startup Resource Marketplace",
        description: "Platform for startups to exchange and share resources",
        upvotes: 28,
        tags: ["Marketplace", "Resources", "Startup"],
      },
    },
  ],
  friendList: [
    {
      _id: "1",
      username: "sarah_tech",
      name: "Sarah Chen",
      role: "UX Designer",
      profileImageUrl: "/api/placeholder/40/40",
    },
    {
      _id: "2",
      username: "alex_investor",
      name: "Alex Rodriguez",
      role: "Angel Investor",
      profileImageUrl: "/api/placeholder/40/40",
    },
    {
      _id: "3",
      username: "priya_dev",
      name: "Priya Sharma",
      role: "Full Stack Developer",
      profileImageUrl: "/api/placeholder/40/40",
    },
    {
      _id: "4",
      username: "mike_founder",
      name: "Mike Johnson",
      role: "Startup Founder",
      profileImageUrl: "/api/placeholder/40/40",
    },
  ],
  achievements: [
    {
      title: "Hackathon Winner",
      description: "First place at BLR Tech Fest 2023",
      date: new Date(2023, 5, 15),
      icon: "trophy",
    },
    {
      title: "100+ Contributions",
      description: "Active open source contributor",
      date: new Date(2022, 8, 22),
      icon: "code",
    },
    {
      title: "Mentor of the Month",
      description: "Recognized for startup mentorship",
      date: new Date(2023, 2, 10),
      icon: "coffee",
    },
  ],
};

// Dummy data for the revenue growth chart
export const revenueData = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 65000 },
  { month: "Mar", revenue: 85000 },
  { month: "Apr", revenue: 95000 },
  { month: "May", revenue: 120000 },
  { month: "Jun", revenue: 150000 },
];

// Enhanced default company data with all fields from formData
export const defaultCompanyData = {
  // Basic Company Info
  companyName: "Tech Innovators Inc.",
  companyLogo: null,
  tagline: "Revolutionizing the future of technology",
  pitch:
    "We're building the next generation of AI-powered workflow automation tools for enterprise.",
  sector: "Technology",
  industry: "Software & AI",
  stage: "Series A",
  foundedDate: "2020",
  location: "San Francisco, CA",
  estimatedValuation: "$5M",

  // Founder Info
  founderName: "Sarah Johnson",
  founderEmail: "sarah@techinnovators.com",
  founderPhone: "+1 (555) 123-4567",
  founderLinkedIn: "linkedin.com/sarahjohnson",
  founderBio:
    "Serial entrepreneur with 15+ years of experience in technology and innovation.",
  founderExperience: "15+ years in Tech",
  founderEducation: "MBA, Stanford",
  founderAchievements: "Previous exit of $50M with GrowthTech in 2018",

  // Team Info
  teamSize: "25+",
  keyTeamMembers: [
    {
      name: "John Doe",
      role: "CTO",
      experience: "10+ years in Software Engineering",
    },
    { name: "Jane Smith", role: "COO", experience: "12+ years in Operations" },
    {
      name: "Michael Chen",
      role: "Head of Product",
      experience: "8+ years in Product Management",
    },
  ],
  advisors: [
    {
      name: "Michael Lee",
      role: "Advisor",
      experience: "20+ years in Venture Capital",
      affiliation: "XYZ Ventures",
    },
    {
      name: "Elena Rodriguez",
      role: "Technical Advisor",
      experience: "Former CTO at TechGiant",
      affiliation: "MIT",
    },
  ],

  // Business Details
  description:
    "Tech Innovators is building an AI-powered workflow automation platform that helps enterprises reduce manual processes by up to 75%.",
  businessModel:
    "SaaS subscription model with tiered pricing based on user seats and feature access.",
  revenueModel:
    "Monthly and annual subscriptions with enterprise deals for large customers.",
  marketSize:
    "The workflow automation market is projected to reach $32B by 2028.",
  competition:
    "Current competitors include WorkflowPro, AutomateMaster, and Enterprise Solutions Inc.",
  uniqueValue:
    "Our proprietary AI engine delivers 3x more accurate process automation than competitors.",
  intellectualProperty:
    "2 patents pending for our core ML algorithm and process optimization technology.",

  // Financial Info
  revenue: "$1.2M (ARR)",
  revenueGrowth: "+125% YoY",
  burnRate: "$50K/month",
  runway: "16 months",
  pastInvestments: "$1M Seed Round in 2021",
  investmentNeeded: "$2.5M",
  sharesDiluted: "15%",
  useOfFunds:
    "40% Engineering, 30% Sales & Marketing, 20% Operations, 10% Reserve",

  // Market & Traction
  targetMarket:
    "Mid-market and enterprise companies in healthcare, finance, and manufacturing sectors.",
  marketValidation:
    "Our solutions have been validated by 3 industry leaders including FortuneHealth Inc.",
  customerBase:
    "Currently serving 45 enterprise customers across 12 countries.",
  partnerships:
    "Strategic partnerships with Oracle, Salesforce, and Microsoft.",
  metrics: {
    mrr: "$150,000",
    arr: "$1.8M",
    cac: "$2,500",
    ltv: "$75,000",
    churnRate: "2.5%",
    growth: "+25%",
    customers: "1,200+",
    marketShare: "12%",
    grossMargin: "75%",
    cash: "$800K",
    burnRate: "$50K/month",
    runway: "16 months",
  },

  // Digital Presence
  website: "www.techinnovators.io",
  socialLinks: {
    linkedin: "linkedin.com/company/techinnovators",
    twitter: "twitter.com/techinnovators",
    facebook: "facebook.com/techinnovators",
    instagram: "instagram.com/techinnovators",
  },
  pressLinks: [
    "TechCrunch: 'Tech Innovators raises $1M to revolutionize workflow automation'",
    "Forbes: 'Top 10 AI Startups to Watch in 2023'",
  ],

  // Documents
  documents: [
    { name: "Pitch Deck", type: "PDF" },
    { name: "Financials", type: "Excel" },
    { name: "Business Plan", type: "PDF" },
    { name: "Market Analysis", type: "PDF" },
    { name: "Product Roadmap", type: "PDF" },
  ],

  // Future Plans
  roadmap:
    "Q3 2023: Launch enterprise version, Q4 2023: Expand to European market, Q1 2024: Release AI analytics suite",
  expansionPlans:
    "Planning to expand into EMEA in Q4 2023 and APAC in Q2 2024.",
  exitStrategy:
    "Targeting acquisition by major tech platform or IPO within 5-7 years.",

  // Compliance
  registrationDetails: "Delaware C-Corp, Established 2020",
  taxCompliance: "All tax filings current and compliant",
  certifications: ["SOC 2 Type I", "GDPR Compliant", "ISO 27001 in progress"],

  // Vision
  vision:
    "Our vision is to revolutionize the industry through innovative technology solutions that empower businesses to achieve unprecedented efficiency through automation.",

  // Market data
  market: {
    tam: "$50B",
    sam: "$15B",
    som: "$2B",
  },

  // Traction data
  traction: {
    userGrowth: "+150%",
    retention: "95%",
    nps: "75",
  },

  // Competitive advantage
  competitiveAdvantage:
    "Proprietary technology and first-mover advantage in AI-powered workflow automation.",

  // Funding history
  fundingHistory: [
    {
      round: "Pre-Seed",
      date: "2019",
      amount: "$250K",
      investors: "Angel Investors",
    },
    {
      round: "Seed Round",
      date: "2021",
      amount: "$1M",
      investors: "ABC Ventures",
    },
  ],
};
