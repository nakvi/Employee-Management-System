import { createSlice } from "@reduxjs/toolkit";
import { getAttendanceGroup } from "./thunk";

export const initialState = {
  attendanceGroup: [],
  loading: false,
  error: null,
};

const AttendanceGroupSlice = createSlice({
  name: "AttendanceGroupSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceGroup.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getAttendanceGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceGroup = action.payload;
      })
      .addCase(getAttendanceGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
  },
});

export default AttendanceGroupSlice.reducer;
