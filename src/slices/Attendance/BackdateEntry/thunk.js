import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the API endpoint
const API_ENDPOINT = "https://192.168.18.65:8001/ems/backdateEntry/";

// Fetch Backdate Entry data
export const getBackdateEntry = createAsyncThunk(
  "backdateEntry/getBackdateEntry",
  async (filters, { rejectWithValue }) => {
    try {
      console.log("Step 3 - Received filters in getBackdateEntry:", filters);

      if (!filters.employeeIdList) {
        console.warn("Step 4 - employeeIdList is missing or empty in filters");
      } else {
        console.log("Step 4 - employeeIdList in filters:", filters.employeeIdList);
      }

      const formData = new FormData();
      formData.append("eType", filters.eType || "");
      formData.append("dateFrom", filters.dateFrom || "");
      formData.append("dateTo", filters.dateTo || "");
      formData.append("employeeIdList", filters.employeeIdList || "");

      console.log("Step 5 - FormData Contents Before Sending to", API_ENDPOINT);
      for (let pair of formData.entries()) {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching Backdate Entry:", error.message);
      toast.error(`Failed to fetch Backdate Entry: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Submit Backdate Entry data
export const submitBackdateEntry = createAsyncThunk(
  "backdateEntry/submitBackdateEntry",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          const message = errorData.error || data.message || "Validation failed!";
          toast.error(message);
          return rejectWithValue(message);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "0") {
        toast.success(data.message || "Backdate Entry added successfully!");
        return data.data;
      } else if (data.status === "1") {
        const errorMessage = data.error || data.message || "An error occurred!";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else if (data.status === "2") {
        const warningMessage = data.error || data.message || "Warning: Please check your input!";
        toast.warning(warningMessage);
        return rejectWithValue(warningMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      toast.error("Failed to add Backdate Entry. Please try again!\n" + errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);