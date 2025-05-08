import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct
// Define a custom async thunk to fetch data from an API
// const API_ENDPOINT = "http://192.168.18.65:8001/ems/department/";
const API_ENDPOINT = `${config.api.API_URL}department/`;

export const getDepartment = createAsyncThunk(
  "department/getDepartment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error("Failed to fetch department groups. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);
// Submit Department
//
// export const submitDepartment = createAsyncThunk(
//   "department/submitDepartment",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await fetch(API_ENDPOINT, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json(); // Always parse JSON response

//       if (!response.ok) {
//         // Handle 400 validation error specifically
//         if (response.status === 400) {
//           toast.error(
//             data.error || "Validation failed! Please check your input."
//           );
//           return rejectWithValue(data.error || data.message);
//         }

//         // Generic API error
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Handle API response based on status field
//       if (data.status === "0") {
//         toast.success(data.message || "Department added successfully!");
//         return data.data;
//       } else if (data.status === "1") {
//         toast.error(data.error || data.message || "An error occurred!");
//         return rejectWithValue(data.error || data.message);
//       } else if (data.status === "2") {
//         toast.warning(
//           data.error || data.message || "Warning: Please check your input!"
//         );
//         return rejectWithValue(data.error || data.message);
//       }

//       return rejectWithValue("Unexpected response from server.");
//     } catch (error) {
//       toast.error(
//         error.message || "Failed to add department. Please try again!"
//       );
//       return rejectWithValue(error.message);
//     }
//   }
// );
export const submitDepartment = createAsyncThunk(
  "department/submitDepartment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // if (!response.ok) {
      //   if (response.status === 400) {
      //     return rejectWithValue(data.error || data.message);
      //   }
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      if (data.status === "0") {
        toast.success(data.message || "Department added successfully!");
        return data.data;
      } else if (data.status === "1") {
        toast.error(data.error || data.message || "An error occurred!");
        return rejectWithValue(data.error || data.message);
      } else if (data.status === "2") {
        return rejectWithValue(data.error || data.message);
      }

      return rejectWithValue("Unexpected response from server.");
    } catch (error) {
      toast.error(
        error.message || "Failed to add department. Please try again!"
      );
      return rejectWithValue(error.message);
    }
  }
);

// Update Department
export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });

      const responseData = await response.json(); // Always parse JSON response first

      if (!response.ok) {
        // Handle 400 validation error specifically
        if (response.status === 400) {
          toast.error(
            responseData.error || "Validation failed! Please check your input."
          );
          return rejectWithValue(responseData.error || responseData.message);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Handle API response based on status field
      if (responseData.status === "0") {
        toast.success(
          responseData.message || "Department updated successfully!"
        );
        return responseData.data;
      } else if (responseData.status === "1") {
        toast.error(
          responseData.error || responseData.message || "An error occurred!"
        );
        return rejectWithValue(responseData.error || responseData.message);
      } else if (responseData.status === "2") {
        toast.warning(
          responseData.error ||
            responseData.message ||
            "Warning: Please check your input!"
        );
        return rejectWithValue(responseData.error || responseData.message);
      }

      return rejectWithValue("Unexpected response from server.");
    } catch (error) {
      toast.error(
        error.message || "Failed to update department. Please try again!"
      );
      return rejectWithValue(error.message);
    }
  }
);

// Delete Department
export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
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
        toast.success("Department  deleted successfully!");
        return id; // Return the deleted ID to update the state
      } else {
        throw new Error(responseData.message || "Failed to delete data.");
      }
    } catch (error) {
      toast.error("Failed to delete department . Please try again!");
      return rejectWithValue(error.message);
    }
  }
);
