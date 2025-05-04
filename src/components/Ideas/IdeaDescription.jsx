// /* eslint-disable react-hooks/exhaustive-deps */
// import { useState, useEffect, useCallback } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import axios from "axios";
// import { debounce } from "lodash";
// import { motion } from "framer-motion";
// import { Tab } from "@headlessui/react";
// import {
//   ArrowLeftIcon,
//   HeartIcon,
//   UserGroupIcon,
//   ShareIcon,
//   ChatBubbleLeftEllipsisIcon,
//   LinkIcon,
//   DocumentTextIcon,
//   LightBulbIcon,
//   RocketLaunchIcon,
//   ChartBarIcon,
//   SparklesIcon,
//   HandRaisedIcon,
//   CalendarIcon,
//   FireIcon,
//   BookmarkIcon,
// } from "@heroicons/react/24/outline";
// import {
//   HeartIcon as HeartSolidIcon,
//   BookmarkIcon as BookmarkSolidIcon,
// } from "@heroicons/react/24/solid";
// import { Lock, Send, Shield, X } from "lucide-react";
// import { HiOutlineShieldCheck } from "react-icons/hi";
// import { API_URL } from "../../Utils/constants.js";
// import ShareDialog from "./ShareDialog.jsx";
// import CommentSection from "./CommentSection";
// import Avatar from "../../Common/Avatar.jsx";
// import Badge from "../../Common/Badge.jsx";
// import { format } from "date-fns";
// import Confetti from "react-confetti";
// import { addUser } from "../../Utils/userSlice.js";

// const IdeaDescription = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);

//   // State management
//   const [idea, setIdea] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [supported, setSupported] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const [bookmarked, setBookmarked] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [activeTab, setActiveTab] = useState(0);
//   const [relatedIdeas, setRelatedIdeas] = useState([]);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [supportCount, setSupportCount] = useState(0);
//   const [likeCount, setLikeCount] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [supportModalOpen, setSupportModalOpen] = useState(false);

//   const tabs = [
//     { name: "Overview", icon: <LightBulbIcon className="w-5 h-5" /> },
//     { name: "Solution", icon: <RocketLaunchIcon className="w-5 h-5" /> },
//     { name: "Prototype", icon: <LinkIcon className="w-5 h-5" /> },
//     {
//       name: "Discussion",
//       icon: <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />,
//     },
//   ];

