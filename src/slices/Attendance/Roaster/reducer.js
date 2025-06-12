import { createSlice } from "@reduxjs/toolkit";
import { getRoster, submitRoster } from "./thunk";

const initialState = {
  roster: null,
  loading: false,
  error: null,
};

const rosterSlice = createSlice({
  name: "roster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoster.fulfilled, (state, action) => {
        state.loading = false;
        state.roster = action.payload;
      })
      .addCase(getRoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch roster data";
      })
      .addCase(submitRoster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitRoster.fulfilled, (state, action) => {
        state.loading = false;
        state.roster = action.payload;
      })
      .addCase(submitRoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit roster data";
      });
  },
});

export default rosterSlice.reducer;