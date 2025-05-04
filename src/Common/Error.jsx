/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-orange-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/home"
            className="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-inorangedigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Go back home
          </Link>
          <Link to="/Contact" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
      {/* <ProfilePage /> */}
    </main>
  );
};

export default Error;

// import {
//   Users,
//   Mail,
//   Phone,
//   MapPin,
//   Briefcase,
//   GraduationCap,
//   Github,
//   Linkedin,
//   Twitter,
//   Globe,
//   Edit,
//   MessageSquare,
//   ChevronDown,
//   Heart,
//   Star,
//   Zap,
//   Trophy,
//   Code,
//   Coffee,
//   Lightbulb,
// } from "lucide-react";
// import { useState } from "react";

// const ProfilePage = ({ user, isOwnProfile = false }) => {
//   const [activeTab, setActiveTab] = useState("overview");

//   // Mock data - in real app, this would come from props
//   const profileData = user || {
//     username: "harsha_innovator",
//     firstName: "Harsha",
//     lastName: "Patel",
//     email: "harsha@innov8mate.com",
//     about:
//       "Passionate software developer and founder of Innov8mate. I believe in creating technology that empowers innovators around the world to build the future. I specialize in creating scalable web applications and have a keen interest in AI/ML solutions for real-world problems.",
//     profileImageUrl: "/api/placeholder/400/400",
//     country: "India",
//     city: "Bangalore",
//     state: "Karnataka",
//     education: "B.Tech in Computer Science",
//     interests: ["AI/ML", "Startups", "Web Development", "Product Design"],
//     skills: [
//       "React",
//       "Node.js",
//       "MongoDB",
//       "UI/UX Design",
//       "Python",
//       "Project Management",
//     ],
//     github: "github.com/harsha-innovator",
//     linkedin: "linkedin.com/in/harsha-innovator",
//     twitter: "twitter.com/harsha_innov8",
//     website: "harsha-innovator.dev",
//     phoneNumber: "+91 9876543210",
//     workExperience: [
//       {
//         company: "Tech Innovators Inc.",
//         role: "Senior Developer",
//         startDate: new Date(2022, 1, 1),
//         endDate: null,
//         currentlyWorking: true,
//         description:
//           "Leading development of cutting-edge web applications for innovation-focused startups. Implementing modern tech stacks with React, Node.js, and serverless architectures to deliver scalable solutions.",
//       },
//       {
//         company: "CodeCraft Solutions",
//         role: "Junior Developer",
//         startDate: new Date(2020, 5, 1),
//         endDate: new Date(2021, 12, 31),
//         currentlyWorking: false,
//         description:
//           "Developed responsive web applications and contributed to open-source projects. Worked in an agile development environment to deliver client solutions across multiple industries.",
//       },
//     ],
//     projectList: [
//       {
//         owner: true,
//         collaborator: false,
//         project: {
//           _id: "1",
//           title: "Innov8mate Platform",
//           description:
//             "A platform connecting innovators with investors and collaborators. Features include project showcasing, idea validation, and resource matching.",
//           image: "/api/placeholder/100/100",
//           tags: ["Web App", "React", "Node.js"],
//           status: "In Progress",
//           collaborators: 5,
//         },
//       },
//       {
//         owner: false,
//         collaborator: true,
//         project: {
//           _id: "2",
//           title: "AI Mentor",
//           description:
//             "An AI-powered mentorship platform for young entrepreneurs. Uses natural language processing to provide personalized guidance and resources.",
//           image: "/api/placeholder/100/100",
//           tags: ["AI/ML", "Python", "React"],
//           status: "Completed",
//           collaborators: 3,
//         },
//       },
//       {
//         owner: true,
//         collaborator: false,
//         project: {
//           _id: "3",
//           title: "Innovation Hub",
//           description:
//             "A collaborative workspace management tool for innovation centers and coworking spaces.",
//           image: "/api/placeholder/100/100",
//           tags: ["SaaS", "React", "MongoDB"],
//           status: "Planning",
//           collaborators: 2,
//         },
//       },
//     ],
//     ideaList: [
//       {
//         owner: true,
//         supporter: false,
//         idea: {
//           _id: "1",
//           title: "Smart Innovation Hub",
//           description: "A physical+digital space for innovators to collaborate",
//           upvotes: 42,
//           tags: ["Space", "Collaboration", "Innovation"],
//         },
//       },
//       {
//         owner: false,
//         supporter: true,
//         idea: {
//           _id: "2",
//           title: "Startup Resource Marketplace",
//           description: "Platform for startups to exchange and share resources",
//           upvotes: 28,
//           tags: ["Marketplace", "Resources", "Startup"],
//         },
//       },
//     ],
//     friendList: [
//       {
//         _id: "1",
//         username: "sarah_tech",
//         name: "Sarah Chen",
//         role: "UX Designer",
//         profileImageUrl: "/api/placeholder/40/40",
//       },
//       {
//         _id: "2",
//         username: "alex_investor",
//         name: "Alex Rodriguez",
//         role: "Angel Investor",
//         profileImageUrl: "/api/placeholder/40/40",
//       },
//       {
//         _id: "3",
//         username: "priya_dev",
//         name: "Priya Sharma",
//         role: "Full Stack Developer",
//         profileImageUrl: "/api/placeholder/40/40",
//       },
//       {
//         _id: "4",
//         username: "mike_founder",
//         name: "Mike Johnson",
//         role: "Startup Founder",
//         profileImageUrl: "/api/placeholder/40/40",
//       },
//     ],
//     achievements: [
//       {
//         title: "Hackathon Winner",
//         description: "First place at BLR Tech Fest 2023",
//         date: new Date(2023, 5, 15),
//         icon: "trophy",
//       },
//       {
//         title: "100+ Contributions",
//         description: "Active open source contributor",
//         date: new Date(2022, 8, 22),
//         icon: "code",
//       },
//       {
//         title: "Mentor of the Month",
//         description: "Recognized for startup mentorship",
//         date: new Date(2023, 2, 10),
//         icon: "coffee",
//       },
//     ],
//   };

