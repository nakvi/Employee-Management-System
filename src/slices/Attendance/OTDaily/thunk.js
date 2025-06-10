import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";

// Define API endpoints
const FETCH_API_ENDPOINT = `${config.api.API_URL}attOTFillGrid/`;
const SUBMIT_API_ENDPOINT = `${config.api.API_URL}attOT/`; // Replace with correct endpoint

// Fetch O/T Daily data
export const getOTDaily = createAsyncThunk(
  "otDaily/getOTDaily",
  async (filters, { rejectWithValue }) => {
    try {
      // Construct query string from filters, excluding EmployeeIDList to avoid encoding
      const queryParams = new URLSearchParams({
        Orgini: filters.Orgini || "LLT",
        Vdate: filters.Vdate || new Date().toISOString().split("T")[0],
        DateFrom: filters.DateFrom || "2025-01-01",
        DateTo: filters.DateTo || "2025-12-31",
        DeptIDs: filters.DeptIDs || "",
        CompanyID: filters.CompanyID || "1",
        LocationID: filters.LocationID || "1",
        ETypeID: filters.ETypeID || "1",
        EmpID: filters.EmpID || "1",
        IsAu: filters.IsAu || "0",
        IsExport: filters.IsExport || "0",
        UID: filters.UID || "0",
        InFlage: filters.InFlage || "0",
      });

      // Manually append EmployeeIDList to avoid URL encoding of special characters
      const employeeIDList = filters.EmployeeIDList || "";
      const queryString = employeeIDList
        ? `${queryParams.toString()}&EmployeeIDList=${employeeIDList}`
        : queryParams.toString();

      const response = await fetch(`${FETCH_API_ENDPOINT}?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching O/T Daily:", error.message);
      toast.error("Failed to fetch O/T Daily. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Submit O/T Daily data
export const submitOTDaily = createAsyncThunk(
  "otDaily/submitOTDaily",
  async (payload, { rejectWithValue }) => {
    try {
      // Log the payload to verify EmployeeIDList format
      console.log("Submit Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(SUBMIT_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Capture Allow header for 405 error
        if (response.status === 405) {
          const allowHeader = response.headers.get("Allow") || "Unknown";
          const errorMessage = `Method Not Allowed (405). Allowed methods: ${allowHeader}`;
          console.error(errorMessage);
          toast.error(errorMessage);
          return rejectWithValue(errorMessage);
        }
        if (response.status === 400) {
          const errorData = await response.json();
          const message = errorData.error || errorData.message || "Validation failed!";
          toast.error(message);
          return rejectWithValue(message);
        }
        const errorMessage = `HTTP error! Status: ${response.status}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.status === "0") {
        toast.success(data.message || "O/T Daily submitted successfully!");
        return data.data;
      } else if (data.status === "1") {
        const errorMessage = data.error || data.message || "An error occurred!";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else if (data.status === "2") {
        const warningMessage = data.error || data.message || "Warning: Please check your input!";
        toast.warning(warningMessage);
        return rejectWithValue(warningMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      console.error("Failed to submit O/T Daily:", errorMessage);
      toast.error("Failed to submit O/T Daily. Please try again!\n" + errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update O/T Daily data
export const updateOTDaily = createAsyncThunk(
  "otDaily/updateOTDaily",
  async (otData, { rejectWithValue }) => {
    try {
      const response = await fetch(SUBMIT_API_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          const message = errorData.error || errorData.message || "Validation failed!";
          toast.error(message);
          return rejectWithValue(message);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "0") {
        toast.success(data.message || "O/T Daily updated successfully!");
        return data.data;
      } else if (data.status === "1") {
        const errorMessage = data.error || data.message || "An error occurred!";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else if (data.status === "2") {
        const warningMessage = data.error || data.message || "Warning: Please check your input!";
        toast.warning(warningMessage);
        return rejectWithValue(warningMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      toast.error("Failed to update O/T Daily. Please try again!\n" + errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete O/T Daily data
export const deleteOTDaily = createAsyncThunk(
  "otDaily/deleteOTDaily",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(SUBMIT_API_ENDPOINT, {
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
        toast.success("O/T Daily deleted successfully!");
        return id;
      } else {
        throw new Error(responseData.message || "Failed to delete data.");
      }
    } catch (error) {
      toast.error("Failed to delete O/T Daily. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);