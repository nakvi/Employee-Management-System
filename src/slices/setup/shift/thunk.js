import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct

// Define a custom async thunk to fetch data from an API
// const API_ENDPOINT = "http://192.168.18.65:8001/ems/shift/";
const API_ENDPOINT = `${config.api.API_URL}shift/`;

export const getShift= createAsyncThunk(
  "Shift/getShift",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "0") {
        // Success: Return the data
        return data.data;
      } else if (data.status === "1") {
        // Error: Show an error message on toast
        toast.error("An error occurred while fetching data.");
        return rejectWithValue("An error occurred while fetching data.");
      } else if (data.status === "2") {
        // Warning: Show a warning message on toast
        toast.warn("Warning: Data may not be complete.");
        return rejectWithValue("Warning: Data may not be complete.");
      }
    } catch (error) {
      toast.error("Failed to fetch grade. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);
// Submit Shift
export const submitShift = createAsyncThunk(
  "Shift/submitShift",
  async (payload, { rejectWithValue }) => {
    console.log(payload);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message || "Shift added successfully!");
      return data.data; // Return the newly created Designation
    } catch (error) {
      toast.error("Failed to add Shift  Please try again!");
      return rejectWithValue(error.message);
    }
  }
);
// Update Leave Shift
export const updateShift= createAsyncThunk(
  "Shift/updateShift",
  async (groupData, { rejectWithValue }) => {
    console.log("d",groupData);
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });
     
      if (!response.ok) {
        throw new Error("Failed to update Shift");
      }
      const responseData = await response.json();
      toast.success("Shift updated successfully!");
      return responseData.data || responseData;
      // return responseData.data; // Assuming the updated data is in 'data'
    } catch (error) {
      toast.error("Failed to update Shift. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);
// Delete Shift
export const deleteShift = createAsyncThunk(
  "Shift/deleteShift",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ VID: id }), // Ensure 'VID' matches the key expected by your API
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status) {
        toast.success("Shift deleted successfully!");
        return id; // Return the deleted ID to update the state
      } else {
        throw new Error(responseData.message || "Failed to delete data.");
      }
    } catch (error) {
      toast.error("Failed to delete Shift. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);