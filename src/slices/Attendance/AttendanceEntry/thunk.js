import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";

const API_ENDPOINT = `${config.api.API_URL}attEntry/`;

// Helper function to format timestamps to HH:mm
const formatTime = (timestamp) => {
  if (!timestamp || timestamp === "1900-01-01T00:00:00") return "";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toTimeString().slice(0, 5); // e.g., "09:00"
  } catch (error) {
    console.error("Invalid timestamp:", timestamp, error);
    return "";
  }
};

// Helper function to convert HH:mm to API-compatible timestamp
const toApiTimestamp = (time, date) => {
  if (!time || typeof time !== "string" || !/^\d{2}:\d{2}$/.test(time)) {
    console.warn("Invalid time value:", time);
    return "1900-01-01T00:00:00";
  }
  if (!date || isNaN(new Date(date).getTime())) {
    console.warn("Invalid date value:", date);
    return "1900-01-01T00:00:00";
  }
  try {
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59) {
      console.warn("Invalid hours or minutes:", { hours, minutes });
      return "1900-01-01T00:00:00";
    }
    const dateObj = new Date(date);
    dateObj.setHours(hours, minutes, 0, 0);
    if (isNaN(dateObj.getTime())) {
      console.warn("Invalid date object created:", dateObj);
      return "1900-01-01T00:00:00";
    }
    return dateObj.toISOString();
  } catch (error) {
    console.error("Error in toApiTimestamp:", error, { time, date });
    return "1900-01-01T00:00:00";
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
        companyid: params.companyid || "0",
        locationid: params.locationid || "0",
        etypeid: params.etypeid || "0",
        empid: params.empid || "0",
        isau: params.isau || "0",
        onlyot: params.onlyot || "0",
        isexport: params.isexport || "0",
        uid: params.uid || "0",
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
      console.log("API Response Data:", data);

      if (Array.isArray(data)) {
        const transformedData = data.map((item, index) => {
          console.log(`Item ${index} (All Fields):`, item);
          return {
            employee: item.ename || "N/A",
            timeIn: formatTime(item.datein1),
            timeOut: formatTime(item.dateout1),
            timeIn2: formatTime(item.datein2),
            timeOut2: formatTime(item.dateout2),
            remarks: item.remarks || "",
            changed: !!item.ischanged,
            empid: item.empid,
            vid1: item.vid1 || 1,
            vid2: item.vid2 || 2,
            shiftID: item.shiftID || 3,
          };
        });
        console.log("Transformed Data:", transformedData);
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
      console.log("Processing record:", record);
      if (!record.vdate || isNaN(new Date(record.vdate).getTime())) {
        throw new Error("Invalid vdate");
      }
      const payload = {
        empid: record.empid,
        vdate: new Date(record.vdate).toISOString(),
        vid1: record.vid1,
        vid2: record.vid2,
        shiftID: record.shiftID,
        dateIn1: toApiTimestamp(record.dateIn1, record.vdate),
        dateOut1: toApiTimestamp(record.dateOut1, record.vdate),
        dateIn2: toApiTimestamp(record.dateIn2, record.vdate),
        dateOut2: toApiTimestamp(record.dateOut2, record.vdate),
        remarks: record.remarks || "",
        uID: record.uID,
        computerName: record.computerName,
      };

      console.log("Saving to:", API_ENDPOINT, "Payload:", payload);
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("Save API Response:", data);

      if (data.status === "0" || data.success) {
        toast.success("Attendance record saved successfully!");
        return data;
      } else {
        const errorMessage = data.message || "Failed to save attendance record.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      console.error("Save API Error:", error);
      toast.error(`Failed to save attendance data: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);