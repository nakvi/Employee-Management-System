import { createSlice } from "@reduxjs/toolkit";
import { getLeaveBalance,submitLeaveBalance,updateLeaveBalance,deleteLeaveBalance } from "./thunk";

export const initialState = {
  leaveBalance: [],
  loading: false,
  error: null,
};
const LeaveBalanceSlice = createSlice({
  name: "LeaveBalanceSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeaveBalance.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalance = action.payload; // Update data with the fetched payload
      })
      .addCase(getLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit submitAttendanceCode
    builder
      .addCase(submitLeaveBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.leaveBalance = [...state.leaveBalance, action.payload];
      })
      .addCase(submitLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateLeaveBalance.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.leaveBalance = state.leaveBalance.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update location.";
      });
    // Handle delete location
    builder
      .addCase(deleteLeaveBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalance = state.leaveBalance.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete location.";
      });
  },
});
export default LeaveBalanceSlice.reducer;
