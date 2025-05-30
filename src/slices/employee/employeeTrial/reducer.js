import { createSlice } from "@reduxjs/toolkit";
import { getEmployeeTrial,submitEmployeeTrial,updateEmployeeTrial,deleteEmployeeTrial } from "./thunk";

export const initialState = {
  employeeTrial: [],
  loading: false,
  error: null,
};
const EmployeeTrialSlice = createSlice({
  name: "employeeTrialSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeTrial.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getEmployeeTrial.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeTrial = action.payload; // Update data with the fetched payload
      })
      .addCase(getEmployeeTrial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit Trial
    builder
      .addCase(submitEmployeeTrial.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitEmployeeTrial.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.employeeTrial = [...state.employeeTrial, action.payload];
      })
      .addCase(submitEmployeeTrial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateEmployeeTrial.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.employeeTrial = state.employeeTrial.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateEmployeeTrial.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deleteEmployee Trial
    builder
      .addCase(deleteEmployeeTrial.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployeeTrial.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeTrial = state.employeeTrial.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteEmployeeTrial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete Employee Trail.";
      });
  },
});
export default EmployeeTrialSlice.reducer;
