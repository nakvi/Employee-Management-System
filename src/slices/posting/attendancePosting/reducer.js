import { createSlice } from "@reduxjs/toolkit";
import {
  getAttendancePosting,
  submitAttendancePosting
} from "./thunk";

const initialState = {
  attendancePosting: {
    data: [],
    loading: false,
    error: null,
  },
};

const AttendancePostingSlice = createSlice({
  name: "attendancePosting",
  initialState,
  reducers: {
    resetAttendancePostingState: (state) => {
      state.attendancePosting = {
        data: [],
        loading: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Daily Attendance
    builder
      .addCase(getAttendancePosting.pending, (state) => {
        state.attendancePosting.loading = true;
        state.attendancePosting.error = null;
      })
      .addCase(getAttendancePosting.fulfilled, (state, action) => {
        state.attendancePosting.loading = false;
        state.attendancePosting.data = action.payload;
      })
      .addCase(getAttendancePosting.rejected, (state, action) => {
        state.attendancePosting.loading = false;
        state.attendancePosting.error = action.payload;
      });

    // Submit Daily Attendance
    builder
      .addCase(submitAttendancePosting.pending, (state) => {
        state.attendancePosting.loading = true;
        state.attendancePosting.error = null;
      })
      .addCase(submitAttendancePosting.fulfilled, (state, action) => {
        state.attendancePosting.loading = false;
        state.attendancePosting.data = [...state.attendancePosting.data, ...action.payload];
      })
      .addCase(submitAttendancePosting.rejected, (state, action) => {
        state.attendancePosting.loading = false;
        state.attendancePosting.error = action.payload;
      });

  },
});

export const { resetAttendancePostingState } = AttendancePostingSlice.actions;
export default AttendancePostingSlice.reducer;