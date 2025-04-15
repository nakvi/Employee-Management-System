import { createSlice } from "@reduxjs/toolkit";
import {
  getRamazan,
  submitRamazan,
  updateRamazan,
  deleteRamazan,
} from "./thunk";

export const initialState = {
  ramazan: [],
  loading: false,
  error: null,
};
const RamazanSlice = createSlice({
  name: "RamazanSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRamazan.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getRamazan.fulfilled, (state, action) => {
        state.loading = false;
        state.ramazan = action.payload; // Update data with the fetched payload
      })
      .addCase(getRamazan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit Grade
    builder
      .addCase(submitRamazan.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitRamazan.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.ramazan = [...state.ramazan, action.payload];
      })
      .addCase(submitRamazan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateRamazan.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.ramazan = state.ramazan.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateRamazan.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update salaray Bank.";
      });
    // Handle delete ramazan
    builder
      .addCase(deleteRamazan.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRamazan.fulfilled, (state, action) => {
        state.loading = false;
        state.ramazan = state.ramazan.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteRamazan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete salaray Bank.";
      });
  },
});
export default RamazanSlice.reducer;
