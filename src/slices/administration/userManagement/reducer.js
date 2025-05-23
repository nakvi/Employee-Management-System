import { createSlice } from "@reduxjs/toolkit";
import { getUser, submitUser, updateUser, deleteUser } from "./thunk";

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
    // Fetch Users
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });

    // Submit User
    builder
      .addCase(submitUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload)
          ? [...state.users, ...action.payload]
          : [...state.users, action.payload];
      })
      .addCase(submitUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add user.";
      });

    // Update User
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user.UserID === action.payload.UserID ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user.";
      });

    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.UserID !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user.";
      });
  },
});

export default UserSlice.reducer;