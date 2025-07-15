import { createSlice } from "@reduxjs/toolkit";
import { getLeaveType } from "./thunk";

export const initialState = {
  leaveType: [],
  loading: false,
  error: null,
};
const LeaveTypeSlice = createSlice({
  name: "leaveType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveType = action.payload; // Update data with the fetched payload
      })
      .addCase(getLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
  },
});
export default LeaveTypeSlice.reducer;
