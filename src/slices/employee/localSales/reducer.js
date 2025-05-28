import { createSlice } from "@reduxjs/toolkit";
import { getLocalSale } from "./thunk";

export const initialState = {
  localSale : [],
  loading: false,
  error: null,
};
const LocalSaleSlice = createSlice({
  name: "localSale",
  initialState,
  reducers: {},
   extraReducers: (builder) => {
     builder
       .addCase(getLocalSale.pending, (state) => {
         state.loading = true;
         state.error = null; // Clear error on new request
       })
       .addCase(getLocalSale.fulfilled, (state, action) => {
         state.loading = false;
         state.localSale = action.payload; // Update data with the fetched payload
       })
       .addCase(getLocalSale.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message || "Something went wrong"; // Update error state
       });
   },

});

export default LocalSaleSlice.reducer;