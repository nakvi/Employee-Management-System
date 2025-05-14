import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";

const API_ENDPOINT = `${config.api.API_URL}attEntry/`;

export const getAttendanceEntry = createAsyncThunk(
  "attendanceEntry/getAttendanceEntry",
  async (params, { rejectWithValue }) => {
    try {
      // Construct the query string from params
      const queryParams = new URLSearchParams({
        orgini: params.orgini || "LTT",
        vdate: params.vdate || "",
        datefrom: params.datefrom || "",
        dateto: params.dateto || "",
        deptids: params.deptids || "",
        employeeidlist: params.employeeidlist || "",
        companyid: params.companyid || "0",
        locationid: params.locationid || "0",
        etypeid: params.etypeid || "0",
        empid: params.empid || "0",
        isau: params.isau || "0",
        onlyot: params.onlyot || "0",
        isexport: params.isexport || "0",
        uid: params.uid || "0",
        inflage: params.inflage || "0",
      }).toString();

      console.log("Fetching from:", `${API_ENDPOINT}?${queryParams}`); // Debug URL
      const response = await fetch(`${API_ENDPOINT}?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response Data:", data); // Debug response

      if (data.status === "0") {
        // Success: Return the data
        return data.data || [];
      } else if (data.status === "1") {
        // Error: Show an error message on toast
        toast.error("An error occurred while fetching attendance data.");
        return rejectWithValue("An error occurred while fetching attendance data.");
      } else if (data.status === "2") {
        // Warning: Show a warning message on toast
        toast.warn("Warning: Data may not be complete.");
        return rejectWithValue("Warning: Data may not be complete.");
      } else {
        // Unknown status
        toast.error("Unknown response status from server.");
        return rejectWithValue("Unknown response status from server.");
      }
    } catch (error) {
      console.error("API Error:", error); // Debug error
      toast.error("Failed to fetch attendance data. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);