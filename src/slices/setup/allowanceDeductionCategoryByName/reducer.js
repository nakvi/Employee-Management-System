import { createSlice } from "@reduxjs/toolkit";
import { getAllowanceDeductionCategoryByName} from "./thunk";

export const initialState = {
  allowanceDeductionCategoryByName: [],
  loading: false,
  error: null,
};
const AllowanceDeductionCategoryByNameSlice = createSlice({
  name: "allowanceDeductionCategoryByName",
  initialState,
  reducers: {},
   extraReducers: (builder) => {
     builder
       .addCase(getAllowanceDeductionCategoryByName.pending, (state) => {
         state.loading = true;
         state.error = null; // Clear error on new request
       })
       .addCase(getAllowanceDeductionCategoryByName.fulfilled, (state, action) => {
         state.loading = false;
         state.allowanceDeductionCategoryByName = action.payload; // Update data with the fetched payload
       })
       .addCase(getAllowanceDeductionCategoryByName.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message || "Something went wrong"; // Update error state
       });

   },

});

export default AllowanceDeductionCategoryByNameSlice.reducer;