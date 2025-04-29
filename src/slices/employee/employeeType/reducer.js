import { createSlice } from "@reduxjs/toolkit";
import { getEmployeeType} from "./thunk";

export const initialState = {
  employeeType: [],
  loading: false,
  error: null,
};
const EmployeeTypeSlice = createSlice({
  name: "employeeType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeType.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error on new request
      })
      .addCase(getEmployeeType.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeType = action.payload; // Update data with the fetched payload
      })
      .addCase(getEmployeeType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong"; // Update error state
      });
  },
});
export default EmployeeTypeSlice.reducer;