//   const formatDate = (date) => {
//     if (!date) return "Present";
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//     });
//   };

//   const getIconComponent = (iconName) => {
//     switch (iconName) {
//       case "trophy":
//         return <Trophy />;
//       case "code":
//         return <Code />;
//       case "coffee":
//         return <Coffee />;
//       default:
//         return <Lightbulb />;
//     }
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
//       {/* Header Section */}
//       <div className="bg-white shadow rounded-lg mb-6">
//         <div className="relative">
//           {/* Cover Photo */}
//           <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg"></div>

//           {/* Profile Image */}
//           <div className="absolute bottom-0 left-8 transform translate-y-1/2">
//             <div className="rounded-full border-4 border-white h-32 w-32 overflow-hidden">
//               <img
//                 src={profileData.profileImageUrl}
//                 alt={`${profileData.firstName} ${profileData.lastName}`}
//                 className="h-full w-full object-cover"
//               />
//             </div>
//           </div>

//           {/* Edit Button */}
//           {isOwnProfile && (
//             <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow">
//               <Edit size={16} />
//             </button>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="pt-16 pb-6 px-8">
//           <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
//             <div>
//               <h1 className="text-2xl font-bold">
//                 {profileData.firstName} {profileData.lastName}
//               </h1>
//               <p className="text-gray-600">@{profileData.username}</p>
//             </div>

//             {!isOwnProfile && (
//               <div className="mt-4 md:mt-0">
//                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 flex items-center">
//                   <MessageSquare size={16} className="mr-2" />
//                   Message
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Bio Section */}
//           <p className="text-gray-700 mb-6">{profileData.about}</p>

//           {/* Contact Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div className="flex items-center">
//               <Mail size={16} className="mr-2 text-gray-500" />
//               <span>{profileData.email}</span>
//             </div>
//             <div className="flex items-center">
//               <Phone size={16} className="mr-2 text-gray-500" />
//               <span>{profileData.phoneNumber}</span>
//             </div>
//             <div className="flex items-center">
//               <MapPin size={16} className="mr-2 text-gray-500" />
//               <span>
//                 {profileData.city}, {profileData.state}, {profileData.country}
//               </span>
//             </div>
//             <div className="flex items-center">
//               <Briefcase size={16} className="mr-2 text-gray-500" />
//               <span>
//                 {profileData.workExperience[0]?.role} at{" "}
//                 {profileData.workExperience[0]?.company}
//               </span>
//             </div>
//           </div>

//           {/* Social Links */}
//           <div className="flex flex-wrap gap-3">
//             {profileData.github && (
//               <a
//                 href={`https://${profileData.github}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 flex items-center"
//               >
//                 <Github size={16} className="mr-2" />
//                 <span>GitHub</span>
//               </a>
//             )}
//             {profileData.linkedin && (
//               <a
//                 href={`https://${profileData.linkedin}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 flex items-center"
//               >
//                 <Linkedin size={16} className="mr-2" />
//                 <span>LinkedIn</span>
//               </a>
//             )}
//             {profileData.twitter && (
//               <a
//                 href={`https://${profileData.twitter}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 flex items-center"
//               >
//                 <Twitter size={16} className="mr-2" />
//                 <span>Twitter</span>
//               </a>
//             )}
//             {profileData.website && (
//               <a
//                 href={`https://${profileData.website}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 flex items-center"
//               >
//                 <Globe size={16} className="mr-2" />
//                 <span>Website</span>
//               </a>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
//         <nav className="flex border-b">
//           <button
//             className={`px-4 py-3 font-medium ${
//               activeTab === "overview"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("overview")}
//           >
//             Overview
//           </button>
//           <button
//             className={`px-4 py-3 font-medium ${
//               activeTab === "projects"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("projects")}
//           >
//             Projects
//           </button>
//           <button
//             className={`px-4 py-3 font-medium ${
//               activeTab === "ideas"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("ideas")}
//           >
//             Ideas
//           </button>
//           <button
//             className={`px-4 py-3 font-medium ${
//               activeTab === "network"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("network")}
//           >
//             Network
//           </button>
//         </nav>

