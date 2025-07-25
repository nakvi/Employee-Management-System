import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config"; // ✅ correct

const API_ENDPOINT = `${config.api.API_URL}configuration/`;

// Fetch configuration data
export const getConfiguration = createAsyncThunk(
    "configuration/getConfiguration",
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
            toast.error("Failed to fetch Configuration. Please try again!");
            // Pass the error to the rejected action payload
            return rejectWithValue(error.message);
        }
    }
);

// Update configuration data
export const updateConfiguration = createAsyncThunk(
    "configuration/updateConfiguration",
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
                if (response.status === 400) {
                    const errorData = await response.json();
                    const message = errorData.error || data.message || "Validation failed!";
                    toast.error(message);
                    return rejectWithValue(message);
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === "0") {
                toast.success(data.message || "Configuration updated successfully!");
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
            toast.error("Failed to update Configuration. Please try again!\n" + errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);