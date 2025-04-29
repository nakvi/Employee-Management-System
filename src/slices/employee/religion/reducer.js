import { createSlice } from "@reduxjs/toolkit";
import { getReligion} from "./thunk";

// Initial state
export const initialState = {
  religion: [], 
  loading: false, // Loading state
  error: null, // Error state
};

// Create slice
const ReligionSlice = createSlice({
  name: "ReligionSlice",
  initialState,
  reducers: {}, // No additional reducers needed
  extraReducers: (builder) => {
    // Handle getDesignation
    builder
      .addCase(getReligion.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(getReligion.fulfilled, (state, action) => {
        state.loading = false;
        state.religion = action.payload; 
      })
      .addCase(getReligion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong"; // Set error message
      });

  },
});

// Export the reducer
export default ReligionSlice.reducer;