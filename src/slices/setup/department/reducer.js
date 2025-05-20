import { createSlice } from "@reduxjs/toolkit";
import {
  getDepartment,
  submitDepartment,
  updateDepartment,
  deleteDepartment,
} from "./thunk";

export const initialState = {
  // department: [],
   department: { data: [] },
  error: null,
  loading: false,
};
const DepartmentSlice = createSlice({
  name: "DepartmentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDepartment.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.department = action.payload; // Update data with the fetched payload
      })
      .addCase(getDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
    // Handle submitDepartmentGroup
    builder
      .addCase(submitDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitDepartment.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state if needed
        state.department.data = [...state.department.data, action.payload];
      })
      .addCase(submitDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Update reducer logic
    builder
      .addCase(updateDepartment.pending, (state) => {
        state.loading = false;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.department.data = state.department.data.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Delete reducer logic
    builder
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.department.data = state.department.data.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete department group.";
      });
  },
});
export default DepartmentSlice.reducer;
