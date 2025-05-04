/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaTimes,
  FaMoon,
  FaSun,
  FaImage,
  FaFileAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../../Utils/constants";

const GroupChat = ({
  showChat,
  setShowChat,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  currentUser,
  projectTitle,
}) => {
  const messagesEndRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!showChat) return null;
  console.log(messages);

  return (
    <div
      className={`fixed inset-0 ${
        darkMode ? "bg-gray-900" : "bg-black bg-opacity-50"
      } flex items-center justify-center z-50`}
    >
      <div
        className={`w-full max-w-2xl rounded-xl shadow-lg flex flex-col h-3/4 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold">{projectTitle} - Group Chat</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-500 hover:text-gray-700"
            >
              {darkMode ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 flex items-center ${
                  message.senderId === currentUser._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.senderId !== currentUser._id && (
                  <img
                    src={message.senderAvatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    message.senderId === currentUser._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.senderId !== currentUser._id && (
                    <p className="text-xs font-semibold mb-1">
                      {message.senderName}
                    </p>
                  )}
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 opacity-75 text-right">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {message.senderId === currentUser._id && " ✅"}
                  </p>
                </div>
              </motion.div>
            ))
          )}
          {isTyping && (
            <p className="text-xs text-gray-400">Someone is typing...</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={sendMessage}
          className="p-4 border-t flex items-center space-x-3"
        >
          <button className="text-gray-500 hover:text-blue-500">
            <FaImage className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-blue-500">
            <FaFileAlt className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              setIsTyping(true);
              setTimeout(() => setIsTyping(false), 2000);
            }}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
