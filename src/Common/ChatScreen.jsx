import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  Send,
  Paperclip,
  Image,
  UserPlus,
  Info,
  MessageCircle,
  Bell,
  Users,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Search,
  ArrowLeft,
  ChevronLeft,
  Mic,
  X,
  Check,
  CheckCheck,
  Filter,
} from "lucide-react";
import { API_URL } from "../Utils/constants";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { projectChatSocket } from "../services/socket";
import { clearSelectedChatUser } from "../Utils/chatSlice";

// Helper function to format last seen time
const formatLastSeen = (timestamp) => {
  if (!timestamp) return "Offline";
  return `Last seen ${formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
  })}`;
};

const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatMessageDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long", // Consider removing weekday for brevity if preferred
      month: "short",
      day: "numeric",
    });
  }
};

const shouldShowDate = (messages, index) => {
  if (index === 0 || !messages[index] || !messages[index - 1]) return true;
  try {
    const currentDate = new Date(messages[index].timestamp).toDateString();
    const prevDate = new Date(messages[index - 1].timestamp).toDateString();
    return currentDate !== prevDate;
  } catch (e) {
    console.error(
      "Error comparing dates:",
      messages[index],
      messages[index - 1],
      e
    );
    return true; // Show date separator if error occurs
  }
};

// --- Sub-components (Simulating separate files) ---

