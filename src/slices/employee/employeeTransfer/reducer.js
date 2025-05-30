import { createSlice } from "@reduxjs/toolkit";
import { getEmployeeLocationTransfer,submitEmployeeLocationTransfer,updateEmployeeLocationTransfer,deleteEmployeeLocationTransfer } from "./thunk";

export const initialState = {
  employeeLocationTransfer: [],
  loading: false,
  error: null,
};
const EmployeeLocationTransferSlice = createSlice({
  name: "employeeLocationTransferSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeLocationTransfer.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getEmployeeLocationTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeLocationTransfer = action.payload; // Update data with the fetched payload
      })
      .addCase(getEmployeeLocationTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit Grade
    builder
      .addCase(submitEmployeeLocationTransfer.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitEmployeeLocationTransfer.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.employeeLocationTransfer = [...state.employeeLocationTransfer, action.payload];
      })
      .addCase(submitEmployeeLocationTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateEmployeeLocationTransfer.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.employeeLocationTransfer = state.employeeLocationTransfer.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateEmployeeLocationTransfer.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deleteEmployee
    builder
      .addCase(deleteEmployeeLocationTransfer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployeeLocationTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeLocationTransfer = state.employeeLocationTransfer.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteEmployeeLocationTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete Employee Transfor.";
      });
  },
});
export default EmployeeLocationTransferSlice.reducer;
