import React from "react";
import { contactInfo } from "../Utils/constants";
import {
  Mail,
  Phone,
  Send,
  MapPin,
  MessageSquare,
  Users,
  HelpCircle,
  Briefcase,
} from "lucide-react";

const ContactCard = ({ info, icon }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 opacity-40 group-hover:scale-150 transition-all duration-500"></div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-sm flex-shrink-0">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 text-lg">{info.title}</h3>
          <a
            href={`mailto:${info.email}`}
            className="text-orange-600 hover:text-orange-700 transition-colors font-medium flex items-center gap-1"
          >
            <Mail className="w-4 h-4" />
            {info.email}
          </a>
          <p className="text-gray-600 flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {info.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const icons = [
    <MessageSquare className="w-5 h-5" />,
    <Briefcase className="w-5 h-5" />,
    <HelpCircle className="w-5 h-5" />,
    <Users className="w-5 h-5" />,
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
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

      {/* Header Section */}
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions or want to learn more about Innov8mate? Our team is
          here to help you connect, collaborate, and innovate.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-16">
        {contactInfo.map((info, index) => (
          <ContactCard key={index} info={info} icon={icons[index]} />
        ))}
      </div>

      {/* Contact Form Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Send Us a Message
            </h2>
            <p className="text-gray-600 mb-6">
              Fill out the form below, and our team will get back to you as soon
              as possible.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Office Location
                  </h4>
                  <p className="text-gray-600">
                    Tharapuvalasa, Vishakhapatnam-530129
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <a
                    href="mailto:innov8mate.co@gmail.com"
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    innov8mate.co@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600">+91 9876543210</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder-gray-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder-gray-500"
                  placeholder="Enter subject"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder-gray-500"
                  placeholder="Enter your message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
