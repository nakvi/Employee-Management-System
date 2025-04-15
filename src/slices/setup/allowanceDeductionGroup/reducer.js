import { createSlice } from "@reduxjs/toolkit";
import { getAllowanceDeductionGroup } from "./thunk";

export const initialState = {
  allowanceDeductionGroup: [],
  loading: false,
  error: null,
};

const AllowanceDeductionGroupSlice = createSlice({
  name: "AllowanceDeductionGroupSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllowanceDeductionGroup.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getAllowanceDeductionGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.allowanceDeductionGroup = action.payload;
      })
      .addCase(getAllowanceDeductionGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
  },
});

export default AllowanceDeductionGroupSlice.reducer;
