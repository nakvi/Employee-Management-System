import { createSlice } from "@reduxjs/toolkit";
import { getRoleRight,submitRoleRight,updateRoleRight,deleteRoleRight } from "./thunk";

export const initialState = {
  roleRight: [],
  loading: false,
  error: null,
};
const RoleRightSlice = createSlice({
  name: "RoleRightSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoleRight.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getRoleRight.fulfilled, (state, action) => {
        state.loading = false;
        state.roleRight = action.payload; // Update data with the fetched payload
      })
      .addCase(getRoleRight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit Grade
    builder
      .addCase(submitRoleRight.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitRoleRight.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.roleRight = [...state.roleRight, action.payload];
      })
      .addCase(submitRoleRight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateRoleRight.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.roleRight = state.roleRight.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateRoleRight.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deletegrade
    builder
      .addCase(deleteRoleRight.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRoleRight.fulfilled, (state, action) => {
        state.loading = false;
        state.roleRight = state.roleRight.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteRoleRight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete department group.";
      });
  },
});
export default RoleRightSlice.reducer;
