import React from "react";
import {
  Mail,
  Phone,
  Home,
  Send,
  Instagram,
  Linkedin,
  Youtube,
  ChevronRight,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();

  // Don't show footer on the chat page
  if (pathname === "/chat") return null;

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-4 mt-20 relative overflow-hidden">
      {/* Background gradient elements */}
      <div
        className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 opacity-5"
        aria-hidden="true"
      >
        <div className="w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-orange-300 to-red-300 blur-3xl"></div>
      </div>
      <div
        className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 opacity-5"
        aria-hidden="true"
      >
        <div className="w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-red-300 to-orange-300 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand and Newsletter Section */}
          <div className="lg:col-span-4">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Innov<span className="text-gray-900">8</span>mate
              </h2>
              <p className="text-gray-600 mb-6">
                Join our subscribers list to get instant news and special
                offers.
              </p>

              {/* Newsletter Form */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full placeholder-gray-500 flex-grow px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                />
                <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2">
                  Subscribe
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Company</h3>
            <ul className="space-y-3">
              {[
                "About",
                "Help Center",
                "Career",
                "Plans & Pricing",
                "Contact",
                "Profile",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-600 hover:text-orange-600 transition-colors flex items-center"
                  >
                    <ChevronRight className="w-3 h-3 mr-1" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Community</h3>
            <ul className="space-y-3">
              {[
                "Terms of Services",
                "Privacy Policy",
                "Community Guidelines",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-600 hover:text-orange-600 transition-colors flex items-center"
                  >
                    <ChevronRight className="w-3 h-3 mr-1" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Contact Us</h3>
            <div className="space-y-4">
              {[
                {
                  icon: <Home className="w-5 h-5" />,
                  title: "Address",
                  content: "Tharapuvalasa, Vishakhapatnam-530129",
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  title: "Email",
                  content: "innov8mate.co@gmail.com",
                  isLink: true,
                },
                {
                  icon: <Phone className="w-5 h-5" />,
                  title: "Phone",
                  content: "+91 9876543210",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    {item.isLink ? (
                      <a
                        href={`mailto:${item.content}`}
                        className="text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-gray-600">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Innov8mate. All Rights Reserved.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                {
                  name: "Instagram",
                  icon: <Instagram className="w-5 h-5" />,
                  href: "https://www.instagram.com/",
                },
                {
                  name: "YouTube",
                  icon: <Youtube className="w-5 h-5" />,
                  href: "https://www.youtube.com/",
                },
                {
                  name: "LinkedIn",
                  icon: <Linkedin className="w-5 h-5" />,
                  href: "https://www.linkedin.com/",
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 rounded-lg hover:from-orange-100 hover:to-red-100 transition-all shadow-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${social.name} page`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
