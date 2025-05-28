// slices/setup/allowanceDeductionDetails/thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";

const API_ENDPOINT = `${config.api.API_URL}allowDedByCat/`; 

export const getAllowanceDeductionDetails = createAsyncThunk(
  "allowanceDeductionDetails/getAllowanceDeductionDetails",
  async ({ VType, GroupID }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ENDPOINT}?Vtype=${VType}&GroupID=${GroupID}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status === "0") {
        return data.data;
      } else if (data.status === "1") {
        toast.error("An error occurred while fetching allowance deduction details.");
        return rejectWithValue("An error occurred while fetching data.");
      } else if (data.status === "2") {
        toast.warn("Warning: Data may not be complete.");
        return rejectWithValue("Warning: Data may not be complete.");
      }
    } catch (error) {
      toast.error("Failed to fetch Allowance Deduction Details. Please try again!");
      return rejectWithValue(error.message);
    }
  }
);