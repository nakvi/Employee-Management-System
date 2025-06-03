import { createSlice } from "@reduxjs/toolkit";
import { getLeave,submitLeave,updateLeave,deleteLeave } from "./thunk";

export const initialState = {
  leaves: [],
  loading: false,
  error: null,
};

const LeaveSlice = createSlice({
  name: "LeaveSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeave.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(getLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    builder
      .addCase(submitLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = [
          ...state.leaves,
          action.payload,
        ];
      })
      .addCase(submitLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateLeave.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.leaves = state.leaves.map(
          (group) => (group.VID === updatedGroup.VID ? updatedGroup : group)
        );
        state.loading = false;
      })
      .addCase(updateLeave.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deleteEmployee
    builder
      .addCase(deleteLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = state.leaves.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteLeave.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to delete Leave .";
      });
  },
});

export default LeaveSlice.reducer;
