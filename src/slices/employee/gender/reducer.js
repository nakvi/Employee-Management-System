import { createSlice } from "@reduxjs/toolkit";
import { getGender} from "./thunk";

// Initial state
export const initialState = {
  gender: [], 
  loading: false, // Loading state
  error: null, // Error state
};

// Create slice
const GenderSlice = createSlice({
  name: "GenderSlice",
  initialState,
  reducers: {}, // No additional reducers needed
  extraReducers: (builder) => {
    // Handle getDesignation
    builder
      .addCase(getGender.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(getGender.fulfilled, (state, action) => {
        state.loading = false;
        state.gender = action.payload; // Update designation array with fetched data
      })
      .addCase(getGender.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong"; // Set error message
      });

  },
});

// Export the reducer
export default GenderSlice.reducer;