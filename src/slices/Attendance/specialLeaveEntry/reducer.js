import { createSlice } from "@reduxjs/toolkit";
import { getSpecialLeaveEntry,submitSpecialLeaveEntry,updateSpecialLeaveEntry,deleteSpecialLeaveEntry } from "./thunk";

export const initialState = {
  specialLeaveEntry: [],
  loading: false,
  error: null,
};

const SpecialLeaveEntrySlice = createSlice({
  name: "SpecialLeaveEntrySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSpecialLeaveEntry.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getSpecialLeaveEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.specialLeaveEntry = action.payload;
      })
      .addCase(getSpecialLeaveEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    builder
      .addCase(submitSpecialLeaveEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitSpecialLeaveEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.specialLeaveEntry = [
          ...state.specialLeaveEntry,
          action.payload,
        ];
      })
      .addCase(submitSpecialLeaveEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateSpecialLeaveEntry.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.specialLeaveEntry = state.specialLeaveEntry.map(
          (group) => (group.VID === updatedGroup.VID ? updatedGroup : group)
        );
        state.loading = false;
      })
      .addCase(updateSpecialLeaveEntry.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deleteEmployee
    builder
      .addCase(deleteSpecialLeaveEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSpecialLeaveEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.specialLeaveEntry = state.specialLeaveEntry.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteSpecialLeaveEntry.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to delete Special Leave Entry.";
      });
  },
});

export default SpecialLeaveEntrySlice.reducer;
