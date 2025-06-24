import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct

// Define the API endpoint
const API_ENDPOINT = `${config.api.API_URL}attLeaveSpecial/`;

// Create the async thunk
export const getSpecialLeaveEntry = createAsyncThunk(
  "specialLeaveEntry/getSpecialLeaveEntry",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching Special LeaveEntry :", error.message);
      // Show error message using toast
      toast.error("Failed to fetch Special LeaveEntry. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);
// Submit Special LeaveEntry
export const submitSpecialLeaveEntry = createAsyncThunk(
  "specialLeaveEntry/submitSpecialLeaveEntry",
  async (payload, { rejectWithValue }) => {
    console.log("data", payload);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle 400 validation error specifically
        if (response.status === 400) {
          const errorData = await response.json();
          const message =
            typeof errorData.error === "object"
              ? JSON.stringify(errorData.error)
              : errorData.error || errorData.message || "Validation failed!";
          toast.error(message);
          return rejectWithValue(message);
        }

        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Handle API response based on status field
      if (data.status === "0") {
        toast.success(
          typeof data.message === "object"
            ? JSON.stringify(data.message)
            : data.message || "Special LeaveEntry added successfully!"
        );
        return data.data;
      } else if (data.status === "1") {
        const errorMessage =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || data.message || "An error occurred!";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else if (data.status === "2") {
        const warningMessage =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || data.message || "Warning: Please check your input!";
        toast.warning(warningMessage);
        return rejectWithValue(warningMessage);
      }
    } catch (error) {
      const errorMessage =
        typeof error.message === "object"
          ? JSON.stringify(error.message)
          : error.message || "Unknown error occurred";
      toast.error(
        "Failed to add Special LeaveEntry. Please try again!\n" + errorMessage
      );
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Special LeaveEntry
export const updateSpecialLeaveEntry = createAsyncThunk(
  "specialLeaveEntry/updateSpecialLeaveEntry",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        // Handle 400 validation error specifically
        if (response.status === 400) {
          const errorData = await response.json();
          const message =
            typeof errorData.error === "object"
              ? JSON.stringify(errorData.error)
              : errorData.error || errorData.message || "Validation failed!";
          toast.error(message);
          return rejectWithValue(message);
        }

        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "0") {
        toast.success(
          typeof data.message === "object"
            ? JSON.stringify(data.message)
            : data.message || "Special LeaveEntry updated successfully!"
        );
        return data.data;
      } else if (data.status === "1") {
        const errorMessage =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || data.message || "An error occurred!";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else if (data.status === "2") {
        const warningMessage =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || data.message || "Warning: Please check your input!";
        toast.warning(warningMessage);
        return rejectWithValue(warningMessage);
      }
    } catch (error) {
      const errorMessage =
        typeof error.message === "object"
          ? JSON.stringify(error.message)
          : error.message || "Unknown error occurred";
      toast.error(
        "Failed to update Special LeaveEntry. Please try again!\n" + errorMessage
      );
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Special LeaveEntry
export const deleteSpecialLeaveEntry = createAsyncThunk(
  "specialLeaveEntry/deleteSpecialLeaveEntry",
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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status) {
        toast.success("Special LeaveEntry deleted successfully!");
        return id;
      } else {
        throw new Error(responseData.message || "Failed to delete data.");
      }
    } catch (error) {
      toast.error("Failed to delete Special LeaveEntry. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);
