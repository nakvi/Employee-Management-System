import { createSlice } from "@reduxjs/toolkit";
import { getAllowanceDeductionDetails } from "./thunk";

export const initialState = {
  allowanceDeductionDetails: [],
  loading: false,
  error: null,
};
const AllowanceDeductionDetailsSlice = createSlice({
  name: "allowanceDeductionDetails",
  initialState,
  reducers: {},
   extraReducers: (builder) => {
     builder
       .addCase(getAllowanceDeductionDetails.pending, (state) => {
         state.loading = true;
         state.error = null; // Clear error on new request
       })
       .addCase(getAllowanceDeductionDetails.fulfilled, (state, action) => {
         state.loading = false;
         state.allowanceDeductionDetails = action.payload; // Update data with the fetched payload
       })
       .addCase(getAllowanceDeductionDetails.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message || "Something went wrong"; // Update error state
       });

   },

});

export default AllowanceDeductionDetailsSlice.reducer;