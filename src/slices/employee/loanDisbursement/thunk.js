import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the API endpoint

const API_ENDPOINT = "http://192.168.18.57:8001/ems/allowDedCat/";

// Create the async thunk
export const getLoanDisbursement = createAsyncThunk(
  "getLoanDisbursement/getLoanDisbursement",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Allowance Deduction Category data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching Allowance Deduction Category :", error.message);
      // Show error message using toast
      toast.error("Failed to fetch Allowance Deduction Category. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);