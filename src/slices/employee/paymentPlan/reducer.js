import { createSlice } from "@reduxjs/toolkit";
import { getPaymentPlan, postPaymentPlan } from "./thunk";

export const initialState = {
  paymentPlan: [],
  loading: false,
  error: null,
  postLoading: false,
  postError: null,
};

const PaymentPlanSlice = createSlice({
  name: "paymentPlan",
  initialState,
  reducers: {
    resetPaymentPlan: (state) => {
      state.paymentPlan = [];
      state.error = null;
      state.loading = false;
      state.postError = null;
      state.postLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentPlan = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPaymentPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
        state.paymentPlan = [];
      })
      .addCase(postPaymentPlan.pending, (state) => {
        state.postLoading = true;
        state.postError = null;
      })
      .addCase(postPaymentPlan.fulfilled, (state, action) => {
        state.postLoading = false;
        // Optionally update paymentPlan if needed based on API response
      })
      .addCase(postPaymentPlan.rejected, (state, action) => {
        state.postLoading = false;
        state.postError = action.error.message || "Something went wrong";
      });
  },
});

export const { resetPaymentPlan } = PaymentPlanSlice.actions;
export default PaymentPlanSlice.reducer;