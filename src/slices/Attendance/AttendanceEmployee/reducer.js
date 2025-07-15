
import { createSlice } from "@reduxjs/toolkit";
import { getAttendanceEmployee, saveAttendanceEmployee } from "./thunk";

export const initialState = {
  attendanceEmployeeData: [],
  loading: false,
  error: null,
  saveLoading: false,
  saveError: null,
};

const attendanceEmployeeSlice = createSlice({
  name: "attendanceEmployee",
  initialState,
  reducers: {
    resetAttendanceEmployeeData: (state) => {
      state.attendanceEmployeeData = [];
      state.error = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceEmployeeData = action.payload;
      })
      .addCase(getAttendanceEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(saveAttendanceEmployee.pending, (state) => {
        state.saveLoading = true;
        state.saveError = null;
      })
      .addCase(saveAttendanceEmployee.fulfilled, (state, action) => {
        state.saveLoading = false;
        state.attendanceEmployeeData = action.payload.data || state.attendanceEmployeeData;
      })
      .addCase(saveAttendanceEmployee.rejected, (state, action) => {
        state.saveLoading = false;
        state.saveError = action.error.message || "Something went wrong";
      });
  },
});

export const { resetAttendanceEmployeeData } = attendanceEmployeeSlice.actions;
export default attendanceEmployeeSlice.reducer;