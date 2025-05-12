import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct
// Define the API endpoint

// const API_ENDPOINT = "http://192.168.18.65:8001/ems/allowDedGroup/";
const API_ENDPOINT = `${config.api.API_URL}allowDedGroup/`;

// Create the async thunk
export const getAllowanceDeductionGroup = createAsyncThunk(
  "AllowanceDeductionGroup/getAllowanceDeductionGroup",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Allowance Deduction Group data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching Allowance Deduction Group :", error.message);
      // Show error message using toast
      toast.error("Failed to fetch Allowance Deduction Group. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);