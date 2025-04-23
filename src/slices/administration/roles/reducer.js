import { createSlice } from "@reduxjs/toolkit";
import { getRole,submitRole,updateRole,deleteRole } from "./thunk";

export const initialState = {
  role: [],
  loading: false,
  error: null,
};
const RoleSlice = createSlice({
  name: "RoleSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRole.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getRole.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload; // Update data with the fetched payload
      })
      .addCase(getRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit Grade
    builder
      .addCase(submitRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitRole.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.role = [...state.role, action.payload];
      })
      .addCase(submitRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateRole.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.role = state.role.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deletegrade
    builder
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.role = state.role.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete department group.";
      });
  },
});
export default RoleSlice.reducer;
