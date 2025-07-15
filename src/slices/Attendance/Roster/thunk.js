import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";

// Define API endpoints
const ROSTER_API_ENDPOINT = `${config.api.API_URL}attRoster/`;
const DEPARTMENT_API_ENDPOINT = `${config.api.API_URL}getRosterDepartment/`;
const ROSTER_SHIFT_API_ENDPOINT = `${config.api.API_URL}getRosterShift/`;

// Fetch Roster data
export const getRoster = createAsyncThunk(
  "roster/getRoster",
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        department: filters.department || "",
        month: filters.month || "",
        dateFrom: filters.dateFrom || "",
        dateTo: filters.dateTo || "",
        ShiftID: filters.ShiftID || "",
        offDay: filters.offDay || "",
        employeeIdList: filters.employeeIdList || "",
        employeeName: filters.employeeName || "",
      }).toString();

      const url = `${ROSTER_API_ENDPOINT}?${queryParams}`;
      console.log("Roster API URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          // Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      const contentType = response.headers.get("Content-Type");
      console.log("Response Content-Type:", contentType);

      if (!response.ok) {
        const text = await response.text();
        console.error("Non-OK Response:", text);
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (contentType && contentType.includes("application/json")) {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || JSON.stringify(errorData.error) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Invalid response format: Expected JSON");
      }

      const data = await response.json();
      console.log("Fetched Roster Data (raw):", data);
      const rosterData = Array.isArray(data.data) ? data.data : [];
      console.log("Processed Roster Data:", rosterData);
      return rosterData;
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
      const response = await fetch(ROSTER_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message =
          errorData?.error || errorData?.message || "Failed to submit roster";
        throw new Error(message);
      }

      const data = await response.json();
      if (data.status === "success") {
        toast.success(data.message || "Roster submitted successfully!");
        return data.data;
      } else {
        const errorMessage = data.message || data.error || "Submission failed!";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to submit roster";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Roster Departments
export const getRosterDepartments = createAsyncThunk(
  "roster/getRosterDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(DEPARTMENT_API_ENDPOINT, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Fetched Departments (raw):", data); // Raw response
      const departments = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];
      console.log("Normalized Departments:", departments); // Normalized array
      return departments;
    } catch (error) {
      console.error("Error fetching Departments:", error.message);
      toast.error(`Failed to fetch Departments: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Roster Shifts
export const getRosterShift = createAsyncThunk(
  "roster/getRosterShift",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(ROSTER_SHIFT_API_ENDPOINT, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Fetched Shifts (raw):", data); // Raw response
      const shifts = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];
      console.log("Normalized Shifts:", shifts); // Normalized array
      return shifts;
    } catch (error) {
      console.error("Error fetching Shifts:", error.message);
      toast.error(`Failed to fetch Shifts: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);