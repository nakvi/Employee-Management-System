import { createSlice } from "@reduxjs/toolkit";
import { getOTDaily, submitOTDaily, updateOTDaily, deleteOTDaily } from "./thunk";

export const initialState = {
  otDaily: [],
  loading: false,
  error: null,
};

const OTDailySlice = createSlice({
  name: "OTDailySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOTDaily.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOTDaily.fulfilled, (state, action) => {
        state.loading = false;
        state.otDaily = action.payload;
      })
      .addCase(getOTDaily.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(submitOTDaily.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitOTDaily.fulfilled, (state, action) => {
        state.loading = false;
        state.otDaily = [...state.otDaily, action.payload];
        console.log("Reducer: Added to otDaily:", action.payload);
      })
      .addCase(submitOTDaily.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit O/T Daily.";
      })
      .addCase(updateOTDaily.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOTDaily.fulfilled, (state, action) => {
        const updatedOT = action.payload;
        state.otDaily = state.otDaily.map(
          (ot) => (ot.VID === updatedOT.VID ? updatedOT : ot)
        );
        state.loading = false;
      })
      .addCase(updateOTDaily.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update O/T Daily.";
      })
      .addCase(deleteOTDaily.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOTDaily.fulfilled, (state, action) => {
        state.loading = false;
        state.otDaily = state.otDaily.filter(
          (ot) => ot.VID !== action.payload
        );
      })
      .addCase(deleteOTDaily.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete O/T Daily.";
      });
  },
});

export default OTDailySlice.reducer;