import { createSlice } from "@reduxjs/toolkit";
import { getConfiguration,updateConfiguration } from "./thunk";

const initialState = {
  configuration: null,
  loading: false,
  error: null,
};

const ConfigurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.configuration = action.payload;
      })
      .addCase(getConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch configuration   data";
      })
      .addCase(updateConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.backdateEntry = action.payload;
      })
      .addCase(updateConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit backdate entry data";
      });
  },
});

export default backdateEntrySlice.reducer;