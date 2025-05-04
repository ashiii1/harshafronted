/* eslint-disable react/prop-types */
// components/CommentSection.js
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Avatar from "../../Common/Avatar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Utils/constants";

const CommentSection = ({ ideaId, comments, setComments, user }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  console.log(user);
  console.log(comments);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/signup", { state: { from: `/idea/${ideaId}` } });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${API_URL}/ideas/${ideaId}/comments`,
        { content: newComment },
        { withCredentials: true }
      );

      // Add new comment to the state
      const commentsArray = comments;
      commentsArray.unshift(response.data.data);
      setComments(commentsArray);

      // Clear input
      setNewComment("");

      // await axios.post(
      //   `${API_URL}/ideas/cache/invalidate`,
      //   {
      //     keys: [`idea:${ideaId}`],
      //   },
      //   { withCredentials: true }
      // );
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 ">
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <div className="flex space-x-4">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={user?.profileImageUrl}
            alt={user?.username || "User"}
            size="md"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                user
                  ? "Share your thoughts on this idea..."
                  : "Please login to comment"
              }
              disabled={!user || isSubmitting}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition-colors resize-none  placeholder-gray-500"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!user || isSubmitting || !newComment.trim()}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              !user || isSubmitting || !newComment.trim()
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </motion.button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Be the first to comment on this idea!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex space-x-4"
            >
              <img
                src={comment.user?.profileImageUrl}
                alt={comment.user?.username || "User"}
                size="md"
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {comment.user?.username || "Anonymous"}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {format(
                          new Date(comment.createdAt),
                          "MMM d, yyyy • h:mm a"
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
