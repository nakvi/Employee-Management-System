import { createSlice } from "@reduxjs/toolkit";
import { getHolidayType } from "./thunk";

export const initialState = {
  holidayType: [],
  loading: false,
  error: null,
};

const HolidayTypeSlice = createSlice({
  name: "HolidayTypeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHolidayType.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getHolidayType.fulfilled, (state, action) => {
        state.loading = false;
        state.holidayType = action.payload;
      })
      .addCase(getHolidayType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
  },
});

export default HolidayTypeSlice.reducer;
