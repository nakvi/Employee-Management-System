import { createSlice } from "@reduxjs/toolkit";
import { getHoliday,submitHoliday,updateHoliday,deleteHoliday } from "./thunk";

export const initialState = {
  holiday: [],
  loading: false,
  error: null,
};
const HolidaySlice = createSlice({
  name: "HolidaySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHoliday.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holiday = action.payload; // Update data with the fetched payload
      })
      .addCase(getHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit submitAttendanceCode
    builder
      .addCase(submitHoliday.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitHoliday.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.holiday = [...state.holiday, action.payload];
      })
      .addCase(submitHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateHoliday.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.holiday = state.holiday.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateHoliday.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update location.";
      });
    // Handle delete location
    builder
      .addCase(deleteHoliday.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holiday = state.holiday.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete location.";
      });
  },
});
export default HolidaySlice.reducer;
