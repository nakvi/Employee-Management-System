import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";

// Define the API endpoints
const FETCH_API_ENDPOINT = `${config.api.API_URL}attOTMonthFillGrid/`;
const SUBMIT_API_ENDPOINT = `${config.api.API_URL}attOTMonth/`;

// Helper function to manually encode query parameters without escaping quotes
const encodeQueryParam = (key, value) => {
  if (value === undefined || value === null || value === "") return "";
  // Replace spaces with '+' but keep quotes unescaped
  const encodedValue = String(value).replace(/ /g, "+");
  return `${encodeURIComponent(key)}=${encodedValue}`;
};

// Fetch O/T Monthly data
export const getOTMonthly = createAsyncThunk(
  "otMonthly/getOTMonthly",
  async (filters, { rejectWithValue }) => {
    try {
      // Calculate DateFrom and DateTo from month (YYYY-MM)
      let dateFrom = "2025-01-01";
      let dateTo = "2025-12-31";
      if (filters.month) {
        const [year, month] = filters.month.split("-");
        dateFrom = `${year}-${month}-01`;
        // Calculate the last day of the month
        const lastDay = new Date(year, month, 0).getDate();
        dateTo = `${year}-${month}-${lastDay}`;
      }

      // Construct query parameters manually
      const params = [
        encodeQueryParam("Orgini", "LLT"),
        encodeQueryParam("Vdate", "2025-06-04"),
        encodeQueryParam("DateFrom", dateFrom),
        encodeQueryParam("DateTo", dateTo),
        encodeQueryParam("DeptIDs", filters.department ? filters.department.join(",") : ""),
        // Send EmployeeIDList as-is, replacing spaces with '+'
        filters.employeeIdList ? `EmployeeIDList=${filters.employeeIdList.replace(/ /g, "+")}` : "",
        encodeQueryParam("CompanyID", "1"),
        encodeQueryParam("LocationID", filters.location || "1"),
        encodeQueryParam("ETypeID", filters.eType || "1"),
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
      console.error("Error fetching O/T Monthly:", error.message);
      toast.error("Failed to fetch O/T Monthly. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Submit O/T Monthly data
export const submitOTMonthly = createAsyncThunk(
  "otMonthly/submitOTMonthly",
  async (payload, { rejectWithValue }) => {
    try {
      const { employeeIdList, otEntries } = payload;

      // Send each entry as a separate POST request
      const responses = await Promise.all(
        otEntries.map(async (entry) => {
          const response = await fetch(SUBMIT_API_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...entry,
              EmployeeIdList: employeeIdList, // Include EmployeeIdList in each entry
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
      toast.success("O/T Monthly submitted successfully!");
      return responses.map((res) => res.data); // Return array of response data
    } catch (error) {
      const errorMessage = error.message || "Unknown error occurred";
      toast.error("Failed to submit O/T Monthly. Please try again!\n" + errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update O/T Monthly data
export const updateOTMonthly = createAsyncThunk(
  "otMonthly/updateOTMonthly",
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
        toast.success(data.message || "O/T Monthly updated successfully!");
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
      toast.error("Failed to update O/T Monthly. Please try again!\n" + errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete O/T Monthly data
export const deleteOTMonthly = createAsyncThunk(
  "otMonthly/deleteOTMonthly",
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
        toast.success("O/T Monthly deleted successfully!");
        return id;
      } else {
        throw new Error(responseData.message || "Failed to delete data.");
      }
    } catch (error) {
      toast.error("Failed to delete O/T Monthly. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);