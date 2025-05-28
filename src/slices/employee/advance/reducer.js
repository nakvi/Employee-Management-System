import { createSlice } from "@reduxjs/toolkit";
import { getAdvance,submitAdvance,updateAdvance,deleteAdvance } from "./thunk";

export const initialState = {
  advance: [],
  loading: false,
  error: null,
};
const AdvanceSlice = createSlice({
  name: "advance",
  initialState,
  reducers: {},
   extraReducers: (builder) => {
     builder
       .addCase(getAdvance.pending, (state) => {
         state.loading = true;
         state.error = null; // Clear error on new request
       })
       .addCase(getAdvance.fulfilled, (state, action) => {
         state.loading = false;
         state.advance = action.payload; // Update data with the fetched payload
       })
       .addCase(getAdvance.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message || "Something went wrong"; // Update error state
       });
     // Handle submit Grade
     builder
       .addCase(submitAdvance.pending, (state) => {
         state.loading = true;
       })
       .addCase(submitAdvance.fulfilled, (state, action) => {
         state.loading = false;
         // Add the new designation to the existing array
         state.advance = [...state.advance, action.payload];
       })
       .addCase(submitAdvance.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload; // Set error message
       });
     // Update reducer logic
     builder
       .addCase(updateAdvance.fulfilled, (state, action) => {
         const updatedGroup = action.payload;
         state.advance = state.advance.map((group) =>
           group.VID === updatedGroup.VID ? updatedGroup : group
         );
         state.loading = false;
       })
       .addCase(updateAdvance.rejected, (state, action) => {
         state.loading = false;
         // state.error = action.payload || "Failed to update department group.";
       });
     // Handle deletegrade
     builder
       .addCase(deleteAdvance.pending, (state) => {
         state.loading = true;
       })
       .addCase(deleteAdvance.fulfilled, (state, action) => {
         state.loading = false;
         state.advance = state.advance.filter(
           (group) => group.VID !== action.payload // Compare with VID
         );
       })
       .addCase(deleteAdvance.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload || "Failed to delete department group.";
       });
   },

});

export default AdvanceSlice.reducer;