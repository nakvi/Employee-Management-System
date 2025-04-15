import { createSlice } from "@reduxjs/toolkit";
import { getCompany, updateCompany } from "./thunk";

export const initialState = {
  company: {},
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: "companySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompany.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Update reducer logic
    builder
      .addCase(updateCompany.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.company = { ...state.company, ...action.payload }; // Update correctly

        state.loading = false;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update location.";
      });
  },
});

export default companySlice.reducer;
