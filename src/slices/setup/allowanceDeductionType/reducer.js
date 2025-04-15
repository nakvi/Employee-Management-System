import { createSlice } from "@reduxjs/toolkit";
import {
  getAllowanceDeductionType,
  submitAllowanceDeductionType,
  updateAllowanceDeductionType,
  deleteAllowanceDeductionType,
} from "./thunk";

export const initialState = {
  allowanceDeductionType: [],
  loading: false,
  error: null,
};
const AllowanceDeductionTypeSlice = createSlice({
  name: "AllowanceDeductionTypeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllowanceDeductionType.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getAllowanceDeductionType.fulfilled, (state, action) => {
        state.loading = false;
        state.allowanceDeductionType = action.payload; // Update data with the fetched payload
      })
      .addCase(getAllowanceDeductionType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit allowanceDeductionType
    builder
      .addCase(submitAllowanceDeductionType.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitAllowanceDeductionType.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.allowanceDeductionType = [...state.allowanceDeductionType, action.payload];
      })
      .addCase(submitAllowanceDeductionType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateAllowanceDeductionType.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.allowanceDeductionType = state.allowanceDeductionType.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateAllowanceDeductionType.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update location.";
      });
    // Handle delete location
    builder
      .addCase(deleteAllowanceDeductionType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllowanceDeductionType.fulfilled, (state, action) => {
        state.loading = false;
        state.allowanceDeductionType = state.allowanceDeductionType.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteAllowanceDeductionType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete AllowanceDeduction Type.";
      });
  },
});
export default AllowanceDeductionTypeSlice.reducer;
