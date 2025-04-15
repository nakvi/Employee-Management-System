import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the API endpoint

const API_ENDPOINT = "http://192.168.18.57:8001/ems/attGroup/";

// Create the async thunk
export const getAttendanceGroup = createAsyncThunk(
  "getAttendanceGroup/getAttendanceGroup",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Attendace Group data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching Attendance Group :", error.message);
      // Show error message using toast
      toast.error("Failed to fetch Attendance Group. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);