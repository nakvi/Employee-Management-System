import { createSlice } from "@reduxjs/toolkit";
import { getSecUserCompany, submitSecUserCompany, updateSecUserCompany, deleteSecUserCompany } from "./thunk";

export const initialState = {
  secUserCompany: [],
  loading: false,
  error: null,
};

const SecUserCompanySlice = createSlice({
  name: "SecUserCompanySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSecUserCompany.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getSecUserCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.secUserCompany = action.payload; // Update data with the fetched payload
      })
      .addCase(getSecUserCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit secUserCompany
    builder
      .addCase(submitSecUserCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitSecUserCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new user company to the existing array
        state.secUserCompany = [...state.secUserCompany, action.payload];
      })
      .addCase(submitSecUserCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateSecUserCompany.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.secUserCompany = state.secUserCompany.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateSecUserCompany.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update user company.";
      });
    // Handle delete secUserCompany
    builder
      .addCase(deleteSecUserCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSecUserCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.secUserCompany = state.secUserCompany.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteSecUserCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user company.";
      });
  },
});

export default SecUserCompanySlice.reducer;