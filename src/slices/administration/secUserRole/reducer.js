import { createSlice } from "@reduxjs/toolkit";
import { getSecUserRole, submitSecUserRole, updateSecUserRole, deleteSecUserRole } from "./thunk";

export const initialState = {
  secUserRole: [],
  loading: false,
  error: null,
};

const SecUserRoleSlice = createSlice({
  name: "SecUserRoleSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSecUserRole.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getSecUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.secUserRole = action.payload; // Update data with the fetched payload
      })
      .addCase(getSecUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit secUserRole
    builder
      .addCase(submitSecUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitSecUserRole.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new user Role to the existing array
        state.secUserRole = [...state.secUserRole, action.payload];
      })
      .addCase(submitSecUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateSecUserRole.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.secUserRole = state.secUserRole.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateSecUserRole.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update user Role.";
      });
    // Handle delete secUserRole
    builder
      .addCase(deleteSecUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSecUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.secUserRole = state.secUserRole.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteSecUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user Role.";
      });
  },
});

export default SecUserRoleSlice.reducer;