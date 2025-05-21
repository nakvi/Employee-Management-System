import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";

const API_ENDPOINT = `${config.api.API_URL}attEntry/`;

// Helper function to format timestamps to HH:mm
const formatTime = (timestamp) => {
  if (!timestamp || timestamp === "1900-01-01T00:00:00" || timestamp === "1900-01-01") {
    console.log("formatTime: Empty or default timestamp:", timestamp);
    return "";
  }
  try {
    // Handle various timestamp formats
    const date = new Date(timestamp.replace(" ", "T")); // Normalize "YYYY-MM-DD HH:mm:ss" to ISO
    if (isNaN(date.getTime())) {
      console.warn("formatTime: Invalid timestamp:", timestamp);
      return "";
    }
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    console.log("formatTime: Parsed timestamp:", timestamp, "->", `${hours}:${minutes}`);
    return `${hours}:${minutes}`; // e.g., "08:00"
  } catch (error) {
    console.error("formatTime: Error parsing timestamp:", timestamp, error);
    return "";
  }
};

// Helper function to convert HH:mm to API-compatible timestamp or date-only string
const toApiTimestamp = (time, date) => {
  if (!time || typeof time !== "string" || !/^\d{2}:\d{2}$/.test(time)) {
    console.warn("No valid time selected:", time);
    return "1900-01-01";
  }
  if (!date || isNaN(new Date(date).getTime())) {
    console.warn("Invalid date value:", date);
    return "1900-01-01";
  }
  try {
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59) {
      console.warn("Invalid hours or minutes:", { hours, minutes });
      return "1900-01-01";
    }
    console.log("Valid time input:", { time, hours, minutes });
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + 1); // Use next day, e.g., 2025-05-20
    dateObj.setHours(hours, minutes, 0, 0);
    if (isNaN(dateObj.getTime())) {
      console.warn("Invalid date object created:", dateObj);
      return "1900-01-01";
    }
    // Format as "YYYY-MM-DD HH:mm:ss"
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(minutes).padStart(2, "0");
    return `${year}-${month}-${day} ${hoursStr}:${minutesStr}:00`;
  } catch (error) {
    console.error("Error in toApiTimestamp:", error, { time, date });
    return "1900-01-01";
  }
};

export const getAttendanceEntry = createAsyncThunk(
  "attendanceEntry/getAttendanceEntry",
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        orgini: params.orgini || "LTT",
        vdate: params.vdate || "",
        datefrom: params.datefrom || "",
        dateto: params.dateto || "",
        deptids: params.deptids || "",
        employeeidlist: params.employeeidlist || "",
        companyid:  "1",
        // locationid: params.locationid || "1",
        locationid: "4",
        etypeid: params.etypeid || "0",
        empid: params.empid || "1",
        isau: params.isau || "0",
        onlyot: params.onlyot || "0",
        isexport: params.isexport || "0",
        uid: params.uid || "1",
        inflage: params.inflage || "0",
        vType: params.vType || "BOTH",
      }).toString();

      console.log("Fetching from:", `${API_ENDPOINT}?${queryParams}`);
      const response = await fetch(`${API_ENDPOINT}?${queryParams}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      console.log("Raw API Response Data:", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        const transformedData = data.map((item, index) => {
          console.log(`Item ${index} (All Fields):`, item);
          return {
            employee: item.ename || "N/A",
            timeIn: formatTime(item.datein1 || item.dateIn1),
            timeOut: formatTime(item.dateout1 || item.dateOut1),
            timeIn2: formatTime(item.datein2 || item.dateIn2),
            timeOut2: formatTime(item.dateout2 || item.dateOut2),
            remarks: item.remarks || "",
            changed: !!item.ischanged,
            empid: item.empid,
            vid1: item.id1 || item.vid1 || 0,
            vid2: item.id2 || item.vid2 || 0,
            shiftID: item.shiftid || item.shiftID || 3,
          };
        });
        console.log("Transformed Data:", JSON.stringify(transformedData, null, 2));
        return transformedData;
      } else if (data.status === "0") {
        return data.data || [];
      } else if (data.status === "1") {
        toast.error("An error occurred while fetching attendance data.");
        return rejectWithValue("An error occurred while fetching attendance data.");
      } else if (data.status === "2") {
        toast.warn("Warning: Data may not be complete.");
        return rejectWithValue("Warning: Data may not be complete.");
      } else {
        const errorMessage = `Unexpected response status: ${data.status || "undefined"}`;
        console.error("Unexpected Response:", data);
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(`Failed to fetch attendance data: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const saveAttendanceEntry = createAsyncThunk(
  "attendanceEntry/saveAttendanceEntry",
  async (record, { rejectWithValue }) => {
    try {
      console.log("Processing record:", JSON.stringify(record, null, 2));
      if (!record.vdate || isNaN(new Date(record.vdate).getTime())) {
        throw new Error(`Invalid vdate for empid ${record.empid}`);
      }
      const dateObj = new Date(record.vdate);
      const vdateFormatted = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
      
      // Hardcode Postman payload for testing
      const payload = {
        empid: Number(record.empid),
        vdate: vdateFormatted,
        vid1: record.vid1 || 0,
        vid2: record.vid2 || 0,
        shiftID: 3,
        // dateIn1: record.dateIn1 ? "2025-05-20 08:00:00" : "1900-01-01",
        // dateOut1: "1900-01-01",
        // dateIn2: "1900-01-01",
        // dateOut2: "1900-01-01",
        dateIn1: record.dateIn1 ? record.dateIn1 : "1900-01-01",
        dateOut1: record.dateOut1 ? record.dateOut1 : "1900-01-01",
        dateIn2: record.dateIn2 ? record.dateIn2 : "1900-01-01",
        dateOut2: record.dateOut2 ? record.dateOut2 : "1900-01-01",
        remarks: String(record.remarks || "Today attendance"),
        uID: record.uID || 1,
        computerName: "HR-PC-001",
      };

      const rawBody = JSON.stringify(payload);
      console.log("Saving to:", API_ENDPOINT, "Raw Request Body:", rawBody);
      console.log("Parsed Payload for Reference:", JSON.stringify(payload, null, 2));
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: rawBody,
      });

      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log(`Response Status for empid ${record.empid}:`, response.status);
      console.log(`Response Headers for empid ${record.empid}:`, responseHeaders);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error for empid ${record.empid}:`, response.status, errorText);
        throw new Error(`HTTP error for empid ${record.empid}! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log(`Save API Response for empid ${record.empid}:`, data);

      if (Array.isArray(data) && data.length > 0 && data[0]?.status === "200") {
        toast.success(`Attendance record saved successfully for empid ${record.empid}!`);
        return data;
      } else {
        const errorMessage = data.message || `Unexpected response for empid ${record.empid}: ${JSON.stringify(data)}`;
        console.warn(`Unexpected response for empid ${record.empid}:`, data);
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      console.error(`Save API Error for empid ${record.empid}:`, error);
      toast.error(`Failed to save attendance data for empid ${record.empid}: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);