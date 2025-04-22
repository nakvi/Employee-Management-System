import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the API endpoint

const API_ENDPOINT = "http://192.168.18.58:8001/ems/company/";

// Create the async thunk
export const getCompany = createAsyncThunk(
  "company/getCompany",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Company data:", data);
      return data;
    } catch (error) {
      // Show error message using toast
      toast.error("Failed to fetch company. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);
// Update Company
export const updateCompany= createAsyncThunk(
  "Company/updateCompany",
  async (groupData, { rejectWithValue }) => {
    console.log("Updating Company:", groupData);
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });
     
      if (!response.ok) {
        throw new Error("Failed to update Holiday");
      }
      const responseData = await response.json();
      toast.success("Company updated successfully!");
      return responseData.data; // Assuming the updated data is in 'data'
    } catch (error) {
      toast.error("Failed to update Company. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);