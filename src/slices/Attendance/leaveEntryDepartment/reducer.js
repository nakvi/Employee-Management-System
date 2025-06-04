import { createSlice } from "@reduxjs/toolkit";
import { getLeaveEntryDepartment,submitLeaveEntryDepartment,updateLeaveEntryDepartment,deleteLeaveEntryDepartment } from "./thunk";

export const initialState = {
  leaveEntryDepartment: [],
  loading: false,
  error: null,
};

const LeaveEntryDepartmentSlice = createSlice({
  name: "LeaveEntryDepartmentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeaveEntryDepartment.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getLeaveEntryDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveEntryDepartment = action.payload;
      })
      .addCase(getLeaveEntryDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    builder
      .addCase(submitLeaveEntryDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitLeaveEntryDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveEntryDepartment = [
          ...state.leaveEntryDepartment,
          action.payload,
        ];
      })
      .addCase(submitLeaveEntryDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateLeaveEntryDepartment.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.leaveEntryDepartment = state.leaveEntryDepartment.map(
          (group) => (group.VID === updatedGroup.VID ? updatedGroup : group)
        );
        state.loading = false;
      })
      .addCase(updateLeaveEntryDepartment.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deleteEmployee
    builder
      .addCase(deleteLeaveEntryDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLeaveEntryDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveEntryDepartment = state.leaveEntryDepartment.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteLeaveEntryDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to delete Leave Entry Department.";
      });
  },
});

export default LeaveEntryDepartmentSlice.reducer;
