import { createSlice } from "@reduxjs/toolkit";
import { getOTMonthly, submitOTMonthly, updateOTMonthly, deleteOTMonthly } from "./thunk";

export const initialState = {
  otMonthly: [],
  loading: false,
  error: null,
};

const OTMonthlySlice = createSlice({
  name: "OTMonthlySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOTMonthly.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOTMonthly.fulfilled, (state, action) => {
        state.loading = false;
        state.otMonthly = action.payload;
      })
      .addCase(getOTMonthly.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
    builder
      .addCase(submitOTMonthly.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitOTMonthly.fulfilled, (state, action) => {
        state.loading = false;
        state.otMonthly = [...state.otMonthly, action.payload];
      })
      .addCase(submitOTMonthly.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(updateOTMonthly.fulfilled, (state, action) => {
        const updatedOT = action.payload;
        state.otMonthly = state.otMonthly.map(
          (ot) => (ot.VID === updatedOT.VID ? updatedOT : ot)
        );
        state.loading = false;
      })
      .addCase(updateOTMonthly.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update O/T Monthly.";
      });
    builder
      .addCase(deleteOTMonthly.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOTMonthly.fulfilled, (state, action) => {
        state.loading = false;
        state.otMonthly = state.otMonthly.filter(
          (ot) => ot.VID !== action.payload
        );
      })
      .addCase(deleteOTMonthly.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete O/T Monthly.";
      });
  },
});

export default OTMonthlySlice.reducer;