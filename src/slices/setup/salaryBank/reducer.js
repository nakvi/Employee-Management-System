import { createSlice } from "@reduxjs/toolkit";
import {
  getSalaryBank,
  submitSalaryBank,
  updateSalaryBank,
  deleteSalaryBank,
} from "./thunk";

export const initialState = {
  salaryBank: [],
  loading: false,
  error: null,
};
const SalaryBankSlice = createSlice({
  name: "SalaryBankSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSalaryBank.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getSalaryBank.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryBank = action.payload; // Update data with the fetched payload
      })
      .addCase(getSalaryBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit Grade
    builder
      .addCase(submitSalaryBank.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitSalaryBank.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.salaryBank = [...state.salaryBank, action.payload];
      })
      .addCase(submitSalaryBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateSalaryBank.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.salaryBank = state.salaryBank.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateSalaryBank.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update salaray Bank.";
      });
    // Handle delete salarayBank
    builder
      .addCase(deleteSalaryBank.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSalaryBank.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryBank = state.salaryBank.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteSalaryBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete salaray Bank.";
      });
  },
});
export default SalaryBankSlice.reducer;
