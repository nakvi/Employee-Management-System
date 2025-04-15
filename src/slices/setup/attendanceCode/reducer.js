import { createSlice } from "@reduxjs/toolkit";
import { getAttendanceCode,submitAttendanceCode,updateAttendanceCode,deleteAttendanceCode } from "./thunk";

export const initialState = {
  attendanceCode: [],
  loading: false,
  error: null,
};
const AttendanceCodeSlice = createSlice({
  name: "AttendanceCodeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceCode.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getAttendanceCode.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceCode = action.payload; // Update data with the fetched payload
      })
      .addCase(getAttendanceCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit submitAttendanceCode
    builder
      .addCase(submitAttendanceCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitAttendanceCode.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.attendanceCode = [...state.attendanceCode, action.payload];
      })
      .addCase(submitAttendanceCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateAttendanceCode.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.attendanceCode = state.attendanceCode.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateAttendanceCode.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update location.";
      });
    // Handle delete location
    builder
      .addCase(deleteAttendanceCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAttendanceCode.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceCode = state.attendanceCode.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteAttendanceCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete location.";
      });
  },
});
export default AttendanceCodeSlice.reducer;
