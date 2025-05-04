import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import planSlice from "./planSlice";
import notificationSlice from "./notificationSlice";
import chatSlice from "./chatSlice";

const appStore = configureStore({
  reducer: {
    user: userSlice,
    plan: planSlice,
    notifications: notificationSlice,
    chat: chatSlice,
  },
});

export default appStore;
