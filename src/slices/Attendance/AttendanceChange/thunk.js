import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetAttendanceChange } from "./reducer";

const API_ENDPOINT = "http://192.168.18.65:8001/ems/attChange";

// Helper function to format timestamps to HH:mm
const formatTime = (timestamp) => {
  if (!timestamp || timestamp === "1900-01-01T00:00:00" || timestamp === "1900-01-01") {
    console.log("formatTime: Empty or default timestamp:", timestamp);
    return "";
  }
  try {
    const date = new Date(timestamp.replace(" ", "T"));
    if (isNaN(date.getTime())) {
      console.warn("formatTime: Invalid timestamp:", timestamp);
      return "";
    }
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    console.log("formatTime: Parsed timestamp:", timestamp, "->", `${hours}:${minutes}`);
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("formatTime: Error parsing timestamp:", timestamp, error);
    return "";
  }
};

export const getAttendanceChange = createAsyncThunk(
  "attendanceChange/getAttendanceChange",
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        orgini: params.orgini || "LTT",
        vdate: params.vdate || "",
        datefrom: params.datefrom || "",
        dateto: params.dateto || "",
        deptids: params.deptids || "",
        employeeidlist: params.employeeidlist || "",
        companyid: params.companyid || "1",
        locationid: params.locationid || "1",
        etypeid: params.etypeid || "0",
        empid: params.empid || "1",
        isau: params.isau || "0",
        onlyot: params.onlyot || "0",
        isexport: params.isexport || "0",
        uid: params.uid || "1",
        inflage: params.inflage || "0",
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
            attendanceCode: item.attendanceCode || "N/A",
            shiftTime: item.shiftTime || "N/A",
            totalTime: item.totalTime || "N/A",
            timeIn: formatTime(item.datein1 || item.dateIn1),
            timeOut: formatTime(item.dateout1 || item.dateOut1),
            remarks: item.remarks || "",
            post: !!item.isPosted,
            empid: item.empid || "",
            vid1: item.id1 || item.vid1 || 0,
          };
        });
        console.log("Transformed Data:", JSON.stringify(transformedData, null, 2));
        return transformedData;
      } else if (data.status === "0") {
        return Array.isArray(data.data) ? data.data : [];
      } else if (data.status === "1") {
        toast.error("An error occurred while fetching attendance change data.");
        return rejectWithValue("An error occurred while fetching attendance change data.");
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
      toast.error(`Failed to fetch attendance change data: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Re-export the resetAttendanceChange action
export { resetAttendanceChange };