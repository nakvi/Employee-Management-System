import { createSlice } from "@reduxjs/toolkit";
import { getAttendanceEntry, saveAttendanceEntry } from "./thunk";

export const initialState = {
  attendanceData: [],
  loading: false,
  error: null,
  saveLoading: false,
  saveError: null,
};

const attendanceEntrySlice = createSlice({
  name: "attendanceEntry",
  initialState,
  reducers: {
    resetAttendanceData: (state) => {
      state.attendanceData = [];
      state.error = null;
      state.saveError = null;
    },
  },
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
      })
      .addCase(saveAttendanceEntry.pending, (state) => {
        state.saveLoading = true;
        state.saveError = null;
      })
      .addCase(saveAttendanceEntry.fulfilled, (state, action) => {
        state.saveLoading = false;
        state.attendanceData = action.payload.data || state.attendanceData;
      })
      .addCase(saveAttendanceEntry.rejected, (state, action) => {
        state.saveLoading = false;
        state.saveError = action.error.message || "Something went wrong";
      });
  },
});

export const { resetAttendanceData } = attendanceEntrySlice.actions;
export default attendanceEntrySlice.reducer;