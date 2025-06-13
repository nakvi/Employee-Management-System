import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";

const FETCH_API_ENDPOINT = `${config.api.API_URL}attOTFillGrid/`;
const SUBMIT_API_ENDPOINT = `${config.api.API_URL}attOT/`;

const encodeQueryParam = (key, value) => {
  if (value === undefined || value === null || value === "") return "";
  const encodedValue = String(value).replace(/ /g, "+");
  return `${encodeURIComponent(key)}=${encodedValue}`;
};

export const getOTDaily = createAsyncThunk(
  "otDaily/getOTDaily",
  async (filters, { rejectWithValue }) => {
    console.log("Fetching O/T Daily with filters:", filters);
    try {
      const params = [
        encodeQueryParam("Orgini", filters.Orgini),
        encodeQueryParam("VDate", filters.Vdate),
        encodeQueryParam("DateFrom", filters.DateFrom),
        encodeQueryParam("DateTo", filters.DateTo),
        encodeQueryParam("DeptIDs", filters.DeptIDs),
        filters.EmployeeIDList ? `EmployeeIDList=${filters.EmployeeIDList.replace(/ /g, "+")}` : "",
        encodeQueryParam("CompanyID", filters.CompanyID),
        encodeQueryParam("LocationID", filters.LocationID),
        encodeQueryParam("ETypeID", filters.ETypeID),
        encodeQueryParam("EmpID", "1"),
        encodeQueryParam("IsAu", filters.IsAu),
        encodeQueryParam("IsExport", filters.IsExport),
        encodeQueryParam("UID", filters.UID),
        encodeQueryParam("InFlage", filters.InFlage),
      ].filter(Boolean).join("&");
      console.log("Constructed query parameters:", params);

      const response = await fetch(`${FETCH_API_ENDPOINT}?${params}`, {
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
      console.log("Fetched O/T Daily data:", data);
      const result = Array.isArray(data) ? data : data.data || [];
      console.log("Returning result:", result);
      return result;
    } catch (error) {
      console.error("Error fetching O/T Daily:", error.message);
      toast.error(`Failed to fetch O/T Daily: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const submitOTDaily = createAsyncThunk(
  "otDaily/submitOTDaily",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("Submit Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(SUBMIT_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
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
      console.log("Submit Response:", data);

      if (data.status === "0") {
        toast.success(data.message || "O/T Daily submitted successfully!");
        return data.data; // Return the saved data
      } else {
        const errorMessage = data.error || data.message || "Failed to submit O/T Daily!";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      console.error("Failed to submit O/T Daily:", errorMessage);
      toast.error("Failed to submit O/T Daily: " + errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update O/T Daily data (unchanged)
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

// Delete O/T Daily data (unchanged)
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