import { createSlice } from "@reduxjs/toolkit";
import { getEmployee, submitEmployee, updateEmployee, deleteEmployee } from "./thunk";

export const initialState = {
  employee: [],
  loading: false,
  error: null,
};
const EmployeeSlice = createSlice({
  name: "EmployeeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployee.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload; // Update data with the fetched payload
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit Grade
    builder
      .addCase(submitEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitEmployee.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.employee = [...state.employee, action.payload];
      })
      .addCase(submitEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.employee = state.employee.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deleteEmployee
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = state.employee.filter(
          (group) => group.EmpID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete Employee.";
      });
  },
});
export default EmployeeSlice.reducer;
