import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ⭐ Get suggestions (called on every keystroke - NO frequency increment)
export const fetchSuggestions = createAsyncThunk(
  "allNews/fetchSuggestions",
  async (prefix, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/search-autocomplete",
        prefix,
        { headers: { "Content-Type": "text/plain" } }
      );
      return response.data;
    } catch (error) {
      console.error("AutoComplete Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ⭐ NEW - Increment search frequency (called ONLY when user actually searches)
export const incrementSearchFrequency = createAsyncThunk(
  "allNews/incrementSearchFrequency",
  async (term, { rejectWithValue }) => {
    try {
      if (!term || term.trim() === "") {
        return rejectWithValue("Search term cannot be empty");
      }

      await axios.post(
        "http://localhost:8080/api/search-autocomplete/increment",
        term.trim(),
        { headers: { "Content-Type": "text/plain" } }
      );
      return term;
    } catch (error) {
      console.error("Increment Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ⭐ Fetch news
export const fetchAllNews = createAsyncThunk(
  "allNews/fetchAllNews",
  async (
    { page = 1, limit = 30, search = "", section = "" },
    { rejectWithValue }
  ) => {
    try {
      let url;

      if (section === "Top Stories") {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        url = `http://localhost:8080/api/news/top-stories?${params.toString()}`;
      } else {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search && search.trim() !== "")
          params.append("search", search.trim());
        if (section && section !== "all" && section.trim() !== "")
          params.append("section", section.trim());

        url = `http://localhost:8080/api/news?${params.toString()}`;
      }

      const response = await axios.get(url);

      return {
        data: response.data,
        page,
        hasMore: response.data.length === limit,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const allNewsSlice = createSlice({
  name: "allNews",
  initialState: {
    items: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: null,
    searchQuery: "",
    selectedSection: "all",
    suggestions: [],
    showSuggestions: false,
  },

  reducers: {
    setSearchQuery: (state, action) => {
      console.log("🔍 Redux: Setting search query to:", action.payload);
      state.searchQuery = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
    setSelectedSection: (state, action) => {
      console.log("📂 Redux: Setting section to:", action.payload);
      state.selectedSection = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
      state.showSuggestions = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchAllNews handlers
      .addCase(fetchAllNews.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
      })
      .addCase(fetchAllNews.fulfilled, (state, action) => {
        state.loading = false;
        const cleanItems = action.payload.data.map((item) => {
          const normalizedImage =
            item.imageLink || item.image || item.img || item.urlToImage || "";

          return {
            ...item,
            title: item.title?.replace(/^"|"$/g, "") || "",
            source: item.source?.replace(/^"|"$/g, "") || "",
            link: item.link?.replace(/^"|"$/g, "") || "",
            date: item.date?.replace(/^"|"$/g, "") || "",
            section: item.section?.replace(/^"|"$/g, "") || "",
            image: normalizedImage,
            description: item.description?.replace(/^"|"$/g, "") || "",
            category: item.category?.replace(/^"|"$/g, "") || "",
          };
        });

        state.items = cleanItems;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchAllNews.rejected, (state, action) => {
        state.loading = false;
        const errorPayload = action.payload;
        if (typeof errorPayload === "object" && errorPayload !== null) {
          state.error =
            errorPayload.error ||
            errorPayload.message ||
            JSON.stringify(errorPayload);
        } else {
          state.error = errorPayload || "Failed to fetch news";
        }
        state.items = [];
      })

      // fetchSuggestions handlers
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload || [];
        state.showSuggestions = true;
      })
      .addCase(fetchSuggestions.rejected, (state) => {
        state.suggestions = [];
        state.showSuggestions = false;
      })

      // incrementSearchFrequency handlers
      .addCase(incrementSearchFrequency.pending, (state) => {
        // Optional: You can add loading state if needed
      })
      .addCase(incrementSearchFrequency.fulfilled, (state) => {
        // Successfully incremented, no state change needed
        console.log("✅ Search frequency incremented");
      })
      .addCase(incrementSearchFrequency.rejected, (state, action) => {
        console.error(
          "❌ Failed to increment search frequency:",
          action.payload
        );
      });
  },
});

export const { setSearchQuery, setSelectedSection, clearSuggestions } =
  allNewsSlice.actions;

export default allNewsSlice.reducer;
