import { createSlice } from "@reduxjs/toolkit";
import { getSecUserLocation, submitSecUserLocation, updateSecUserLocation, deleteSecUserLocation } from "./thunk";

export const initialState = {
  secUserLocation: [],
  loading: false,
  error: null,
};

const SecUserLocationSlice = createSlice({
  name: "SecUserLocationSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSecUserLocation.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getSecUserLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.secUserLocation = action.payload; // Update data with the fetched payload
      })
      .addCase(getSecUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit secUserLocation
    builder
      .addCase(submitSecUserLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitSecUserLocation.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new user Location to the existing array
        state.secUserLocation = [...state.secUserLocation, action.payload];
      })
      .addCase(submitSecUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateSecUserLocation.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.secUserLocation = state.secUserLocation.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateSecUserLocation.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update user Location.";
      });
    // Handle delete secUserLocation
    builder
      .addCase(deleteSecUserLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSecUserLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.secUserLocation = state.secUserLocation.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteSecUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user Location.";
      });
  },
});

export default SecUserLocationSlice.reducer;