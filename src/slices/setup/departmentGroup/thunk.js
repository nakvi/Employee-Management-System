import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct

// const API_ENDPOINT = "http://192.168.18.65:8001/ems/departmentGroup/";
const API_ENDPOINT = `${config.api.API_URL}departmentGroup/`;

// Fetch Department Groups
export const getDepartmentGroup = createAsyncThunk(
  "departmentGroup/getDepartmentGroup",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        // Handle HTTP errors
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.json();
      // console.log("Fetched data:", data);

      return data;
    } catch (error) {
      console.error("Error fetching department groups:", error.message);
      // Show error message using toast
      toast.error("Failed to fetch department groups. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);

// Submit Department Group
export const submitDepartmentGroup = createAsyncThunk(
  "departmentGroup/submitDepartmentGroup",
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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Handle different status codes from the API response
      if (data.status === "0") {
        toast.success(data.message || "Department group added successfully!");
      } else if (data.status === "1") {
        toast.error(data.message || "An error occurred!");
        return rejectWithValue(data.message);
      } else if (data.status === "2") {
        toast.warning(data.message || "Warning: Please check your input!");
      }

      // toast.success(data.message || "Department group added successfully!");
      return data.data; // Return the newly created department group
    } catch (error) {
      toast.error("Failed to add department group. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);
// Update the department
export const updateDepartmentGroup = createAsyncThunk(
  "departmentGroup/updateDepartmentGroup",
  async (groupData, { rejectWithValue }) => {
    console.log(groupData);
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        throw new Error("Failed to update department group");
      }
      const responseData = await response.json();
      if (responseData.status === "0") {
        toast.success(responseData.message || "Department group added successfully!");
      } else if (responseData.status === "1") {
        toast.error(responseData.message || "An error occurred!");
        return rejectWithValue(responseData.message);
      } else if (responseData.status === "2") {
        toast.warning(responseData.message || "Warning: Please check your input!");
      }
      // toast.success("Department group updated successfully!");
      return responseData.data; // Assuming the updated data is in 'data'
    } catch (error) {
      toast.error("Failed to update department group. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Delete Department Groups
export const deleteDepartmentGroup = createAsyncThunk(
  "departmentGroup/deleteDepartmentGroup",
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
        toast.success("Department group deleted successfully!");
        return id; // Return the deleted ID to update the state
      } else {
        throw new Error(responseData.message || "Failed to delete data.");
      }
    } catch (error) {
      toast.error("Failed to delete department group. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);
