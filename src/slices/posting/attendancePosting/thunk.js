import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";

// Define the API endpoints
const FETCH_API_ENDPOINT = `${config.api.API_URL}attDailyAttendanceFillGrid/`;
const SUBMIT_API_ENDPOINT = `${config.api.API_URL}attDailyAttendance/`;

// Helper function to manually encode query parameters without escaping quotes
const encodeQueryParam = (key, value) => {
  if (value === undefined || value === null || value === "") return "";
  // Replace spaces with '+' but keep quotes unescaped
  const encodedValue = String(value).replace(/ /g, "+");
  return `${encodeURIComponent(key)}=${encodedValue}`;
};

// Fetch Daily Attendance data
export const getAttendancePosting = createAsyncThunk(
  "attendancePosting/getAttendancePosting",
  async (filters, { rejectWithValue }) => {
    console.log("Fetching Daily Attendance with filters:", filters);
    try {
      // Construct query parameters manually
      const params = [
        encodeQueryParam("Orgini", "LLT"),
        encodeQueryParam("Vdate", new Date().toISOString().split("T")[0]),
        encodeQueryParam("DateFrom", filters.dateFrom || ""),
        encodeQueryParam("DateTo", filters.dateTo || ""),
        encodeQueryParam("DeptIDs", filters.department ? filters.department.join(",") : ""),
        encodeQueryParam("ETypeID", filters.eType || ""),
        encodeQueryParam("PendingPosting", filters.pendingPosting ? "1" : "0"),
        encodeQueryParam("ResignEmployee", filters.resignEmployee ? "1" : "0"),
        encodeQueryParam("CompanyID", "1"),
        encodeQueryParam("LocationID", filters.location || "1"),
        encodeQueryParam("EmpID", "1"),
        encodeQueryParam("IsAu", "0"),
        encodeQueryParam("IsExport", "0"),
        encodeQueryParam("UID", "0"),
        encodeQueryParam("InFlage", "0"),
      ].filter(Boolean).join("&");

      const url = `${FETCH_API_ENDPOINT}?${params}`;
      console.log("Constructed URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data after fetch:", data);

      // Handle both direct array and { data: [...] } responses
      const returnData = Array.isArray(data) ? data : data.data || [];
      console.log("Return data:", returnData);

      return returnData;
    } catch (error) {
      console.error("Error fetching Daily Attendance:", error.message);
      toast.error("Failed to fetch Daily Attendance. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Submit Daily Attendance data
export const submitAttendancePosting = createAsyncThunk(
  "attendancePosting/submitAttendancePosting",
  async (payload, { rejectWithValue }) => {
    try {
      const { selectedEmployees, attendanceData } = payload;

      // Send each attendance entry as a separate POST request
      const responses = await Promise.all(
        attendanceData.map(async (entry) => {
          const response = await fetch(SUBMIT_API_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...entry,
              EmployeeIDList: selectedEmployees.join(","), // Include selected employees
            }),
          });

          if (!response.ok) {
            if (response.status === 400) {
              const errorData = await response.json();
              const message = errorData.error || errorData.message || "Validation failed!";
              return { error: message, entry };
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          return { data, entry };
        })
      );

      // Check for errors in responses
      const errors = responses.filter((res) => res.error);
      if (errors.length > 0) {
        const errorMessages = errors.map((err) => err.error).join("; ");
        toast.error(`Failed to submit some entries: ${errorMessages}`);
        return rejectWithValue(errorMessages);
      }

      // All requests succeeded
      toast.success("Daily Attendance submitted successfully!");
      return responses.map((res) => res.data); // Return array of response data
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      toast.error("Failed to submit Daily Attendance. Please try again!\n" + errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);



