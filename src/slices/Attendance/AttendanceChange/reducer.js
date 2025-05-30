import { createSlice } from "@reduxjs/toolkit";
import { getAttendanceChange, postAttendanceChange } from "./thunk";

export const initialState = {
  attendanceData: [],
  loading: false,
  error: null,
  postLoading: false,
  postError: null,
};

const attendanceChangeSlice = createSlice({
  name: "attendanceChange",
  initialState,
  reducers: {
    resetAttendanceChange: (state) => {
      state.attendanceData = [];
      state.error = null;
      state.loading = false;
      state.postError = null;
      state.postLoading = false;
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
      })
      .addCase(postAttendanceChange.pending, (state) => {
        state.postLoading = true;
        state.postError = null;
      })
      .addCase(postAttendanceChange.fulfilled, (state, action) => {
        state.postLoading = false;
        // Optionally update attendanceData if needed based on API response
      })
      .addCase(postAttendanceChange.rejected, (state, action) => {
        state.postLoading = false;
        state.postError = action.error.message || "Something went wrong";
      });
  },
});

export const { resetAttendanceChange } = attendanceChangeSlice.actions;
export default attendanceChangeSlice.reducer;