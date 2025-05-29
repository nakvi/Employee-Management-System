import { createSlice } from "@reduxjs/toolkit";
import { getSalaryAllowanceDeduction,submitSalaryAllowanceDeduction,updateSalaryAllowanceDeduction,deleteSalaryAllowanceDeduction } from "./thunk";

export const initialState = {
  salaryAllowanceDeduction: [],
  loading: false,
  error: null,
};
const SalaryAllowanceDeductionSlice = createSlice({
  name: "salaryAllowanceDeduction",
  initialState,
  reducers: {},
   extraReducers: (builder) => {
     builder
       .addCase(getSalaryAllowanceDeduction.pending, (state) => {
         state.loading = true;
         state.error = null; // Clear error on new request
       })
       .addCase(getSalaryAllowanceDeduction.fulfilled, (state, action) => {
         state.loading = false;
         state.salaryAllowanceDeduction = action.payload; // Update data with the fetched payload
       })
       .addCase(getSalaryAllowanceDeduction.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message || "Something went wrong"; // Update error state
       });
     // Handle submit Grade
     builder
       .addCase(submitSalaryAllowanceDeduction.pending, (state) => {
         state.loading = true;
       })
       .addCase(submitSalaryAllowanceDeduction.fulfilled, (state, action) => {
         state.loading = false;
         // Add the new designation to the existing array
         state.salaryAllowanceDeduction = [...state.salaryAllowanceDeduction, action.payload];
       })
       .addCase(submitSalaryAllowanceDeduction.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload; // Set error message
       });
     // Update reducer logic
     builder
       .addCase(updateSalaryAllowanceDeduction.fulfilled, (state, action) => {
         const updatedGroup = action.payload;
         state.salaryAllowanceDeduction = state.salaryAllowanceDeduction.map((group) =>
           group.VID === updatedGroup.VID ? updatedGroup : group
         );
         state.loading = false;
       })
       .addCase(updateSalaryAllowanceDeduction.rejected, (state, action) => {
         state.loading = false;
         // state.error = action.payload || "Failed to update department group.";
       });
     // Handle deletegrade
     builder
       .addCase(deleteSalaryAllowanceDeduction.pending, (state) => {
         state.loading = true;
       })
       .addCase(deleteSalaryAllowanceDeduction.fulfilled, (state, action) => {
         state.loading = false;
         state.salaryAllowanceDeduction = state.salaryAllowanceDeduction.filter(
           (group) => group.VID !== action.payload // Compare with VID
         );
       })
       .addCase(deleteSalaryAllowanceDeduction.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload || "Failed to delete Salary Allowance Deduction.";
       });
   },

});

export default SalaryAllowanceDeductionSlice.reducer;