import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct
// Define an Endpoint of API
// const API_ENDPOINT = "http://192.168.18.65:8001/ems/employee/";
const API_ENDPOINT = `${config.api.API_URL}employee/`;

export const getEmployee = createAsyncThunk(
  "employee/geteEmployee",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status === "0") {
        // Success: Return the data
        console.log("test", data.data);

        return data.data;
      } else if (data.status === "1") {
        // Error: Show an error message on toast
        toast.error("An error occurred while fetching data.");
        return rejectWithValue("An error occurred while fetching data.");
      } else if (data.status === "2") {
        // Warning: Show a warning message on toast
        toast.warn("Warning: Data may not be complete.");
        return rejectWithValue("Warning: Data may not be complete.");
      }
    } catch (error) {
      toast.error("Failed to fetch Salary Increment. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);
// Submit employee
// export const submitEmployee =createAsyncThunk("employee/SubmitEmployee", async (payload, { rejectWithValue }) => {
//   try {
//     const response = await fetch(API_ENDPOINT, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });
//        if (!response.ok) {
//         // Handle 400 validation error specifically
//         if (response.status === 400) {
//           toast.error(
//             response.error || "Validation failed! Please check your input."
//           );
//           return rejectWithValue(response.error || response.message);
//         }
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//        // Handle API response based on status field
//       if (data.status === "0") {
//         toast.success(
//           data.message || "Employee added successfully!"
//         );
//         return data.data;
//       } else if (data.status === "1") {
//         toast.error(
//           data.error || data.message || "An error occurred!"
//         );
//         return rejectWithValue(data.error || data.message);
//       } else if (data.status === "2") {
//         toast.warning(
//           data.error ||
//             data.message ||
//             "Warning: Please check your input!"
//         );
//         return rejectWithValue(data.error || data.message);
//       }

//     // const data = await response.json();
//     // toast.success(data.message || "Employee added successfully!");
//     // return data.data; // Return the newly created Designation
//   } catch (error) {
//     toast.error("Failed to add Employee. Please try again!");
//     return rejectWithValue(error.message);
//   }
// }
// );
export const submitEmployee = createAsyncThunk(
  "employee/SubmitEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle 400 validation error specifically
        if (response.status === 400) {
          const errorData = await response.json();
          const message =
            typeof errorData.error === "object"
              ? JSON.stringify(errorData.error)
              : errorData.error || errorData.message || "Validation failed!";
          toast.error(message);
          return rejectWithValue(message);
        }

        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Handle API response based on status field
      if (data.status === "0") {
        toast.success(
          typeof data.message === "object"
            ? JSON.stringify(data.message)
            : data.message || "Employee added successfully!"
        );
        return data.data;
      } else if (data.status === "1") {
        const errorMessage =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || data.message || "An error occurred!";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else if (data.status === "2") {
        const warningMessage =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || data.message || "Warning: Please check your input!";
        toast.warning(warningMessage);
        return rejectWithValue(warningMessage);
      }
    } catch (error) {
      const errorMessage =
        typeof error.message === "object"
          ? JSON.stringify(error.message)
          : error.message || "Unknown error occurred";
      toast.error("Failed to add Employee. Please try again!\n" + errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Employee
export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });
      if (!response.ok) {
        // Handle 400 validation error specifically
        if (response.status === 400) {
          const errorData = await response.json();
          const message =
            typeof errorData.error === "object"
              ? JSON.stringify(errorData.error)
              : errorData.error || errorData.message || "Validation failed!";
          toast.error(message);
          return rejectWithValue(message);
        }

        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json(); // Always parse JSON response first

      // if (!response.ok) {
      //   // Handle 400 validation error specifically
      //   if (response.status === 400) {
      //     toast.error(
      //       responseData.error || "Validation failed! Please check your input."
      //     );
      //     return rejectWithValue(responseData.error || responseData.message);
      //   }
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      // Handle API response based on status field
      if (responseData.status === "0") {
        toast.success(responseData.message || "Employee updated successfully!");
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
      toast.error("Failed to update Employee. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);

// Delete Employee
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status) {
        toast.success("Employee deleted successfully!");
        return id;
      } else {
        throw new Error(responseData.message || "Failed to delete data.");
      }
    } catch (error) {
      toast.error("Failed to delete Employee. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);
