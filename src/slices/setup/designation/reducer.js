import { createSlice } from "@reduxjs/toolkit";
import { getDesignation, submitDesignation ,updateDesignation,deleteDesignation} from "./thunk";

// Initial state
export const initialState = {
  designation: [], // Array to store designation data
  loading: false, // Loading state
  error: null, // Error state
};

// Create slice
const DesignationSlice = createSlice({
  name: "Designation",
  initialState,
  reducers: {}, // No additional reducers needed
  extraReducers: (builder) => {
    // Handle getDesignation
    builder
      .addCase(getDesignation.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(getDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.designation = action.payload; // Update designation array with fetched data
      })
      .addCase(getDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong"; // Set error message
      });

    // Handle submit Designation
    builder
      .addCase(submitDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitDesignation.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new designation to the existing array
        state.designation = [...state.designation, action.payload];
        
      })
      .addCase(submitDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
         // Update reducer logic
            builder
            .addCase(updateDesignation.fulfilled, (state, action) => {
              const updatedGroup = action.payload;
              state.designation = state.designation.map((group) =>
                group.VID === updatedGroup.VID ? updatedGroup : group
              );
              state.loading = false;
            })
            .addCase(updateDesignation.rejected, (state, action) => {
              state.loading = false;
              // state.error = action.payload || "Failed to update department group.";
            });
    // Handle deleteDesignation
    builder
        .addCase(deleteDesignation.pending, (state) => {
          state.loading = true;
        })
        .addCase(deleteDesignation.fulfilled, (state, action) => {
          state.loading = false;
          state.designation= state.designation.filter(
            (group) => group.VID !== action.payload // Compare with VID
          );
        })
        .addCase(deleteDesignation.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Failed to delete department group.";
        });
  },
});

// Export the reducer
export default DesignationSlice.reducer;