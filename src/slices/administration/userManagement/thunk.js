import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct
// const API_ENDPOINT = "http://192.168.18.65:8001/ems/secUser/";
// Define the API endpoint
const API_ENDPOINT = `${config.api.API_URL}secUser/`;

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status === "0") {
        console.log("Fetched users:", data.data);
        return data.data;
      } else if (data.status === "1") {
        toast.error("An error occurred while fetching data.");
        return rejectWithValue("An error occurred while fetching data.");
      } else if (data.status === "2") {
        toast.warn("Warning: Data may not be complete.");
        return rejectWithValue("Warning: Data may not be complete.");
      }
    } catch (error) {
      toast.error("Failed to fetch user. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

export const submitUser = createAsyncThunk(
  "user/submitUser",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("Submitting user payload:", payload);
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
      console.log("API response:", data);

      if (data.status === "0") {
        toast.success(data.message || "User added successfully!");
        return data.data; // Return the newly created user
      } else {
        throw new Error(data.message || "Failed to add user.");
      }
    } catch (error) {
      toast.error(`Failed to add user: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "0") {
        toast.success(data.message || "User updated successfully!");
        return data.data;
      } else {
        throw new Error(data.message || "Failed to update user.");
      }
    } catch (error) {
      toast.error(`Failed to update user: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserID: id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "0") {
        toast.success(data.message || "User deleted successfully!");
        return id;
      } else {
        throw new Error(data.message || "Failed to delete user.");
      }
    } catch (error) {
      toast.error(`Failed to delete user: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);