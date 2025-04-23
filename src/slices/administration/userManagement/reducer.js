import { createSlice } from "@reduxjs/toolkit";
import { getUser,submitUser,updateUser,deleteUser } from "./thunk";

export const initialState = {
  users: [],
  loading: false,
  error: null,
};
const UserSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Update data with the fetched payload
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit Grade
    builder
      .addCase(submitUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitUser.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.role = [...state.role, action.payload];
      })
      .addCase(submitUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.role = state.role.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deletegrade
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = state.role.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user group.";
      });
  },
});
export default UserSlice.reducer;
