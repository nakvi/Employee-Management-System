import { createSlice } from "@reduxjs/toolkit";
import { getAttendanceChange } from "./thunk";

export const initialState = {
  attendanceData: [],
  loading: false,
  error: null,
};

const attendanceChangeSlice = createSlice({
  name: "attendanceChange",
  initialState,
  reducers: {
    resetAttendanceChange: (state) => {
      state.attendanceData = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceChange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceChange.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceData = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAttendanceChange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
        state.attendanceData = [];
      });
  },
});

export const { resetAttendanceChange } = attendanceChangeSlice.actions;
export default attendanceChangeSlice.reducer;