import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedUser: null,
    unreadCount: 0,
    recentChats: [],
    chatHistory: {},
  },
  reducers: {
    setSelectedChatUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedChatUser: (state) => {
      state.selectedUser = null;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    setRecentChats: (state, action) => {
      state.recentChats = action.payload;
    },
    addMessageToHistory: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.chatHistory[chatId]) {
        state.chatHistory[chatId] = [];
      }
      state.chatHistory[chatId].push(message);
    },
    setChatHistory: (state, action) => {
      const { chatId, messages } = action.payload;
      state.chatHistory[chatId] = messages;
    },
  },
});

export const {
  setSelectedChatUser,
  clearSelectedChatUser,
  updateUnreadCount,
  incrementUnreadCount,
  resetUnreadCount,
  setRecentChats,
  addMessageToHistory,
  setChatHistory,
} = chatSlice.actions;

export default chatSlice.reducer;
