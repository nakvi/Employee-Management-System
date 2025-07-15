import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";
import { resetPaymentPlan } from "./reducer";


const API_ENDPOINT = `${config.api.API_URL}paymentPlanFillGrid`;

// export const getPaymentPlan = createAsyncThunk(
//   "paymentPlan/getPaymentPlan",
//   async (params, { rejectWithValue }) => {
//     try {
//       const queryString = new URLSearchParams(params).toString();
//       console.log("P",queryString);
//       const response = await fetch(`${API_ENDPOINT}?${queryString}`);
      
//       console.log("response from:", response);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("HTTP Error:", response.status, errorText);
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }
//       const data = await response.json();
//       return data || [];
     
//     } catch (error) {
//       console.error("API Error:", error);
//       toast.error(`Failed to fetch Payment Plan data: ${error.message}`);
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const getPaymentPlan = createAsyncThunk(
  "paymentPlan/getPaymentPlan",
  async (params, { rejectWithValue }) => {
    try {
      const {
        Orgini,
        VDate,
        EmployeeIDList,
        CompanyID,
        LocationID,
        ETypeID,
        EmpID,
        IsAu,
        IsExport,
        UID,
      } = params;

      // Manually construct the query string, ensuring EmployeeIDList is not encoded
      const queryString = [
        `Orgini=${encodeURIComponent(Orgini)}`,
        `VDate=${encodeURIComponent(VDate)}`,
        `EmployeeIDList=${EmployeeIDList}`, // Do NOT encode EmployeeIDList
        `CompanyID=${encodeURIComponent(CompanyID)}`,
        `LocationID=${encodeURIComponent(LocationID)}`,
        `ETypeID=${encodeURIComponent(ETypeID)}`,
        `EmpID=${encodeURIComponent(EmpID)}`,
        `IsAu=${encodeURIComponent(IsAu)}`,
        `IsExport=${encodeURIComponent(IsExport)}`,
        `UID=${encodeURIComponent(UID)}`,
      ].join("&");

      console.log("Constructed Query String:", queryString);
      const response = await fetch(`${API_ENDPOINT}?${queryString}`);

      console.log("API Response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Data:", data);
      return data || [];
    } catch (error) {
      console.error("API Error:", error);
      toast.error(`Failed to fetch Payment Plan data: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);
export const postPaymentPlan= createAsyncThunk(
  "paymentPlan/postPaymentPlan",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("Posting to:", API_ENDPOINT, "with payload:", JSON.stringify(payload, null, 2));
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
      console.log("Post API Response:", JSON.stringify(data, null, 2));

      if (Array.isArray(data) && data.length > 0 && data[0].status === "200") {
        toast.success(data[0].msg || "Payment Plan saved successfully.");
        return data;
      } else {
        const errorMessage = data[0]?.msg || "Failed to save attendance change.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      console.error("Post API Error:", error);
      toast.error(`Failed to save attendance change: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export { resetPaymentPlan};