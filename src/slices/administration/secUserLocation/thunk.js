import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct

// Define a custom async thunk to fetch data from an API
// const API_ENDPOINT = "http://192.168.18.65:8001/ems/secUserLocation/";
const API_ENDPOINT = `${config.api.API_URL}secUserLocation/`;

export const getSecUserLocation = createAsyncThunk(
  "secUserLocation/getSecUserLocation",
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
      toast.error("Failed to fetch user location data. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Submit SecUserLocation
export const submitSecUserLocation = createAsyncThunk(
  "secUserLocation/submitSecUserLocation",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   ...payload,
        //   LocationID: Array.isArray(payload.LocationID) ? payload.LocationID : [payload.LocationID]
        // }),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message || "User location added successfully!");
      return data.data;
    } catch (error) {
      toast.error("Failed to add user location. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Update SecUserLocation
export const updateSecUserLocation = createAsyncThunk(
  "secUserLocation/updateSecUserLocation",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...groupData,
          LocationID: Array.isArray(groupData.LocationID) ? groupData.LocationID : [groupData.LocationID]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user location");
      }
      const responseData = await response.json();
      toast.success("User location updated successfully!");
      return responseData.data;
    } catch (error) {
      toast.error("Failed to update user location. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Delete SecUserLocation
export const deleteSecUserLocation = createAsyncThunk(
  "secUserLocation/deleteSecUserLocation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ VID: id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status === "0") {
        toast.success("User location deleted successfully!");
        return id;
      } else {
        throw new Error(responseData.message || "Failed to delete data.");
      }
    } catch (error) {
      toast.error("Failed to delete user location. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);