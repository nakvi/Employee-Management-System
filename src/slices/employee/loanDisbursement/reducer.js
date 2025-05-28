import { createSlice } from "@reduxjs/toolkit";
import { getLoanDisbursement,submitLoanDisbursement,updateLoanDisbursement,deleteLoanDisbursement } from "./thunk";

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
        state.loanDisbursement = action.payload;
      })
      .addCase(getLoanDisbursement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    builder
      .addCase(submitLoanDisbursement.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitLoanDisbursement.fulfilled, (state, action) => {
        state.loading = false;
        state.loanDisbursement = [
          ...state.loanDisbursement,
          action.payload,
        ];
      })
      .addCase(submitLoanDisbursement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateLoanDisbursement.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.loanDisbursement = state.loanDisbursement.map(
          (group) => (group.VID === updatedGroup.VID ? updatedGroup : group)
        );
        state.loading = false;
      })
      .addCase(updateLoanDisbursement.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deleteEmployee
    builder
      .addCase(deleteLoanDisbursement.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLoanDisbursement.fulfilled, (state, action) => {
        state.loading = false;
        state.loanDisbursement = state.loanDisbursement.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteLoanDisbursement.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to delete Employee Location Transfer.";
      });
  },
});

export default LoanDisbursementSlice.reducer;
