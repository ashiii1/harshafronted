import React, { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { fetchReviewsApi } from "../../apiServices";

// Default profile image
const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/100";

// Dummy reviews for fallback
const dummyReviews = [
  {
    _id: "dummy1",
    userId: {
      firstName: "Alex",
      lastName: "Johnson",
      username: "alexj",
      profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    text: "Innov8mate connected me with the perfect co-founder for my startup. The platform is intuitive and full of opportunities!",
    rating: 5,
  },
  {
    _id: "dummy2",
    userId: {
      firstName: "Samantha",
      lastName: "Chen",
      username: "samchen",
      profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    text: "Found incredible collaborators for my project idea here. The community is supportive and actively engaged.",
    rating: 5,
  },
  {
    _id: "dummy3",
    userId: {
      firstName: "Mike",
      lastName: "Davis",
      username: "mikedev",
      profileImageUrl: "https://randomuser.me/api/portraits/men/51.jpg",
    },
    text: "Great platform for getting feedback on early-stage ideas. Helped me refine my pitch significantly.",
    rating: 4,
  },
];

// ⭐ Star Rating UI
const renderStars = (rating = 5) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 sm:w-5 sm:h-5 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={index < rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};

// 📌 Single Review Card
const ReviewsCard = ({ review }) => {
  const { userId = {}, text = "", rating = 5 } = review || {};
  const {
    firstName = "Anonymous",
    lastName = "",
    username = "user",
    profileImageUrl,
  } = userId;

  return (
    <div className="relative bg-white rounded-xl shadow-md transition-all transform duration-300 hover:shadow-lg hover:-translate-y-1 p-5 sm:p-6 border border-gray-100 flex flex-col h-full">
      <Quote className="absolute top-4 right-4 w-8 h-8 text-orange-100 opacity-80" />
      <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
        <img
          src={profileImageUrl || DEFAULT_PROFILE_IMAGE}
          alt={`${firstName} ${lastName}`}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-orange-100"
          onError={(e) => (e.target.src = DEFAULT_PROFILE_IMAGE)}
        />
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {firstName} {lastName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">@{username}</p>
        </div>
      </div>

      <div className="flex-grow mb-4">
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          {text}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        {renderStars(rating)}
        <span className="text-xs sm:text-sm text-gray-500 font-medium">
          {rating}.0 / 5.0
        </span>
      </div>
    </div>
  );
};

// 📢 Reviews Component
const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await fetchReviewsApi();
      if (responseData?.reviews && responseData.reviews.length > 0) {
        setReviews(responseData.reviews);
      } else {
        console.log("No reviews fetched or empty array, using dummy data.");
        setReviews(dummyReviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message || "Could not load testimonials at this time.");
      setReviews(dummyReviews);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Success Stories from Our Innovators
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Hear from founders, students, and collaborators who transformed their
          ideas with Innov8mate.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-10 px-4 bg-red-50 rounded-lg border border-red-200">
          <p className="font-semibold mb-2">Oops! Something went wrong.</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={fetchReviews}
            className="mt-2 px-5 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <ReviewsCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10 px-4 bg-gray-100 rounded-lg border border-gray-200">
          <p className="font-medium">No Testimonials Yet</p>
          <p className="text-sm mt-1">
            Be the first to share your success story!
          </p>
        </div>
      )}
    </>
  );
};

export default Reviews;