//   // Enhanced idea with dummy data for new fields
//   const enhancedIdea = {
//     ...idea,
//     maxSupporters: idea?.maxSupporters || 5,
//     locked: idea?.locked || false,
//     supportRequests: idea?.supportRequests || [],
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       const winHeight = window.innerHeight;
//       const docHeight = document.documentElement.scrollHeight;
//       const totalScrollable = docHeight - winHeight;
//       const progress = Math.min((scrollTop / totalScrollable) * 100, 100);
//       setScrollProgress(progress);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchUser();
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (user) fetchIdea();
//   }, [id, user]);

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/user/profile`, {
//         withCredentials: true,
//       });
//       if (response?.data?.data) dispatch(addUser(response.data.data));
//     } catch (err) {
//       console.error("User fetch error:", err);
//     }
//   };

//   const fetchIdea = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/ideas/${id}`, {
//         withCredentials: true,
//       });
//       const ideaData = response.data.data;

//       setIdea(ideaData);
//       console.log(ideaData, idea);
//       setComments(ideaData.comments || []);
//       setSupportCount(ideaData.supporters?.length || 0);
//       setLikeCount(ideaData.likes || 0);

//       if (user) {
//         setSupported(
//           ideaData.supporters?.some(
//             (supporter) => supporter._id?.toString() === user._id?.toString()
//           )
//         );
//         console.log(
//           "supported",
//           supported,
//           user._id?.toString(),
//           ideaData.supporters
//         );
//         setLiked(
//           ideaData.likedBy?.some(
//             (id) => id?.toString() === user._id?.toString()
//           )
//         );
//         setBookmarked(
//           ideaData.bookmarkedBy?.some(
//             (id) => id?.toString() === user._id?.toString()
//           )
//         );
//       }
//       fetchRelatedIdeas(ideaData.tags);
//     } catch (error) {
//       console.error(error);
//       setError("Failed to load idea details. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   }, [id, user]);

//   const fetchRelatedIdeas = async (tags) => {
//     if (!tags?.length) return;
//     try {
//       const response = await axios.get(`${API_URL}/ideas/related`, {
//         params: { tags: tags.join(","), excludeId: id },
//         withCredentials: true,
//       });
//       setRelatedIdeas(response?.data?.data?.slice(0, 3));
//     } catch (error) {
//       console.error("Error fetching related ideas:", error);
//     }
//   };

//   const handleLike = useCallback(
//     debounce(async () => {
//       if (!user) return navigate("/signin", { state: { from: `/idea/${id}` } });
//       try {
//         const endpoint = liked ? "unlike" : "like";
//         await axios.post(
//           `${API_URL}/ideas/${id}/${endpoint}`,
//           {},
//           { withCredentials: true }
//         );
//         setLiked(!liked);
//         setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
//         await axios.post(
//           `${API_URL}/ideas/cache/invalidate`,
//           { keys: [`idea:${id}`] },
//           { withCredentials: true }
//         );
//       } catch (error) {
//         console.error("Error updating like:", error);
//       }
//     }, 500),
//     [liked, user, id]
//   );

//   const handleSupport = useCallback(
//     debounce(async () => {
//       if (!user) return navigate("/login", { state: { from: `/idea/${id}` } });
//       if (
//         enhancedIdea.locked ||
//         enhancedIdea.supporters?.length >= enhancedIdea.maxSupporters
//       )
//         return;
//       setSupportModalOpen(true);
//     }, 700),
//     [
//       supported,
//       user,
//       id,
//       enhancedIdea.locked,
//       enhancedIdea.supporters,
//       enhancedIdea.maxSupporters,
//     ]
//   );

//   const handleBookmark = async () => {
//     if (!user) return navigate("/signup", { state: { from: `/idea/${id}` } });
//     try {
//       const endpoint = bookmarked ? "unbookmark" : "bookmark";
//       await axios.post(
//         `${API_URL}/ideas/${id}/${endpoint}`,
//         {},
//         { withCredentials: true }
//       );
//       setBookmarked(!bookmarked);
//     } catch (error) {
//       console.error("Error updating bookmark:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <motion.div
//           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//           className="w-24 h-24"
//         >
//           <LightBulbIcon className="w-full h-full text-orange-500" />
//         </motion.div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl text-center">
//           <h3 className="text-xl font-bold mb-2 text-red-600">
//             Oops! Something went wrong
//           </h3>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => fetchIdea()}
//             className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const getTagColor = (tag) => {
//     const colors = { Innovation: "orange", Tech: "red", Startup: "amber" };
//     return colors[tag] || "gray";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-16">
//       {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
//       <div
//         className="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 z-50 transition-all duration-150"
//         style={{ width: `${scrollProgress}%` }}
//       />

//       <header className="fixed top-0 w-full z-40 backdrop-blur-lg bg-white/90 border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//           <Link
//             to="/pitchideas"
//             className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
//           >
//             <ArrowLeftIcon className="h-5 w-5" />
//             <span className="font-medium">Ideas Hub</span>
//           </Link>
//           <div className="hidden md:block">
//             <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
//               <Tab.List className="flex space-x-1 rounded-xl bg-orange-50 p-1">
//                 {tabs.map((tab, index) => (
//                   <Tab
//                     key={index}
//                     className={({ selected }) =>
//                       `flex items-center space-x-1 w-full rounded-lg py-2 px-3 text-sm font-medium leading-5 ${
//                         selected
//                           ? "bg-white text-orange-700 shadow"
//                           : "text-gray-600 hover:bg-orange-100 hover:text-orange-700"
//                       }`
//                     }
//                   >
//                     {tab.icon}
//                     <span>{tab.name}</span>
//                   </Tab>
//                 ))}
//               </Tab.List>
//             </Tab.Group>
//           </div>
//           <div className="flex items-center space-x-3">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setOpen(true)}
//               className="p-2 rounded-full hover:bg-orange-100"
//             >
//               <ShareIcon className="h-5 w-5 text-gray-600" />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleBookmark}
//               className="p-2 rounded-full hover:bg-orange-100"
//             >
//               {bookmarked ? (
//                 <BookmarkSolidIcon className="h-5 w-5 text-orange-600" />
//               ) : (
//                 <BookmarkIcon className="h-5 w-5 text-gray-600" />
//               )}
//             </motion.button>
//             {idea?.owner && (
//               <Link
//                 to={`/profile/${idea.owner._id}`}
//                 className="flex items-center space-x-2 group"
//               >
//                 <Avatar
//                   src={idea.owner.profileImageUrl}
//                   alt={idea.owner.username}
//                   size="md"
//                   status="online"
//                 />
//               </Link>
//             )}
//           </div>
//         </div>
//       </header>

//       <main>
//         <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-red-700 overflow-hidden">
//           <div className="absolute inset-0 bg-pattern opacity-10"></div>
//           <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="max-w-3xl"
//             >
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {enhancedIdea.tags.slice(0, 3).map((tag, index) => (
//                   <Badge key={index} color={getTagColor(tag)}>
//                     {tag}
//                   </Badge>
//                 ))}
//                 {enhancedIdea.tags.length > 3 && (
//                   <Badge color="gray">+{enhancedIdea.tags.length - 3}</Badge>
//                 )}
//               </div>
//               <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-white">
//                 {enhancedIdea.title}
//               </h1>
//               <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6 line-clamp-3">
//                 {enhancedIdea.problemStatement}
//               </p>
//               <div className="flex items-center space-x-4 text-white/90">
//                 <div className="flex items-center">
//                   <CalendarIcon className="h-5 w-5 mr-2" />
//                   <span>Posted {format(new Date(), "MMM d, yyyy")}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <FireIcon className="h-5 w-5 mr-2" />
//                   <span>Trending</span>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//           <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
//             <div className="max-w-7xl mx-auto px-4 py-3">
//               <div className="flex flex-wrap items-center gap-6 md:gap-12 text-white">
//                 <div className="flex items-center space-x-2">
//                   <UserGroupIcon className="h-5 w-5" />
//                   <span className="text-sm md:text-base">
//                     <span className="font-bold">
//                       {supportCount}/{enhancedIdea.maxSupporters}
//                     </span>{" "}
//                     Supporters
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <HeartIcon className="h-5 w-5" />
//                   <span className="text-sm md:text-base">
//                     <span className="font-bold">{likeCount}</span> Likes
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
//                   <span className="text-sm md:text-base">
//                     <span className="font-bold">{comments.length}</span>{" "}
//                     Comments
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="md:hidden mb-6">
//             <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
//               <Tab.List className="flex space-x-1 rounded-xl bg-orange-50 p-1">
//                 {tabs.map((tab, index) => (
//                   <Tab
//                     key={index}
//                     className={({ selected }) =>
//                       `flex items-center justify-center w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
//                         selected
//                           ? "bg-white text-orange-700 shadow"
//                           : "text-gray-600 hover:bg-orange-100 hover:text-orange-700"
//                       }`
//                     }
//                   >
//                     {tab.icon}
//                   </Tab>
//                 ))}
//               </Tab.List>
//             </Tab.Group>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 space-y-6">
//               {activeTab === 0 && (
//                 <div className="space-y-6">
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//                   >
//                     <h2 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
//                       <LightBulbIcon className="h-6 w-6 mr-2" /> Problem
//                       Statement
//                     </h2>
//                     <p className="text-gray-700 leading-relaxed">
//                       {enhancedIdea.problemStatement}
//                     </p>
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.1 }}
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//                   >
//                     <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600">
//                       <ChartBarIcon className="h-6 w-6 mr-2" /> Impact
//                     </h2>
//                     <p className="text-gray-700 leading-relaxed">
//                       {enhancedIdea.impact}
//                     </p>
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.2 }}
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//                   >
//                     <h2 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
//                       <SparklesIcon className="h-6 w-6 mr-2" /> What Makes It
//                       Unique
//                     </h2>
//                     <p className="text-gray-700 leading-relaxed">
//                       {enhancedIdea.uniqueness}
//                     </p>
//                   </motion.div>
//                 </div>
//               )}
//               {activeTab === 1 && (
//                 <div className="space-y-6">
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//                   >
//                     <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600">
//                       <RocketLaunchIcon className="h-6 w-6 mr-2" /> Solution
//                       Approach
//                     </h2>
//                     <p className="text-gray-700 leading-relaxed">
//                       {enhancedIdea.approach}
//                     </p>
//                   </motion.div>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.1 }}
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//                   >
//                     <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
//                       <DocumentTextIcon className="h-6 w-6 mr-2" /> Full
//                       Description
//                     </h2>
//                     <p className="text-gray-700 leading-relaxed">
//                       {enhancedIdea.description}
//                     </p>
//                   </motion.div>
//                 </div>
//               )}
//               {activeTab === 2 && (
//                 <div className="space-y-6">
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//                   >
//                     <h2 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
//                       <LinkIcon className="h-6 w-6 mr-2" /> Prototype &
//                       Resources
//                     </h2>
//                     {enhancedIdea.prototypeLinks ? (
//                       <a
//                         href={enhancedIdea.prototypeLinks}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                       >
//                         View Prototype <LinkIcon className="h-4 w-4 ml-2" />
//                       </a>
//                     ) : (
//                       <p className="text-gray-600">
//                         No prototype links available yet.
//                       </p>
//                     )}
//                   </motion.div>
//                 </div>
//               )}
//               {activeTab === 3 && (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                   <h2 className="text-xl font-semibold mb-6 flex items-center text-red-600">
//                     <ChatBubbleLeftEllipsisIcon className="h-6 w-6 mr-2" />{" "}
//                     Discussion
//                   </h2>
//                   <CommentSection
//                     ideaId={id}
//                     comments={comments}
//                     setComments={setComments}
//                     user={user}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="space-y-6 sticky top-20 h-fit">
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//               >
//                 <h3 className="text-lg font-semibold mb-4">Creator</h3>
//                 {enhancedIdea.owner && (
//                   <div className="flex items-start space-x-4">
//                     <Avatar
//                       src={enhancedIdea.owner.profileImageUrl}
//                       alt={enhancedIdea.owner.username}
//                       size="lg"
//                       status="online"
//                     />
//                     <div>
//                       <h4 className="font-medium text-gray-900">
//                         {enhancedIdea.owner.username}
//                       </h4>
//                       <p className="text-sm text-gray-500">Idea Innovator</p>
//                       <button className="mt-3 px-3 py-1 bg-orange-50 text-orange-600 text-sm rounded-lg hover:bg-orange-100 transition-colors">
//                         View Profile
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//               >
//                 <h3 className="text-lg font-semibold mb-4 flex items-center text-orange-600">
//                   <HandRaisedIcon className="h-5 w-5 mr-2" /> Support Needed
//                 </h3>
//                 <div className="p-4 bg-orange-50 rounded-xl">
//                   <p className="text-gray-700">{enhancedIdea.supportType}</p>
//                 </div>
//                 {enhancedIdea.locked && (
//                   <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
//                     <Lock size={16} /> Idea Locked
//                   </p>
//                 )}
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleSupport}
//                   disabled={
//                     enhancedIdea.locked ||
//                     enhancedIdea.supporters?.length >=
//                       enhancedIdea.maxSupporters
//                   }
//                   className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
//                     enhancedIdea.locked ||
//                     enhancedIdea.supporters?.length >=
//                       enhancedIdea.maxSupporters
//                       ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       : supported
//                       ? "bg-green-500 text-white hover:bg-green-600"
//                       : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
//                   }`}
//                 >
//                   <UserGroupIcon className="h-5 w-5" />
//                   <span>{supported ? "Supporting" : "Support This Idea"}</span>
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleLike}
//                   className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
//                     liked
//                       ? "bg-red-500 text-white hover:bg-red-600"
//                       : "bg-white text-gray-900 border-2 border-red-500 hover:bg-red-50"
//                   }`}
//                 >
//                   {liked ? (
//                     <HeartSolidIcon className="h-5 w-5" />
//                   ) : (
//                     <HeartIcon className="h-5 w-5" />
//                   )}
//                   <span>{liked ? "Liked" : "Like"}</span>
//                 </motion.button>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {open && (
//         <ShareDialog
//           isOpen={open}
//           onClose={() => setOpen(false)}
//           ideaTitle={enhancedIdea.title}
//           ideaId={enhancedIdea._id}
//         />
//       )}
//       {supportModalOpen && (
//         <SupportModal
//           idea={enhancedIdea}
//           onClose={() => setSupportModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// // Support Modal Component
// const SupportModal = ({ idea, onClose }) => {
//   const [supportMessage, setSupportMessage] = useState("");
//   const [agreementAccepted, setAgreementAccepted] = useState(false);