// --- MessageItem.jsx ---
const MessageItem = React.memo(({ message, currentUser }) => {
  if (!message || !currentUser) return null;

  const isSender = message.senderId === currentUser._id;

  // Base classes for the bubble
  const bubbleBaseClasses =
    "py-2 px-3 rounded-2xl shadow-sm max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl break-words transition-all duration-150";

  // Classes specific to sender/receiver
  const senderClasses = "bg-slate-800 text-white";
  const receiverClasses = "bg-slate-200 text-slate-800";

  // Timestamp and status classes
  const metaBaseClasses = "text-[10px] flex-shrink-0";
  const senderMetaClasses = "text-slate-400";
  const receiverMetaClasses = "text-slate-500";

  return (
    <div
      className={`flex items-end ${
        isSender ? "justify-end" : "justify-start"
      } mb-1.5`}
    >
      <div
        className={`${bubbleBaseClasses} ${
          isSender ? senderClasses : receiverClasses
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>

        <div className={`flex items-center justify-end gap-1.5 pt-1`}>
          <span
            className={`${metaBaseClasses} ${
              isSender ? senderMetaClasses : receiverMetaClasses
            }`}
          >
            {formatMessageTime(message.timestamp)}
          </span>

          {isSender && (
            <span title={message.status || "unknown"} className="flex-shrink-0">
              {message.status === "sent" && (
                <CheckCheck className="w-4 h-4 text-sky-400" />
              )}
              {message.status === "sending" && (
                <Check className="w-4 h-4 text-slate-400" />
              )}
              {message.status === "failed" && (
                <>
                  <X className="w-4 h-4 text-red-400" />{" "}
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// --- ChatListItem.jsx ---
const ChatListItem = React.memo(({ chat, isCurrent, onSelectChat }) => {
  if (!chat) return null;

  return (
    <div
      className={`p-4 hover:bg-slate-50 cursor-pointer transition-all duration-300 group flex items-center space-x-4 ${
        isCurrent
          ? "bg-slate-100 border-l-4 border-slate-800"
          : "border-l-4 border-transparent"
      }`}
      onClick={() => onSelectChat(chat)}
    >
      <div className="relative flex-shrink-0">
        <img
          src={
            chat.profileImageUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              chat.username || "?"
            )}&background=random`
          }
          alt={chat.username}
          className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-300"
        />
        {/* Status Dot */}
        {chat.status === "online" && (
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500"
            title="Online"
          ></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-slate-800 truncate">
            {chat.username}
          </h4>
          <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
            {chat.timestamp
              ? formatDistanceToNow(new Date(chat.timestamp), {
                  addSuffix: true,
                })
              : ""}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-slate-500 truncate flex-1 pr-2">
            {chat.lastMessage}
          </p>
          {/* Unread Count Badge */}
          {chat.unreadCount > 0 && (
            <span className="bg-slate-800 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
              {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// --- ChatSidebar.jsx ---
const ChatSidebar = React.memo(({ chats, currentChat, onSelectChat, user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const ChatTabs = [
    { id: "all", icon: <MessageCircle className="w-4 h-4" />, label: "All" },
    { id: "unread", icon: <Bell className="w-4 h-4" />, label: "Unread" },
    // { id: "groups", icon: <Users className="w-4 h-4" />, label: "Groups" }, // Add later if needed
  ];

  const filteredChats = React.useMemo(() => {
    return chats
      .filter((chat) => {
        // Basic search filter
        const matchesSearch = chat?.username
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        // Unread filter
        const matchesUnread =
          activeTab !== "unread" || (chat.unreadCount && chat.unreadCount > 0);
        // TODO: Group filter later
        return matchesSearch && matchesUnread;
      })
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)); // Sort by most recent message
  }, [chats, searchQuery, activeTab]);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-white">Messages</h2>
          <button className="text-white hover:bg-white/10 p-1.5 rounded-full transition-all duration-300">
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full py-2 pl-10 pr-4 rounded-full bg-white/10 text-white placeholder-white/70 border-none focus:ring-2 focus:ring-white/30 transition-all duration-300 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-white/70 w-4 h-4" />
        </div>
      </div>

      {/* Chat Tabs */}
      <div className="flex p-2 border-b border-slate-200 flex-shrink-0">
        {ChatTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center flex-1 text-center py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.icon}
            <span className="ml-1.5">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.userId}
              chat={chat}
              isCurrent={currentChat?.userId === chat.userId}
              onSelectChat={onSelectChat}
            />
          ))
        ) : (
          <p className="text-center text-sm text-slate-500 p-6">
            No chats found.
          </p>
        )}
      </div>
    </div>
  );
});

// --- ChatWindow.jsx ---
const ChatWindow = React.memo(
  ({ user, currentChat, messages, onSendMessage, onBackToList }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputHeight, setInputHeight] = useState("auto");
    const [showUserInfo, setShowUserInfo] = useState(false); // State for potential info panel
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const MAX_CHARS = 1000;
    const isMobileView = window.innerWidth < 768; // Simple check, might need resize listener if dynamic

    useEffect(() => {
      // Scroll to bottom when messages change or currentChat changes
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, currentChat]);

    useEffect(() => {
      // Focus input when chat changes
      inputRef.current?.focus();
    }, [currentChat]);

    const handleInputChange = (e) => {
      const text = e.target.value;
      if (text.length <= MAX_CHARS) {
        setNewMessage(text);
        // Adjust height
        const textarea = e.target;
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, 150); // Max height
        textarea.style.height = `${newHeight}px`;
        setInputHeight(`${newHeight}px`);
      }
    };

    const handleSendClick = (e) => {
      e.preventDefault();
      if (newMessage.trim() === "") return;
      onSendMessage(newMessage); // Pass text to parent handler
      setNewMessage(""); // Clear input
      // Reset height
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        setInputHeight("auto");
        inputRef.current.focus();
      }
    };

    if (!currentChat || !user) {
      // Placeholder when no chat is selected
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 text-center p-6 rounded-2xl border border-slate-200">
          <MessageCircle className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-medium text-slate-500 mb-2">
            Select a Conversation
          </h3>
          <p className="text-slate-400 max-w-xs text-sm">
            Choose a chat from the sidebar to begin messaging.
          </p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-slate-200 h-full">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            {isMobileView && (
              <button
                onClick={onBackToList}
                className="p-2 text-white hover:bg-white/10 rounded-full"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="relative flex-shrink-0">
              <img
                src={
                  currentChat.profileImageUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentChat.username || "?"
                  )}&background=random`
                }
                alt={currentChat.username}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/50 shadow-sm"
              />
              {currentChat.status === "online" && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 bg-emerald-500"></div>
              )}
            </div>
            <div>
              <h3 className="text-base font-medium text-white line-clamp-1">
                {currentChat.username}
              </h3>
              <p className="text-xs text-white/70">
                {currentChat.status === "online"
                  ? "Online"
                  : formatLastSeen(currentChat.lastSeen)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-2 text-white hover:bg-white/10 rounded-full">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-white hover:bg-white/10 rounded-full">
              <Video className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-white hover:bg-white/10 rounded-full"
              onClick={() => setShowUserInfo(!showUserInfo)}
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Area - Corrected background and overflow */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
          {" "}
          {/* Changed background */}
          {messages.map((message, index) => (
            <React.Fragment key={message._id || `msg-${index}`}>
              {shouldShowDate(messages, index) && (
                <div className="flex justify-center my-3">
                  <span className="bg-slate-200 text-slate-600 text-xs px-2.5 py-0.5 rounded-full">
                    {formatMessageDate(message.timestamp)}
                  </span>
                </div>
              )}
              <MessageItem message={message} currentUser={user} />
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} /> {/* For scrolling */}
        </div>

        {/* Input Area - Ensure visibility */}
        <div className="bg-white p-3 border-t border-slate-200 flex-shrink-0">
          <div className="flex items-end space-x-2">
            {/* Attachment/Image Buttons (Optional) */}
            <button className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                placeholder="Type your message..."
                className="w-full p-3 pr-10 bg-slate-100 rounded-lg focus:ring-2 focus:ring-slate-400 transition duration-150 text-sm resize-none overflow-hidden border border-slate-200"
                style={{ height: inputHeight, maxHeight: "120px" }} // Slightly reduced max height
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) handleSendClick(e);
                }}
                rows={1}
              />
              {/* Emoji Button (Optional) */}
              {/* <button className="absolute right-2 bottom-2 p-1 text-slate-400 hover:text-slate-600"><Smile className="w-5 h-5" /></button> */}
            </div>
            <button
              className="p-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition duration-150 disabled:opacity-50 flex-shrink-0"
              onClick={handleSendClick}
              disabled={newMessage.trim() === ""}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// --- Main ChatScreen Component (Orchestrator) ---
const ChatScreen = () => {
  const { chatId: initialChatId } = useParams(); // Get initial chat ID from route param if exists
  const [user, setUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  // Show list by default on mobile, hide when chat selected
  const [showChatListMobile, setShowChatListMobile] = useState(true);
  const dispatch = useDispatch();
  const selectedChatUser = useSelector((state) => state.chat.selectedUser);

  // --- Fetch User ---
  const fetchUserCallback = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/user/profile`, {
        withCredentials: true,
      });
      setUser(response?.data?.data);
    } catch (error) {
      console.error("User fetch error:", error);
      // Handle error appropriately, maybe redirect to login
    }
  }, []);

  useEffect(() => {
    fetchUserCallback();
  }, [fetchUserCallback]);

  // --- Load Selected User from Redux instead of localStorage ---
  useEffect(() => {
    if (selectedChatUser && selectedChatUser._id) {
      // Check if this user isn't already in our chats list
      const existingChat = chats.find(
        (chat) => chat.userId === selectedChatUser._id
      );

      if (!existingChat && selectedChatUser._id) {
        // Create a new chat entry for this user
        const newChat = {
          userId: selectedChatUser._id,
          firstName: selectedChatUser.firstName,
          lastName: selectedChatUser.lastName,
          profileImageUrl: selectedChatUser.profileImageUrl,
          status: "unknown", // Will be updated by socket events if online
          lastMessage: "",
          timestamp: new Date().toISOString(),
          unreadCount: 0,
        };

        setChats((prevChats) => [newChat, ...prevChats]);
        setCurrentChat(newChat);
        if (isMobileView) setShowChatListMobile(false);
      } else if (existingChat) {
        // If user exists in chats, select them
        setCurrentChat(existingChat);
        if (isMobileView) setShowChatListMobile(false);
      }

      // Clear the selected user from Redux after using it
      dispatch(clearSelectedChatUser());
    }
  }, [chats, isMobileView, dispatch, selectedChatUser]);

  // --- Fetch Initial Chat Users ---
  const fetchChatUsersCallback = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await axios.get(
        `${API_URL}/messages/user-chats/${user._id}`,
        { withCredentials: true }
      );
      const initialChats = response.data.map((chat) => ({
        ...chat,
        status: undefined,
        lastSeen: chat.lastSeen || chat.timestamp,
        unreadCount: chat.unreadCount || 0, // Ensure unreadCount exists
      }));
      setChats(initialChats);

      // If initialChatId is provided, select that chat
      if (initialChatId) {
        const foundChat = initialChats.find((c) => c.userId === initialChatId);
        if (foundChat) {
          setCurrentChat(foundChat);
          if (isMobileView) setShowChatListMobile(false);
        } else {
          // Chat not found in existing chats, we may need to fetch user details
          fetchUserDetailsAndCreateChat(initialChatId);
        }
      }
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  }, [user, initialChatId, isMobileView]); // Added dependencies

  // --- Fetch User Details and Create Chat if coming directly via URL ---
  const fetchUserDetailsAndCreateChat = async (userId) => {
    if (!userId || !user?._id) return;

    try {
      const response = await axios.get(`${API_URL}/user/profile/${userId}`, {
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        const userData = response.data.data;
        const newChat = {
          userId: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          status: "unknown",
          lastMessage: "",
          timestamp: new Date().toISOString(),
          unreadCount: 0,
        };

        setChats((prevChats) => [newChat, ...prevChats]);
        setCurrentChat(newChat);
        if (isMobileView) setShowChatListMobile(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchChatUsersCallback();
  }, [fetchChatUsersCallback]);

  // --- Fetch Messages for Current Chat ---
  const fetchMessagesCallback = useCallback(async () => {
    if (currentChat?.userId && user?._id) {
      try {
        const response = await axios.get(
          `${API_URL}/messages/${currentChat.userId}/${user._id}`,
          { withCredentials: true }
        );
        setMessages(response.data || []);
        // Mark messages as read on fetch (optional - requires backend support or client-side logic)
        setChats((prev) =>
          prev.map((c) =>
            c.userId === currentChat.userId ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]); // Clear messages on error
      }
    } else {
      setMessages([]); // Clear messages if no current chat
    }
  }, [user, currentChat]);

  useEffect(() => {
    fetchMessagesCallback();
  }, [fetchMessagesCallback]);

  // --- Socket Setup and Event Handling ---
  useEffect(() => {
    if (!user?._id) return;

    console.log(`[ChatScreen] Initializing socket for user: ${user._id}`);
    const newSocket = projectChatSocket(null, user._id, "chat"); // Simplified type
    setSocket(newSocket);

    newSocket.on("connect", () =>
      console.log(`[ChatScreen] Socket connected: ${newSocket.id}`)
    );
    newSocket.on("disconnect", (reason) =>
      console.log(`[ChatScreen] Socket disconnected. Reason: ${reason}`)
    );

    // --- Event Listeners ---
    const handlePrivateMessage = (message) => {
      console.log("[ChatScreen] Received 'receivePrivateMessage':", message);
      // If it's for the current chat, add to messages
      if (message?.senderId === currentChat?.userId) {
        setMessages((prev) => [...prev, message]);
        // TODO: Add logic to mark as read if window is active
      } else {
        // Otherwise, update the chat list (unread count, last message)
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.userId === message.senderId
              ? {
                  ...chat,
                  lastMessage: message.text,
                  timestamp: message.timestamp,
                  unreadCount: (chat.unreadCount || 0) + 1,
                }
              : chat
          )
        );
        // TODO: Trigger a browser notification?
      }
    };

    const handleStatusUpdate = (data) => {
      console.log("[ChatScreen] Received 'userStatusUpdate':", data);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.userId === data.userId
            ? { ...chat, status: data.status, lastSeen: data.lastSeen }
            : chat
        )
      );
      if (currentChat?.userId === data.userId) {
        setCurrentChat((prev) =>
          prev
            ? { ...prev, status: data.status, lastSeen: data.lastSeen }
            : null
        );
      }
    };

    newSocket.on("receivePrivateMessage", handlePrivateMessage);
    newSocket.on("userStatusUpdate", handleStatusUpdate);
    // Add other listeners if needed (e.g., for project messages: "message")

    return () => {
      console.log("[ChatScreen] Disconnecting socket and removing listeners");
      newSocket.off("receivePrivateMessage", handlePrivateMessage);
      newSocket.off("userStatusUpdate", handleStatusUpdate);
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user, currentChat]); // currentChat dependency is important here!

  // --- Send Message Handler ---
  const handleSendMessage = useCallback(
    async (messageText) => {
      if (!socket || !user?._id || !currentChat?.userId) return;

      const now = new Date();
      const tempId = `temp_${Date.now()}`;
      const receiverId = currentChat.userId;
      const optimisticMessage = {
        _id: tempId,
        receiverId: receiverId,
        senderId: user._id,
        senderName: `${user.firstName} ${user.lastName}`,
        timestamp: now.toISOString(),
        text: messageText,
        status: "sending",
      };

      // Add optimistically
      setMessages((prev) => [...prev, optimisticMessage]);

      // Update chat list preview
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.userId === receiverId
            ? {
                ...chat,
                lastMessage: messageText,
                timestamp: optimisticMessage.timestamp,
              }
            : chat
        )
      );

      // Create notification for the receiver
      const notificationPayload = {
        type: "new_message",
        message: `${user.firstName} ${user.lastName} sent you a message`,
        chatId: [user._id, receiverId].sort().join("_"),
        chatType: "private",
        timestamp: now.toISOString(),
        senderId: user._id,
        senderName: `${user.firstName} ${user.lastName}`,
        senderImage: user.profileImageUrl,
        read: false,
      };

      // Emit notification
      socket.emit("sendNotification", {
        receiverId: receiverId,
        notification: notificationPayload,
      });

      // Emit message
      socket.emit("sendPrivateMessage", {
        message: optimisticMessage,
        receiverId: receiverId,
      });

      // Also save to server
      try {
        const response = await axios.post(
          `${API_URL}/messages/send`,
          {
            receiverId: receiverId,
            text: messageText,
          },
          { withCredentials: true }
        );

        // Update temp message with server ID
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempId
              ? { ...msg, _id: response.data._id, status: "sent" }
              : msg
          )
        );
      } catch (error) {
        console.error("Error sending message:", error);
        // Mark as failed
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempId ? { ...msg, status: "failed" } : msg
          )
        );
      }
    },
    [socket, user, currentChat]
  );

  // --- Select Chat Handler ---
  const handleSelectChat = useCallback(
    (chat) => {
      setCurrentChat(chat);
      // Reset unread count visually immediately (backend should confirm later)
      setChats((prev) =>
        prev.map((c) =>
          c.userId === chat.userId ? { ...c, unreadCount: 0 } : c
        )
      );
      if (isMobileView) {
        setShowChatListMobile(false);
      }
      // Fetch messages for the selected chat (handled by useEffect dependent on currentChat)
    },
    [isMobileView]
  );

  // --- Back To List Handler (Mobile) ---
  const handleBackToList = useCallback(() => {
    setCurrentChat(null);
    setShowChatListMobile(true);
  }, []);

  // --- Resize Listener ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setShowChatListMobile(true); // Always show list on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Render ---
  if (!user) {
    // Show loading state or redirect if user fetch failed
    return (
      <div className="flex items-center justify-center h-screen">
        Loading user...
      </div>
    ); // Basic loading
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      {" "}
      {/* Adjusted height for AppLayout padding */}
      {/* Sidebar - Conditionally rendered/hidden */}
      <div
        className={`h-full transition-all duration-300 ${
          isMobileView
            ? showChatListMobile
              ? "w-full flex-shrink-0"
              : "w-0 hidden"
            : "w-80 lg:w-96 flex-shrink-0"
        }`}
      >
        <ChatSidebar
          chats={chats}
          currentChat={currentChat}
          onSelectChat={handleSelectChat}
          user={user}
        />
      </div>
      {/* Chat Window - Conditionally rendered/hidden */}
      <div
        className={`h-full flex-1 transition-all duration-300 ${
          isMobileView ? (showChatListMobile ? "w-0 hidden" : "w-full") : "flex"
        }`}
      >
        <ChatWindow
          user={user}
          currentChat={currentChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBackToList={handleBackToList}
        />
      </div>
    </div>
  );
};

export default ChatScreen;
