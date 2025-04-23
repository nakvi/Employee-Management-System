import { createSlice } from "@reduxjs/toolkit";
import { getPagePermission, updatePagePermission } from "./thunk";

export const initialState = {
  pagePermission: [],
  loading: false,
  error: null,
};

const PagePermissionSlice = createSlice({
  name: "PagePermissionSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPagePermission.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getPagePermission.fulfilled, (state, action) => {
        state.loading = false;
        state.pagePermission = action.payload;
      })
      .addCase(getPagePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Update reducer logic
    builder
      .addCase(updatePagePermission.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.pagePermission = { ...state.pagePermission, ...action.payload }; // Update correctly

        state.loading = false;
      })
      .addCase(updatePagePermission.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update location.";
      });
  },
});

export default PagePermissionSlice.reducer;
