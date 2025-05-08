import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from '../../../config'; // ✅ correct
// Define the API endpoint
// const API_ENDPOINT = "http://192.168.18.65:8001/ems/secRolePage/";
const API_ENDPOINT = `${config.api.API_URL}secRolePage/`;

// Fetch page permissions for a specific role
export const getPagePermission = createAsyncThunk(
  "pagePermission/getPagePermission",
  async (roleId, { rejectWithValue }) => {
    try {
      // Try with roleId as a query parameter
      let response = await fetch(`${API_ENDPOINT}?roleId=${roleId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If query parameter fails, try with a POST request
        response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roleId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Fetched page permission data for roleId", roleId, ":", data);
      if (data.status !== "0") {
        throw new Error(data.message || "Failed to fetch permissions");
      }
      return data;
    } catch (error) {
      console.error("Error fetching page permissions:", error);
      toast.error("Failed to fetch page permission: " + error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Add new page permission
export const createPagePermission = createAsyncThunk(
  "pagePermission/createPagePermission",
  async (groupData, { rejectWithValue }) => {
    console.log("Creating page permission with payload:", groupData);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Create page permission failed:", errorData);
        throw new Error(errorData.message || "Failed to create page permission");
      }
      const responseData = await response.json();
      console.log("Create page permission response:", responseData);
      toast.success("Page permission created successfully!");
      return responseData.data;
    } catch (error) {
      toast.error("Failed to create page permission: " + error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Update page permission
export const updatePagePermission = createAsyncThunk(
  "pagePermission/updatePagePermission",
  async (groupData, { rejectWithValue }) => {
    console.log("Updating page permission with payload:", groupData);
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Update page permission failed:", errorData);
        throw new Error(errorData.message || "Failed to update page permission");
      }
      const responseData = await response.json();
      console.log("Update page permission response:", responseData);
      toast.success("Page permission updated successfully!");
      return responseData.data;
    } catch (error) {
      toast.error("Failed to update page permission: " + error.message);
      return rejectWithValue(error.message);
    }
  }
);