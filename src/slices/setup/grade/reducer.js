import { createSlice } from "@reduxjs/toolkit";
import { getGrade, submitGrade, updateGrade, deleteGrade } from "./thunk";

export const initialState = {
  grade: [],
  loading: false,
  error: null,
};
const GradeSlice = createSlice({
  name: "GradeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGrade.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grade = action.payload; // Update data with the fetched payload
      })
      .addCase(getGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
    // Handle submit Grade
    builder
      .addCase(submitGrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitGrade.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.grade = [...state.grade, action.payload];
      })
      .addCase(submitGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
    // Update reducer logic
    builder
      .addCase(updateGrade.fulfilled, (state, action) => {
        const updatedGroup = action.payload;
        state.grade = state.grade.map((group) =>
          group.VID === updatedGroup.VID ? updatedGroup : group
        );
        state.loading = false;
      })
      .addCase(updateGrade.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || "Failed to update department group.";
      });
    // Handle deletegrade
    builder
      .addCase(deleteGrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grade = state.grade.filter(
          (group) => group.VID !== action.payload // Compare with VID
        );
      })
      .addCase(deleteGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete department group.";
      });
  },
});
export default GradeSlice.reducer;
