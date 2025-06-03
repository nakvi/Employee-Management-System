import { createSlice } from "@reduxjs/toolkit";
import { getLateComingExemptAttendance,submitLateComingExemptAttendance,updateLateComingExemptAttendance,deleteLateComingExemptAttendance } from "./thunk";

export const initialState = {
  lateComingExemptAttendance: [],
  loading: false,
  error: null,
};

const LateComingExemptAttendanceSlice = createSlice({
  name: "LateComingExemptAttendanceSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLateComingExemptAttendance.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getLateComingExemptAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.lateComingExemptAttendance = action.payload;
      })
      .addCase(getLateComingExemptAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    builder
      .addCase(submitLateComingExemptAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitLateComingExemptAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.lateComingExemptAttendance = [
          ...state.lateComingExemptAttendance,
          action.payload,
        ];
      })
      .addCase(submitLateComingExemptAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateLateComingExemptAttendance.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.lateComingExemptAttendance = state.lateComingExemptAttendance.map(
          (group) => (group.VID === updatedGroup.VID ? updatedGroup : group)
        );
        state.loading = false;
      })
      .addCase(updateLateComingExemptAttendance.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deleteEmployee
    builder
      .addCase(deleteLateComingExemptAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLateComingExemptAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.lateComingExemptAttendance = state.lateComingExemptAttendance.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteLateComingExemptAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to delete Special Leave Entry.";
      });
  },
});

export default LateComingExemptAttendanceSlice.reducer;
