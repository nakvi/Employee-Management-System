import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct
// Define an Endpoint of API
// const API_ENDPOINT = "http://192.168.18.65:8001/ems/empLocationTransfer/";
const API_ENDPOINT = `${config.api.API_URL}empLocationTransfer/`;

export const getEmployeeLocationTransfer = createAsyncThunk("employeeLocationTransfer/getEmployeeLocationTransfer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status === "0") {
        // Success: Return the data
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
      toast.error("Failed to fetch Employee Location Transfer. Please try again!");
      // Pass the error to the rejected action payload
      return rejectWithValue(error.message);
    }
  }
);
// Submit Salary Increment
export const submitEmployeeLocationTransfer =createAsyncThunk("employeeLocationTransfer/submitEmployeeLocationTransfer", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    toast.success(data.message || "Employee Location Transfer added successfully!");
    return data.data; // Return the newly created Designation
  } catch (error) {
    toast.error("Failed to add  Employee LocationTransfer. Please try again!");
    return rejectWithValue(error.message);
  }
}
);

// Update Employee
export const updateEmployeeLocationTransfer = createAsyncThunk("employeeLocationTransfer/updateEmployeeLocationTransfer",async ( groupData,{ rejectWithValue}) =>{
  try{
    const response= await fetch(`${API_ENDPOINT}`,{
      method : "PUT",
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify(groupData),
    });
    
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const  responseData = await response.json();
    toast.success(data.message || "Employee Location Transfer updated successfully!");
    return responseData.data; // Assuming the updated data is in 'data'

  } catch(error) {
    toast.error("Failed to update Employee Location Transfer. Please try again!");
    return rejectWithValue(error.message);
  }
})

// Delete Employee
export const deleteEmployeeLocationTransfer =createAsyncThunk("employeeLocationTransfer/deleteEmployeeLocationTransfer", async(id, { rejectWithValue}) => {
  try{
    const response =await fetch(`${API_ENDPOINT}`, {
      method: "DELETE",
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify({ id }),
    });
    
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const responseData = await response.json();
    if (responseData.status) {
      toast.success("Employee Location Transfer deleted successfully!");
      return id; 
    } else {
      throw new Error(responseData.message || "Failed to delete data.");
    }

  } catch(error) {
    toast.error("Failed to delete Employee Location Transfer. Please try again!");
    return rejectWithValue(error.message);
  }
});