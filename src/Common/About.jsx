import React from "react";
import { Link } from "react-router-dom";
import { stats } from "../Utils/constants"; // Assuming stats are defined here
// Import relevant icons
import {
  Target,
  Eye,
  Heart,
  Users,
  Building,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

// Placeholder background image - replace with a relevant, high-quality image
const ABOUT_PAGE_BG_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"; // Example team background

// Simple Value Card Component
const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4 sm:p-6">
    <div className="mb-3 sm:mb-4 p-3 bg-orange-100 rounded-full">
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
      {title}
    </h3>
    <p className="text-sm sm:text-base text-gray-600">{description}</p>
  </div>
);

// Simple Founder Placeholder Card
const FounderCard = ({ name, title, imageUrl, bio }) => (
  <div className="text-center group">
    <img
      src={
        imageUrl ||
        `https://ui-avatars.com/api/?name=${name.replace(
          " ",
          "+"
        )}&background=random&size=128`
      }
      alt={name}
      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105"
    />
    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{name}</h3>
    <p className="text-orange-600 text-sm sm:text-base font-medium">{title}</p>
    {/* Optional short bio snippet here if needed */}
    {/* <p className="text-xs text-gray-500 mt-1">{bio}</p> */}
  </div>
);

const About = () => {
  // Placeholder founder data - replace with actual data
  const founders = [
    {
      name: "Founder One",
      title: "CEO & Visionary",
      imageUrl: "", // Add path to actual image
      bio: "Passionate about empowering student innovators...",
    },
    {
      name: "Founder Two",
      title: "CTO & Lead Architect",
      imageUrl: "", // Add path to actual image
      bio: "Building the future of collaboration technology...",
    },
    // Add more founders/leaders if applicable
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-orange-50 via-white to-white pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Updated Title and Subtitle */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              About Innov<span className="text-orange-600">8</span>Mate
            </h1>
            <p className="mt-4 text-lg sm:text-xl leading-relaxed text-gray-600">
              Empowering the next generation of innovators through
              collaboration, community, and opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-7 h-7 text-orange-500" /> Our Mission
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                To democratize innovation by providing a dynamic ecosystem where
                students, founders, mentors, and investors can connect,
                collaborate, and bring groundbreaking ideas to life.
              </p>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-7 h-7 text-orange-500" /> Our Vision
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                To be the leading global platform igniting innovation and
                fostering entrepreneurial success, creating a future built on
                shared knowledge and collaborative spirit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Story
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
              Innov8mate was born from a simple observation: countless brilliant
              ideas remain dormant due to a lack of connections, resources, or
              guidance. Founded by [Founder One's Background/Motivation - e.g.,
              former students who faced these challenges], we set out to build a
              platform that bridges these gaps. We believe that collaboration is
              the key to unlocking potential, and we're passionate about
              creating a space where anyone with an innovative spark can find
              the support they need to thrive.
            </p>
            {/* You can add an image here related to the story/founders */}
            {/* <img src="/path/to/story/image.jpg" alt="Innov8mate founding story" className="rounded-lg shadow-md mx-auto max-w-lg w-full" /> */}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10 sm:mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <ValueCard
              icon={Lightbulb}
              title="Innovation"
              description="We champion creative thinking and novel solutions."
            />
            <ValueCard
              icon={Users}
              title="Collaboration"
              description="We believe collective effort drives greater success."
            />
            <ValueCard
              icon={Heart}
              title="Community"
              description="We foster a supportive and inclusive environment."
            />
            {/* Add more values if needed */}
            {/* <ValueCard icon={CheckCircle} title="Integrity" description="We operate with transparency and honesty." /> */}
          </div>
        </div>
      </section>

      {/* Meet the Team Section (Placeholder/Link) */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              Meet the Founders
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
              The driving force behind Innov8mate. Our leadership team is
              dedicated to empowering innovators like you. Learn more about
              their background and vision.
            </p>
            {/* Grid for Founder Placeholders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 sm:mb-12">
              {founders.map((founder) => (
                <FounderCard key={founder.name} {...founder} />
              ))}
            </div>

            <Link to="/leadership">
              <button className="px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors text-sm sm:text-base inline-flex items-center gap-2 group">
                Learn More About Our Leadership{" "}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10 sm:mb-12">
            Innov8mate by the Numbers
          </h2>
          <dl className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              // Improved styling for stats
              <div
                key={stat.name}
                className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <dd className="order-1 text-3xl sm:text-4xl font-bold tracking-tight text-orange-600">
                  {stat.value}
                </dd>
                <dt className="order-2 text-sm sm:text-base leading-6 text-gray-600 mt-1">
                  {stat.name}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
};

export default About;
