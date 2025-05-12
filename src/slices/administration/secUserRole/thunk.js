import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct

// Define a custom async thunk to fetch data from an API
// const API_ENDPOINT = "http://192.168.18.65:8001/ems/secUserRole/";
const API_ENDPOINT = `${config.api.API_URL}secUserRole/`;

export const getSecUserRole = createAsyncThunk(
  "secUserRole/getSecUserRole",
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
      toast.error("Failed to fetch user Role data. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Submit SecUserRole
export const submitSecUserRole = createAsyncThunk(
  "secUserRole/submitSecUserRole",
  async (payload, { rejectWithValue }) => {
    console.log("Submitting user Role payload:", payload);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   ...payload,
        //   RoleID: Array.isArray(payload.RoleID) ? payload.RoleID : [payload.RoleID]
        // }),
        body: JSON.stringify(payload),

      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message || "User Role added successfully!");
      return data.data;
    } catch (error) {
      toast.error("Failed to add user Role. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Update SecUserRole
export const updateSecUserRole = createAsyncThunk(
  "secUserRole/updateSecUserRole",
  async (groupData, { rejectWithValue }) => {
    console.log("Updating user Role payload:", groupData);
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...groupData,
          RoleID: Array.isArray(groupData.RoleID) ? groupData.RoleID : [groupData.RoleID]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user Role");
      }
      const responseData = await response.json();
      toast.success("User Role updated successfully!");
      return responseData.data;
    } catch (error) {
      toast.error("Failed to update user Role. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Delete SecUserRole
export const deleteSecUserRole = createAsyncThunk(
  "secUserRole/deleteSecUserRole",
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
        toast.success("User Role deleted successfully!");
        return id;
      } else {
        throw new Error(responseData.message || "Failed to delete data.");
      }
    } catch (error) {
      toast.error("Failed to delete user Role. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);