//         {/* Tab Content */}
//         <div className="p-6">
//           {/* Overview Tab */}
//           {activeTab === "overview" && (
//             <div>
//               {/* Skills & Interests */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 <div>
//                   <h2 className="text-xl font-semibold mb-4">Skills</h2>
//                   <div className="flex flex-wrap gap-2">
//                     {profileData.skills.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-semibold mb-4">Interests</h2>
//                   <div className="flex flex-wrap gap-2">
//                     {profileData.interests.map((interest, index) => (
//                       <span
//                         key={index}
//                         className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
//                       >
//                         {interest}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Work Experience */}
//               <div className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
//                 {profileData.workExperience.map((work, index) => (
//                   <div
//                     key={index}
//                     className="mb-4 border-l-2 border-gray-200 pl-4"
//                   >
//                     <h3 className="font-medium">{work.role}</h3>
//                     <p className="text-gray-700">{work.company}</p>
//                     <p className="text-gray-500 text-sm">
//                       {formatDate(work.startDate)} - {formatDate(work.endDate)}
//                     </p>
//                     <p className="mt-2 text-gray-600">{work.description}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Education */}
//               <div className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4">Education</h2>
//                 <div className="border-l-2 border-gray-200 pl-4">
//                   <h3 className="font-medium">{profileData.education}</h3>
//                 </div>
//               </div>

