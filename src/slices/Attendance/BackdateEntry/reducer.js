import { createSlice } from "@reduxjs/toolkit";
import { getBackdateEntry, submitBackdateEntry } from "./thunk";

const initialState = {
  backdateEntry: null,
  loading: false,
  error: null,
};

const backdateEntrySlice = createSlice({
  name: "backdateEntry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBackdateEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBackdateEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.backdateEntry = action.payload;
      })
      .addCase(getBackdateEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch backdate entry data";
      })
      .addCase(submitBackdateEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBackdateEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.backdateEntry = action.payload;
      })
      .addCase(submitBackdateEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit backdate entry data";
      });
  },
});

export default backdateEntrySlice.reducer;