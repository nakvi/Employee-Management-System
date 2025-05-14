import { createSlice } from "@reduxjs/toolkit";
import { getAttendanceEntry } from "./thunk";

export const initialState = {
  attendanceData: [],
  loading: false,
  error: null,
};

const attendanceEntrySlice = createSlice({
  name: "attendanceEntry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceData = action.payload;
      })
      .addCase(getAttendanceEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default attendanceEntrySlice.reducer;