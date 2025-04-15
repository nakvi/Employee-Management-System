import { createSlice } from "@reduxjs/toolkit";
import { getLoanDisbursement } from "./thunk";

export const initialState = {
  loanDisbursement: [],
  loading: false,
  error: null,
};

const LoanDisbursementSlice = createSlice({
  name: "LoanDisbursementSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLoanDisbursement.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getLoanDisbursement.fulfilled, (state, action) => {
        state.loading = false;
        state.allowanceDeductionCategory = action.payload;
      })
      .addCase(getLoanDisbursement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
  },
});

export default LoanDisbursementSlice.reducer;
