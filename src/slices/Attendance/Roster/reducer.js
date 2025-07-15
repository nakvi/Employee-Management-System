import { createSlice } from "@reduxjs/toolkit";
import {
  getRoster,
  submitRoster,
  getRosterDepartments,
  getRosterShift,
} from "./thunk";

const initialState = {
  roster: [],
  rosterDepartments: [],
  rosterShifts: [],
  loading: false,
  error: null,
};

const rosterSlice = createSlice({
  name: "roster",
  initialState,
  reducers: {
    resetRosterState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Roster
      .addCase(getRoster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoster.fulfilled, (state, action) => {
        state.loading = false;
        state.roster = action.payload;
        console.log("Roster data stored:", action.payload);
      })
      .addCase(getRoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch roster data";
        console.error("Get Roster error:", action.payload);
      })
      // Submit Roster
      .addCase(submitRoster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitRoster.fulfilled, (state, action) => {
        state.loading = false;
        state.roster = action.payload;
        console.log("Roster submitted:", action.payload);
      })
      .addCase(submitRoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit roster data";
        console.error("Submit Roster error:", action.payload);
      })
      // Get Roster Departments
      .addCase(getRosterDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRosterDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.rosterDepartments = action.payload;
        console.log("Departments stored:", action.payload);
      })
      .addCase(getRosterDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch department data";
        console.error("Get Departments error:", action.payload);
      })
      // Get Roster Shifts
      .addCase(getRosterShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRosterShift.fulfilled, (state, action) => {
        state.loading = false;
        state.rosterShifts = action.payload;
        console.log("Shifts stored:", action.payload);
      })
      .addCase(getRosterShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch shift data";
        console.error("Get Shifts error:", action.payload);
      });
  },
});

export const { resetRosterState } = rosterSlice.actions;
export default rosterSlice.reducer;