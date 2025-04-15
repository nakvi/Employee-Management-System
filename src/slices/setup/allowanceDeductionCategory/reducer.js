import { createSlice } from "@reduxjs/toolkit";
import { getAllowanceDeductionCategory } from "./thunk";

export const initialState = {
  allowanceDeductionCategory: [],
  loading: false,
  error: null,
};

const AllowanceDeductionCategorySlice = createSlice({
  name: "AllowanceDeductionCategorySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllowanceDeductionCategory.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getAllowanceDeductionCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.allowanceDeductionCategory = action.payload;
      })
      .addCase(getAllowanceDeductionCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
  },
});

export default AllowanceDeductionCategorySlice.reducer;