//   const handleSupportRequest = async () => {
//     if (!agreementAccepted) {
//       alert("Please accept the agreement to proceed.");
//       return;
//     }
//     try {
//       await axios.post(
//         `${API_URL}/ideas/${idea._id}/support`,
//         { message: supportMessage },
//         { withCredentials: true }
//       );
//       onClose();
//     } catch (error) {
//       console.error("Error sending support request:", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold text-red-600">
//             Support "{idea.title}"
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-600 hover:text-red-500"
//           >
//             <X size={24} />
//           </button>
//         </div>
//         <p className="text-gray-600 mb-4">{idea.description}</p>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-semibold mb-2">
//             Your Support Message
//           </label>
//           <textarea
//             value={supportMessage}
//             onChange={(e) => setSupportMessage(e.target.value)}
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//             rows="4"
//             placeholder="How can you contribute to this idea?"
//           />
//         </div>
//         <div className="mb-4 bg-orange-100 p-4 rounded-lg flex items-start gap-2">
//           <HiOutlineShieldCheck size={24} className="text-orange-500" />
//           <div>
//             <p className="text-orange-700 font-semibold">Security Agreement</p>
//             <p className="text-sm text-gray-600">
//               By supporting this idea, you agree not to steal or misuse the
//               concept. Violation may lead to account suspension.
//             </p>
//             <label className="flex items-center gap-2 mt-2">
//               <input
//                 type="checkbox"
//                 checked={agreementAccepted}
//                 onChange={() => setAgreementAccepted(!agreementAccepted)}
//                 className="h-4 w-4 text-orange-500"
//               />
//               <span className="text-gray-700">I agree to the terms</span>
//             </label>
//           </div>
//         </div>
//         <button
//           onClick={handleSupportRequest}
//           className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 flex items-center justify-center gap-2"
//         >
//           <Send size={18} /> Send Support Request
//         </button>
//       </div>
//     </div>
//   );
// };

