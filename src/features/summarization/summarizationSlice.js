import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to call the summarization API
export const summarizeText = createAsyncThunk(
  "summarization/summarizeText",
  async (text, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/summarize",
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.summary;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate summary"
      );
    }
  }
);

const summarizationSlice = createSlice({
  name: "summarization",
  initialState: {
    inputText: "",
    summary: "",
    loading: false,
    error: null,
  },
  reducers: {
    setInputText: (state, action) => {
      state.inputText = action.payload;
    },
    clearSummary: (state) => {
      state.summary = "";
      state.error = null;
    },
    resetSummarization: (state) => {
      state.inputText = "";
      state.summary = "";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(summarizeText.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.summary = "";
      })
      .addCase(summarizeText.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(summarizeText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setInputText, clearSummary, resetSummarization } =
  summarizationSlice.actions;

export default summarizationSlice.reducer;
