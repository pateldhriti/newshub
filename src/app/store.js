import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "../features/news/newsSlice";
import allNewsReducer from "../features/news/allNewsSlice";
import authReducer from "../features/auth/authSlice"; // ⬅️ NEW

// Configure the Redux store
export const store = configureStore({
  reducer: {
    news: newsReducer,
    allNews: allNewsReducer,
    auth: authReducer, // ⬅️ ADD THIS
  },
});

export default store;