// export default IdeaDescription;

import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  HeartIcon,
  UserGroupIcon,
  ShareIcon,
  ChatBubbleLeftEllipsisIcon,
  LinkIcon,
  DocumentTextIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  SparklesIcon,
  HandRaisedIcon,
  CalendarIcon,
  FireIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
} from "@heroicons/react/24/solid";
import { Check } from "lucide-react";
import { Lock, Send, Shield, X } from "lucide-react";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { API_URL } from "../../Utils/constants.js";
import ShareDialog from "./ShareDialog.jsx";
import CommentSection from "./CommentSection";
import Avatar from "../../Common/Avatar.jsx";
import Badge from "../../Common/Badge.jsx";
import { format } from "date-fns";
import Confetti from "react-confetti";
import { addUser } from "../../Utils/userSlice.js";

const IdeaDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // State management
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [relatedIdeas, setRelatedIdeas] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const tabs = [
    { name: "Overview", icon: <LightBulbIcon className="w-5 h-5" /> },
    { name: "Solution", icon: <RocketLaunchIcon className="w-5 h-5" /> },
    { name: "Prototype", icon: <LinkIcon className="w-5 h-5" /> },
    {
      name: "Discussion",
      icon: <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />,
    },
  ];

  // Enhanced idea with dummy data for new fields
  const enhancedIdea = {
    ...idea,
    maxSupporters: idea?.maxSupporters || 5,
    locked: idea?.locked || false,
    supportRequests: idea?.supportRequests || [],
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) fetchIdea();
  }, [id, user]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/profile`, {
        withCredentials: true,
      });
      if (response?.data?.data) dispatch(addUser(response.data.data));
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const fetchIdea = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/ideas/${id}`, {
        withCredentials: true,
      });
      const ideaData = response.data.data;

      setIdea(ideaData);
      setComments(ideaData.comments || []);
      setSupportCount(ideaData.supporters?.length || 0);
      setLikeCount(ideaData.likes || 0);

      if (user) {
        setSupported(
          ideaData.supporters?.some(
            (supporter) => supporter._id?.toString() === user._id?.toString()
          )
        );
        setLiked(
          ideaData.likedBy?.some(
            (id) => id?.toString() === user._id?.toString()
          )
        );
        setBookmarked(
          ideaData.bookmarkedBy?.some(
            (id) => id?.toString() === user._id?.toString()
          )
        );
      }
      fetchRelatedIdeas(ideaData.tags);
    } catch (error) {
      console.error(error);
      setError("Failed to load idea details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  const fetchRelatedIdeas = async (tags) => {
    if (!tags?.length) return;
    try {
      const response = await axios.get(`${API_URL}/ideas/related`, {
        params: { tags: tags.join(","), excludeId: id },
        withCredentials: true,
      });
      setRelatedIdeas(response?.data?.data?.slice(0, 3));
    } catch (error) {
      console.error("Error fetching related ideas:", error);
    }
  };

  const handleLike = useCallback(
    debounce(async () => {
      if (!user) return navigate("/signin", { state: { from: `/idea/${id}` } });
      try {
        const endpoint = liked ? "unlike" : "like";
        await axios.post(
          `${API_URL}/ideas/${id}/${endpoint}`,
          {},
          { withCredentials: true }
        );
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
        // await axios.post(
        //   `${API_URL}/ideas/cache/invalidate`,
        //   { keys: [`idea:${id}`] },
        //   { withCredentials: true }
        // );
      } catch (error) {
        console.error("Error updating like:", error);
      }
    }, 500),
    [liked, user, id, navigate]
  );

  const handleSupport = useCallback(
    debounce(async () => {
      if (!user) return navigate("/login", { state: { from: `/idea/${id}` } });
      if (
        enhancedIdea.locked ||
        enhancedIdea.supporters?.length >= enhancedIdea.maxSupporters
      )
        return;
      setSupportModalOpen(true);
    }, 700),
    [
      user,
      id,
      enhancedIdea.locked,
      enhancedIdea.supporters,
      enhancedIdea.maxSupporters,
      navigate,
    ]
  );

  const handleBookmark = async () => {
    if (!user) return navigate("/signup", { state: { from: `/idea/${id}` } });
    try {
      const endpoint = bookmarked ? "unbookmark" : "bookmark";
      await axios.post(
        `${API_URL}/ideas/${id}/${endpoint}`,
        {},
        { withCredentials: true }
      );
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  const getTagColor = (tag) => {
    const colors = { Innovation: "orange", Tech: "red", Startup: "amber" };
    return colors[tag] || "gray";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16"
        >
          <LightBulbIcon className="w-full h-full text-orange-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-bold mb-2 text-red-600">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchIdea()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* Header - Compact and Fixed on Scroll */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/pitchideas"
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">Ideas Hub</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <nav className="flex space-x-1">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === index
                        ? "bg-orange-100 text-orange-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center space-x-1">
                      {tab.icon}
                      <span>{tab.name}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Share"
              >
                <ShareIcon className="h-5 w-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookmark}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Bookmark"
              >
                {bookmarked ? (
                  <BookmarkSolidIcon className="h-5 w-5 text-orange-600" />
                ) : (
                  <BookmarkIcon className="h-5 w-5 text-gray-600" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden sticky top-16 z-30 bg-white shadow-sm border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-2">
          <div className="flex justify-between">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex flex-col items-center py-3 flex-1 ${
                  activeTab === index
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-500"
                }`}
              >
                {tab.icon}
                <span className="text-xs mt-1">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Hero Section - More compact */}
        <div className="mb-6 pt-4 sm:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Tags and Title */}
            <div className="flex flex-wrap gap-2 mb-3">
              {enhancedIdea.tags?.slice(0, 3).map((tag, index) => (
                <Badge key={index} color={getTagColor(tag)}>
                  {tag}
                </Badge>
              ))}
              {enhancedIdea.tags?.length > 3 && (
                <Badge color="gray">+{enhancedIdea.tags.length - 3}</Badge>
              )}
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {enhancedIdea.title}
                </h1>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{format(new Date(), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center">
                    <FireIcon className="h-4 w-4 mr-1" />
                    <span>Trending</span>
                  </div>
                </div>
              </div>

              {/* Creator info on desktop */}
              {enhancedIdea.owner && (
                <div className="hidden sm:flex items-center bg-white p-2 rounded-lg shadow-sm">
                  <Link
                    to={`/profile/${enhancedIdea.owner._id}`}
                    className="flex items-center space-x-2"
                  >
                    <Avatar
                      src={enhancedIdea.owner.profileImageUrl}
                      alt={enhancedIdea.owner.username}
                      size="md"
                      status="online"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {enhancedIdea.owner.username}
                      </p>
                      <p className="text-xs text-gray-500">Idea Creator</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Stats bar - Accessible on mobile */}
            <div className="flex flex-wrap items-center bg-white rounded-lg shadow-sm p-3 mb-6">
              <div className="flex items-center mr-6 mb-2 sm:mb-0">
                <UserGroupIcon className="h-5 w-5 text-orange-500 mr-2" />
                <span>
                  <span className="font-bold">
                    {supportCount}/{enhancedIdea.maxSupporters}
                  </span>{" "}
                  <span className="text-gray-600">Supporters</span>
                </span>
              </div>
              <div className="flex items-center mr-6 mb-2 sm:mb-0">
                <HeartIcon className="h-5 w-5 text-red-500 mr-2" />
                <span>
                  <span className="font-bold">{likeCount}</span>{" "}
                  <span className="text-gray-600">Likes</span>
                </span>
              </div>
              <div className="flex items-center mb-2 sm:mb-0">
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span>
                  <span className="font-bold">{comments.length}</span>{" "}
                  <span className="text-gray-600">Comments</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Layout - Flexible Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 0 && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
                    <LightBulbIcon className="h-6 w-6 mr-2" /> Problem Statement
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {enhancedIdea.problemStatement}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600">
                    <ChartBarIcon className="h-6 w-6 mr-2" /> Impact
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {enhancedIdea.impact}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
                    <SparklesIcon className="h-6 w-6 mr-2" /> What Makes It
                    Unique
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {enhancedIdea.uniqueness}
                  </p>
                </motion.div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600">
                    <RocketLaunchIcon className="h-6 w-6 mr-2" /> Solution
                    Approach
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {enhancedIdea.approach}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                    <DocumentTextIcon className="h-6 w-6 mr-2" /> Full
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {enhancedIdea.description}
                  </p>
                </motion.div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
                    <LinkIcon className="h-6 w-6 mr-2" /> Prototype & Resources
                  </h2>
                  {enhancedIdea.prototypeLinks ? (
                    <a
                      href={enhancedIdea.prototypeLinks}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      View Prototype <LinkIcon className="h-4 w-4 ml-2" />
                    </a>
                  ) : (
                    <p className="text-gray-600">
                      No prototype links available yet.
                    </p>
                  )}
                </motion.div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-600">
                  <ChatBubbleLeftEllipsisIcon className="h-6 w-6 mr-2" />{" "}
                  Discussion
                </h2>
                <CommentSection
                  ideaId={id}
                  comments={comments}
                  setComments={setComments}
                  user={user}
                />
              </div>
            )}

            {/* Related Ideas Section */}
            {relatedIdeas.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Related Ideas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedIdeas.map((relatedIdea) => (
                    <Link
                      key={relatedIdea._id}
                      to={`/idea/${relatedIdea._id}`}
                      className="flex p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {relatedIdea.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {relatedIdea.problemStatement}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Action Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Action buttons - Top priority on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 space-y-4 order-first lg:order-none"
            >
              <div className="text-center mb-2">
                <span className="text-sm text-gray-500">
                  {enhancedIdea.locked ? "Idea is locked" : "Join this project"}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSupport}
                disabled={
                  enhancedIdea.locked ||
                  enhancedIdea.supporters?.length >= enhancedIdea.maxSupporters
                }
                className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                  enhancedIdea.locked ||
                  enhancedIdea.supporters?.length >= enhancedIdea.maxSupporters
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : supported
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>{supported ? "Supporting" : "Support This Idea"}</span>
              </motion.button>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLike}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                    liked
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {liked ? (
                    <HeartSolidIcon className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span className="ml-2">{liked ? "Liked" : "Like"}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpen(true)}
                  className="flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  <ShareIcon className="h-5 w-5" />
                  <span className="ml-2">Share</span>
                </motion.button>
              </div>

              {enhancedIdea.locked && (
                <div className="flex items-center justify-center p-2 bg-gray-100 rounded-lg text-gray-600 text-sm">
                  <Lock size={16} className="mr-2" />
                  This idea is currently locked to new supporters
                </div>
              )}
            </motion.div>

            {/* Creator info - Mobile */}
            {enhancedIdea.owner && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sm:hidden bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold mb-3">Creator</h3>
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={enhancedIdea.owner.profileImageUrl}
                    alt={enhancedIdea.owner.username}
                    size="lg"
                    status="online"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {enhancedIdea.owner.username}
                    </h4>
                    <p className="text-sm text-gray-500">Idea Innovator</p>
                    <Link
                      to={`/profile/${enhancedIdea.owner._id}`}
                      className="mt-2 inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Support Needed Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center text-orange-600">
                <HandRaisedIcon className="h-5 w-5 mr-2" /> Support Needed
              </h3>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-gray-700">
                  {enhancedIdea.supportType ||
                    "Looking for talented individuals to help bring this idea to life. Join as a supporter to collaborate!"}
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="text-sm font-medium">
                      {supportCount}/{enhancedIdea.maxSupporters} Supporters
                    </span>
                  </div>

                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
                      style={{
                        width: `${
                          (supportCount / enhancedIdea.maxSupporters) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {enhancedIdea.supportRequests &&
                enhancedIdea.supportRequests.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Skills Needed:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {enhancedIdea.supportRequests.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </motion.div>

            {/* Team Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center text-blue-600">
                <UserGroupIcon className="h-5 w-5 mr-2" /> Team
              </h3>

              {supportCount > 0 ? (
                <div className="space-y-4">
                  {/* Owner first */}
                  {enhancedIdea.owner && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={enhancedIdea.owner.profileImageUrl}
                          alt={enhancedIdea.owner.username}
                          size="md"
                          status="online"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {enhancedIdea.owner.username}
                          </p>
                          <p className="text-xs text-gray-500">Creator</p>
                        </div>
                      </div>
                      <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium">
                        Lead
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-3"></div>

                  {/* Supporters */}
                  {enhancedIdea.supporters
                    ?.slice(0, 3)
                    .map((supporter, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar
                            src={supporter.profileImageUrl}
                            alt={supporter.username}
                            size="md"
                            status={idx % 2 === 0 ? "online" : "offline"}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {supporter.username}
                            </p>
                            <p className="text-xs text-gray-500">Supporter</p>
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                          Member
                        </div>
                      </div>
                    ))}

                  {enhancedIdea.supporters?.length > 3 && (
                    <Link
                      to="#"
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium block text-center mt-2"
                    >
                      View all {enhancedIdea.supporters.length} supporters
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <UserGroupIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No supporters yet. Be the first to join!</p>
                </div>
              )}
            </motion.div>

            {/* Security & Trust Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center text-green-600">
                <HiOutlineShieldCheck className="h-5 w-5 mr-2" /> Security &
                Trust
              </h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Idea Protection</p>
                    <p className="text-sm text-gray-600">
                      All supporters agree to our intellectual property
                      protection policy
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <UserGroupIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Verified Supporters
                    </p>
                    <p className="text-sm text-gray-600">
                      All team members are verified through our platform
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <DocumentTextIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Clear Agreements
                    </p>
                    <p className="text-sm text-gray-600">
                      Transparent contribution terms between all team members
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Support Modal */}
        {supportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Support This Idea
                </h2>
                <button
                  onClick={() => setSupportModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  By supporting this idea, you agree to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-orange-100 p-1 rounded-full mr-2 mt-1">
                      <Check className="h-3 w-3 text-orange-600" />
                    </span>
                    Contribute your skills and expertise to the project
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 p-1 rounded-full mr-2 mt-1">
                      <Check className="h-3 w-3 text-orange-600" />
                    </span>
                    Follow our community guidelines and intellectual property
                    policies
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-100 p-1 rounded-full mr-2 mt-1">
                      <Check className="h-3 w-3 text-orange-600" />
                    </span>
                    Collaborate respectfully with the idea creator and other
                    supporters
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  How would you like to contribute? (Optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Share your skills and how you'd like to help..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSupportModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await axios.post(
                        `${API_URL}/ideas/${id}/support`,
                        {},
                        { withCredentials: true }
                      );
                      setSupported(true);
                      setSupportCount((prev) => prev + 1);
                      setSupportModalOpen(false);
                      setShowConfetti(true);
                      setTimeout(() => setShowConfetti(false), 3000);
                      // await axios.post(
                      //   `${API_URL}/ideas/cache/invalidate`,
                      //   { keys: [`idea:${id}`] },
                      //   { withCredentials: true }
                      // );
                    } catch (error) {
                      console.error("Error supporting idea:", error);
                    }
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Support This Idea
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Share Dialog */}
        <ShareDialog
          open={open}
          setOpen={setOpen}
          ideaId={id}
          ideaTitle={enhancedIdea.title}
        />
      </main>
    </div>
  );
};

export default IdeaDescription;
