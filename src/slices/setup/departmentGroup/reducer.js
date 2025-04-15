import { createSlice } from "@reduxjs/toolkit";
import { getDepartmentGroup, submitDepartmentGroup,updateDepartmentGroup ,deleteDepartmentGroup} from "./thunk";

export const initialState = {
  departmentGroup: [],
  error: null,
  loading: false,
};

const DepartmentGroupSlice = createSlice({
  name: "DepartmentGroupSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDepartmentGroup.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getDepartmentGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentGroup = action.payload; // Update data with the fetched payload
      })
      .addCase(getDepartmentGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });

    // Handle submitDepartmentGroup
    builder
      .addCase(submitDepartmentGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitDepartmentGroup.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state if needed
        state.departmentGroup.data = [...state.departmentGroup.data, action.payload];

      })
      .addCase(submitDepartmentGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      // Update reducer logic
      builder
      .addCase(updateDepartmentGroup.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.departmentGroup.data = state.departmentGroup.data.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateDepartmentGroup.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    
      // Delete reducer logic
    builder
    .addCase(deleteDepartmentGroup.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteDepartmentGroup.fulfilled, (state, action) => {
      state.loading = false;
      state.departmentGroup.data = state.departmentGroup.data.filter(
        (group) => group.VID !== action.payload // Compare with VID
      );
    })
    .addCase(deleteDepartmentGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete department group.";
    });
  },
});

export default DepartmentGroupSlice.reducer;
