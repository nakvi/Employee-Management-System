import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the API endpoint directly
const API_ENDPOINT = "https://192.168.18.65:8001/ems/roster/";

// Fetch Roster data
export const getRoster = createAsyncThunk(
  "roster/getRoster",
  async (filters, { rejectWithValue }) => {
    try {
      console.log("Step 3 - Received filters in getRoster:", filters);

      // Ensure employeeIdList is present
      if (!filters.employeeIdList) {
        console.warn("Step 4 - employeeIdList is missing or empty in filters");
      } else {
        console.log("Step 4 - employeeIdList in filters:", filters.employeeIdList);
      }

      const formData = new FormData();
      formData.append("eType", filters.eType || "");
      formData.append("department", filters.department || "");
      formData.append("month", filters.month || "");
      formData.append("dateFrom", filters.dateFrom || "");
      formData.append("dateTo", filters.dateTo || "");
      formData.append("employeeIdList", filters.employeeIdList || "");

      // Debug log to verify FormData contents
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
      console.error("Error fetching Roster:", error.message);
      toast.error(`Failed to fetch Roster: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Submit Roster data
export const submitRoster = createAsyncThunk(
  "roster/submitRoster",
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
          const message = errorData.error || errorData.message || "Validation failed!";
          toast.error(message);
          return rejectWithValue(message);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "0") {
        toast.success(data.message || "Roster added successfully!");
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
      toast.error("Failed to add Roster. Please try again!\n" + errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);