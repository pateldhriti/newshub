import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch personalized recommendations
export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetchRecommendations",
  async ({ userId, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/recommendations`,
        {
          params: { userId, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Recommendations Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Track article click
export const trackArticleClick = createAsyncThunk(
  "recommendations/trackArticleClick",
  async ({ userId, articleId, articleTitle, section }, { rejectWithValue }) => {
    try {
      await axios.post("http://localhost:8080/api/recommendations/track", {
        userId,
        articleId,
        articleTitle,
        section,
      });
      return { articleId };
    } catch (error) {
      console.error("Track Click Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearRecommendations: (state) => {
      state.items = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchRecommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch recommendations";
      })

      // trackArticleClick
      .addCase(trackArticleClick.fulfilled, () => {
        console.log("✅ Article click tracked");
      })
      .addCase(trackArticleClick.rejected, (state, action) => {
        console.error("❌ Failed to track click:", action.payload);
      });
  },
});

export const { clearRecommendations } = recommendationSlice.actions;
export default recommendationSlice.reducer;