//               {/* Achievements */}
//               <div>
//                 <h2 className="text-xl font-semibold mb-4">Achievements</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profileData.achievements.map((achievement, index) => (
//                     <div
//                       key={index}
//                       className="bg-gray-50 p-4 rounded-lg flex items-start"
//                     >
//                       <div className="bg-blue-100 p-2 rounded-full mr-3">
//                         {getIconComponent(achievement.icon)}
//                       </div>
//                       <div>
//                         <h3 className="font-medium">{achievement.title}</h3>
//                         <p className="text-gray-600 text-sm">
//                           {achievement.description}
//                         </p>
//                         <p className="text-gray-500 text-xs mt-1">
//                           {formatDate(achievement.date)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Projects Tab */}
//           {activeTab === "projects" && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Projects</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {profileData.projectList.map((projectItem, index) => (
//                   <div
//                     key={index}
//                     className="border rounded-lg overflow-hidden"
//                   >
//                     <div className="h-40 bg-gray-100 relative">
//                       <img
//                         src={projectItem.project.image}
//                         alt={projectItem.project.title}
//                         className="h-full w-full object-cover"
//                       />
//                       <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm">
//                         {projectItem.project.status}
//                       </div>
//                       {projectItem.owner && (
//                         <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
//                           Owner
//                         </div>
//                       )}
//                       {projectItem.collaborator && (
//                         <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
//                           Collaborator
//                         </div>
//                       )}
//                     </div>
//                     <div className="p-4">
//                       <h3 className="font-medium text-lg">
//                         {projectItem.project.title}
//                       </h3>
//                       <p className="text-gray-600 mt-2">
//                         {projectItem.project.description}
//                       </p>
//                       <div className="flex flex-wrap gap-2 mt-3">
//                         {projectItem.project.tags.map((tag, tagIndex) => (
//                           <span
//                             key={tagIndex}
//                             className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                       <div className="mt-4 flex items-center justify-between">
//                         <span className="text-gray-500 text-sm flex items-center">
//                           <Users size={14} className="mr-1" />
//                           {projectItem.project.collaborators} collaborators
//                         </span>
//                         <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
//                           View Project
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Ideas Tab */}
//           {activeTab === "ideas" && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Ideas</h2>
//               <div className="space-y-4">
//                 {profileData.ideaList.map((ideaItem, index) => (
//                   <div key={index} className="border rounded-lg p-4">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium">{ideaItem.idea.title}</h3>
//                       <div className="flex items-center">
//                         <span className="flex items-center text-gray-600 mr-2">
//                           <Heart size={14} className="mr-1" />
//                           {ideaItem.idea.upvotes}
//                         </span>
//                         {ideaItem.owner && (
//                           <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
//                             Owner
//                           </span>
//                         )}
//                         {ideaItem.supporter && (
//                           <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
//                             Supporter
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <p className="text-gray-600">{ideaItem.idea.description}</p>
//                     <div className="flex flex-wrap gap-2 mt-3">
//                       {ideaItem.idea.tags.map((tag, tagIndex) => (
//                         <span
//                           key={tagIndex}
//                           className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Network Tab */}
//           {activeTab === "network" && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Network</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {profileData.friendList.map((friend, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center p-3 border rounded-lg"
//                   >
//                     <img
//                       src={friend.profileImageUrl}
//                       alt={friend.name}
//                       className="w-12 h-12 rounded-full mr-3"
//                     />
//                     <div>
//                       <h3 className="font-medium">{friend.name}</h3>
//                       <p className="text-gray-600 text-sm">
//                         @{friend.username}
//                       </p>
//                       <p className="text-gray-500 text-xs">{friend.role}</p>
//                     </div>
//                     <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 ml-auto">
//                       <MessageSquare size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Suggested People Section */}
//       {activeTab === "network" && (
//         <div className="bg-white shadow rounded-lg p-6 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Suggested Connections</h2>
//             <button className="text-blue-600 text-sm flex items-center">
//               See All <ChevronDown size={16} className="ml-1" />
//             </button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Suggested Connection 1 */}
//             <div className="border rounded-lg p-4 flex flex-col items-center">
//               <img
//                 src="/api/placeholder/80/80"
//                 alt="Suggested connection"
//                 className="w-16 h-16 rounded-full mb-2"
//               />
//               <h3 className="font-medium text-center">Raj Mehta</h3>
//               <p className="text-gray-600 text-sm text-center">
//                 Startup Mentor
//               </p>
//               <button className="mt-3 bg-blue-600 text-white px-4 py-1 rounded-full text-sm w-full">
//                 Connect
//               </button>
//             </div>
//             {/* Suggested Connection 2 */}
//             <div className="border rounded-lg p-4 flex flex-col items-center">
//               <img
//                 src="/api/placeholder/80/80"
//                 alt="Suggested connection"
//                 className="w-16 h-16 rounded-full mb-2"
//               />
//               <h3 className="font-medium text-center">Meera Patel</h3>
//               <p className="text-gray-600 text-sm text-center">
//                 Product Manager
//               </p>
//               <button className="mt-3 bg-blue-600 text-white px-4 py-1 rounded-full text-sm w-full">
//                 Connect
//               </button>
//             </div>
//             {/* Suggested Connection 3 */}
//             <div className="border rounded-lg p-4 flex flex-col items-center">
//               <img
//                 src="/api/placeholder/80/80"
//                 alt="Suggested connection"
//                 className="w-16 h-16 rounded-full mb-2"
//               />
//               <h3 className="font-medium text-center">Vikram Singh</h3>
//               <p className="text-gray-600 text-sm text-center">UX Designer</p>
//               <button className="mt-3 bg-blue-600 text-white px-4 py-1 rounded-full text-sm w-full">
//                 Connect
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bottom Stats Section */}
//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Activity Summary</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="border rounded-lg p-4 flex flex-col items-center">
//             <div className="rounded-full bg-blue-100 p-3 mb-2">
//               <Star size={24} className="text-blue-600" />
//             </div>
//             <p className="text-gray-600 text-sm">Projects</p>
//             <h3 className="font-bold text-xl">
//               {profileData.projectList.length}
//             </h3>
//           </div>
//           <div className="border rounded-lg p-4 flex flex-col items-center">
//             <div className="rounded-full bg-green-100 p-3 mb-2">
//               <Lightbulb size={24} className="text-green-600" />
//             </div>
//             <p className="text-gray-600 text-sm">Ideas</p>
//             <h3 className="font-bold text-xl">{profileData.ideaList.length}</h3>
//           </div>
//           <div className="border rounded-lg p-4 flex flex-col items-center">
//             <div className="rounded-full bg-purple-100 p-3 mb-2">
//               <Users size={24} className="text-purple-600" />
//             </div>
//             <p className="text-gray-600 text-sm">Network</p>
//             <h3 className="font-bold text-xl">
//               {profileData.friendList.length}
//             </h3>
//           </div>
//           <div className="border rounded-lg p-4 flex flex-col items-center">
//             <div className="rounded-full bg-amber-100 p-3 mb-2">
//               <Trophy size={24} className="text-amber-600" />
//             </div>
//             <p className="text-gray-600 text-sm">Achievements</p>
//             <h3 className="font-bold text-xl">
//               {profileData.achievements.length}
//             </h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
