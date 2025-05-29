import { createSlice } from "@reduxjs/toolkit";
import { getGratuity,submitGratuity,updateGratuity,deleteGratuity } from "./thunk";

export const initialState = {
  gratuity: [],
  loading: false,
  error: null,
};

const GratuitySlice = createSlice({
  name: "gratuitySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGratuity.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getGratuity.fulfilled, (state, action) => {
        state.loading = false;
        state.gratuity = action.payload;
      })
      .addCase(getGratuity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    builder
      .addCase(submitGratuity.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitGratuity.fulfilled, (state, action) => {
        state.loading = false;
        state.gratuity = [
          ...state.gratuity,
          action.payload,
        ];
      })
      .addCase(submitGratuity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateGratuity.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.gratuity = state.gratuity.map(
          (group) => (group.VID === updatedGroup.VID ? updatedGroup : group)
        );
        state.loading = false;
      })
      .addCase(updateGratuity.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deleteEmployee
    builder
      .addCase(deleteGratuity.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGratuity.fulfilled, (state, action) => {
        state.loading = false;
        state.gratuity = state.gratuity.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteGratuity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to delete Loan Disbursement.";
      });
  },
});

export default GratuitySlice.reducer;
