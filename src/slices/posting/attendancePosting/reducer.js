import { createSlice } from "@reduxjs/toolkit";
import {
  getDailyAttendance,
  submitDailyAttendance,
  updateDailyAttendance,
  deleteDailyAttendance,
} from "./thunk";

const initialState = {
  dailyAttendance: {
    data: [],
    loading: false,
    error: null,
  },
};

const dailyAttendanceSlice = createSlice({
  name: "dailyAttendance",
  initialState,
  reducers: {
    resetDailyAttendanceState: (state) => {
      state.dailyAttendance = {
        data: [],
        loading: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Daily Attendance
    builder
      .addCase(getDailyAttendance.pending, (state) => {
        state.dailyAttendance.loading = true;
        state.dailyAttendance.error = null;
      })
      .addCase(getDailyAttendance.fulfilled, (state, action) => {
        state.dailyAttendance.loading = false;
        state.dailyAttendance.data = action.payload;
      })
      .addCase(getDailyAttendance.rejected, (state, action) => {
        state.dailyAttendance.loading = false;
        state.dailyAttendance.error = action.payload;
      });

    // Submit Daily Attendance
    builder
      .addCase(submitDailyAttendance.pending, (state) => {
        state.dailyAttendance.loading = true;
        state.dailyAttendance.error = null;
      })
      .addCase(submitDailyAttendance.fulfilled, (state, action) => {
        state.dailyAttendance.loading = false;
        state.dailyAttendance.data = [...state.dailyAttendance.data, ...action.payload];
      })
      .addCase(submitDailyAttendance.rejected, (state, action) => {
        state.dailyAttendance.loading = false;
        state.dailyAttendance.error = action.payload;
      });

    // Update Daily Attendance
    builder
      .addCase(updateDailyAttendance.pending, (state) => {
        state.dailyAttendance.loading = true;
        state.dailyAttendance.error = null;
      })
      .addCase(updateDailyAttendance.fulfilled, (state, action) => {
        state.dailyAttendance.loading = false;
        const updatedData = state.dailyAttendance.data.map((item) =>
          item.id === action.payload.Id ? action.payload : item
        );
        state.dailyAttendance.data = updatedData;
      })
      .addCase(updateDailyAttendance.rejected, (state, action) => {
        state.dailyAttendance.loading = false;
        state.dailyAttendance.error = action.payload;
      });

    // Delete Daily Attendance
    builder
      .addCase(deleteDailyAttendance.pending, (state) => {
        state.dailyAttendance.loading = true;
        state.dailyAttendance.error = null;
      })
      .addCase(deleteDailyAttendance.fulfilled, (state, action) => {
        state.dailyAttendance.loading = false;
        state.dailyAttendance.data = state.dailyAttendance.data.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteDailyAttendance.rejected, (state, action) => {
        state.dailyAttendance.loading = false;
        state.dailyAttendance.error = action.payload;
      });
  },
});

export const { resetDailyAttendanceState } = dailyAttendanceSlice.actions;
export default dailyAttendanceSlice.reducer;