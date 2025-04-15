import { createSlice } from "@reduxjs/toolkit";
import { getLocation,submitLocation,updateLocation,deleteLocation } from "./thunk";

export const initialState = {
  location: [],
  loading: false,
  error: null,
};
const LocationSlice = createSlice({
  name: "LocationSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLocation.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.location = action.payload; // Update data with the fetched payload
      })
      .addCase(getLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit location
    builder
      .addCase(submitLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitLocation.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.location = [...state.location, action.payload];
      })
      .addCase(submitLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateLocation.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.location = state.location.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update location.";
      });
    // Handle delete location
    builder
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.location = state.location.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete location.";
      });
  },
});
export default LocationSlice.reducer;
