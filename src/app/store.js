import { configureStore } from '@reduxjs/toolkit';
import newsReducer from '../features/news/newsSlice';
import allNewsReducer from '../features/news/allNewsSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    news: newsReducer,
    allNews: allNewsReducer,
  },
});

export default store;
