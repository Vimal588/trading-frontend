import api from "@/api/axios";

// POST /api/payment/{paymentMethod}/amount/{amount}
// paymentMethod must be "RAZORPAY" | "STRIPE"
export const createPaymentOrder = (paymentMethod, amount) => async (dispatch) => {
  dispatch({ type: "CREATE_PAYMENT_REQUEST" });
  try {
    const wholeAmount = Math.round(Number(amount));
    const { data } = await api.post(
      `/api/payment/${paymentMethod}/amount/${wholeAmount}`
    );
    dispatch({ type: "CREATE_PAYMENT_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({
      type: "CREATE_PAYMENT_FAILURE",
      payload: msg,
    });
    throw error;
  }
};

// GET /api/payment-details
export const getPaymentDetails = () => async (dispatch) => {
  dispatch({ type: "GET_PAYMENT_DETAILS_REQUEST" });
  try {
    const { data } = await api.get("/api/payment-details");
    dispatch({ type: "GET_PAYMENT_DETAILS_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: "GET_PAYMENT_DETAILS_FAILURE", payload: msg });
    throw error;
  }
};

// POST /api/payment-details
export const addPaymentDetails = (details) => async (dispatch) => {
  dispatch({ type: "ADD_PAYMENT_DETAILS_REQUEST" });
  try {
    const { data } = await api.post("/api/payment-details", details);
    dispatch({ type: "ADD_PAYMENT_DETAILS_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: "ADD_PAYMENT_DETAILS_FAILURE", payload: msg });
    throw error;
  }
};
