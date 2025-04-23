import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the API endpoint

const API_ENDPOINT = "http://192.168.18.58:8001/ems/secRolePage/";

// Create the async thunk
export const getPagePermission = createAsyncThunk(
  "pagePermission/getPagePermission",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched paeg permission data:", data);
      return data;
    } catch (error) {
      // Show error message using toast
      toast.error("Failed to fetch page permission. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);
// Update Company
export const updatePagePermission= createAsyncThunk(
  "pagePermission/updatePagePermission",
  async (groupData, { rejectWithValue }) => {
    console.log("Updating page permission:", groupData);
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });
     
      if (!response.ok) {
        throw new Error("Failed to update page permission");
      }
      const responseData = await response.json();
      toast.success("page permission updated successfully!");
      return responseData.data; // Assuming the updated data is in 'data'
    } catch (error) {
      toast.error("Failed to update page permission. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);