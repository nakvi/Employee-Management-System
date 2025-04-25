import { createSlice } from "@reduxjs/toolkit";
import { getSalaryIncrement, submitSalaryIncrement, updateSalaryIncrement, deleteSalaryIncrement } from "./thunk";

export const initialState = {
  salaryIncrement: [],
  loading: false,
  error: null,
};
const SalaryIncrementSlice = createSlice({
  name: "salaryIncrement",
  initialState,
  reducers: {},
   extraReducers: (builder) => {
     builder
       .addCase(getSalaryIncrement.pending, (state) => {
         state.loading = true;
         state.error = null; // Clear error on new request
       })
       .addCase(getSalaryIncrement.fulfilled, (state, action) => {
         state.loading = false;
         state.salaryIncrement = action.payload; // Update data with the fetched payload
       })
       .addCase(getSalaryIncrement.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message || "Something went wrong"; // Update error state
       });
     // Handle submit Grade
     builder
       .addCase(submitSalaryIncrement.pending, (state) => {
         state.loading = true;
       })
       .addCase(submitSalaryIncrement.fulfilled, (state, action) => {
         state.loading = false;
         // Add the new designation to the existing array
         state.salaryIncrement = [...state.salaryIncrement, action.payload];
       })
       .addCase(submitSalaryIncrement.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload; // Set error message
       });
     // Update reducer logic
     builder
       .addCase(updateSalaryIncrement.fulfilled, (state, action) => {
         const updatedGroup = action.payload;
         state.salaryIncrement = state.salaryIncrement.map((group) =>
           group.VID === updatedGroup.VID ? updatedGroup : group
         );
         state.loading = false;
       })
       .addCase(updateSalaryIncrement.rejected, (state, action) => {
         state.loading = false;
         // state.error = action.payload || "Failed to update department group.";
       });
     // Handle deletegrade
     builder
       .addCase(deleteSalaryIncrement.pending, (state) => {
         state.loading = true;
       })
       .addCase(deleteSalaryIncrement.fulfilled, (state, action) => {
         state.loading = false;
         state.salaryIncrement = state.salaryIncrement.filter(
           (group) => group.VID !== action.payload // Compare with VID
         );
       })
       .addCase(deleteSalaryIncrement.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload || "Failed to delete department group.";
       });
   },

});

export default SalaryIncrementSlice.reducer;