import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "../features/news/newsSlice";
import allNewsReducer from "../features/news/allNewsSlice";
import authReducer from "../features/auth/authSlice";
import summarizationReducer from "../features/summarization/summarizationSlice";
import recommendationReducer from "../features/recommendation/recommendationSlice";

// Configure the Redux store
export const store = configureStore({
  reducer: {
    news: newsReducer,
    allNews: allNewsReducer,
    auth: authReducer,
    summarization: summarizationReducer,
    recommendations: recommendationReducer,
  },
});

export default store;
