import { createSlice } from "@reduxjs/toolkit";
import { getShift,submitShift,updateShift,deleteShift } from "./thunk";

export const initialState = {
  shift: [],
  loading: false,
  error: null,
};
const ShiftSlice = createSlice({
  name: "ShiftSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getShift.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shift = action.payload; // Update data with the fetched payload
      })
      .addCase(getShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit submitAttendanceCode
    builder
      .addCase(submitShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitShift.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.shift = [...state.shift, action.payload];
      })
      .addCase(submitShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateShift.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.shift = state.shift.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update location.";
      });
    // Handle delete location
    builder
      .addCase(deleteShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shift = state.shift.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete location.";
      });
  },
});
export default ShiftSlice.reducer;
