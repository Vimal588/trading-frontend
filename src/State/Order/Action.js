import api from "@/api/axios";

export const payOrder = (orderData) => async (dispatch) => {
  dispatch({ type: "PAY_ORDER_REQUEST" });
  try {
    const { data } = await api.post("/api/orders/pay", orderData);
    dispatch({ type: "PAY_ORDER_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Failed to process order";
    dispatch({ type: "PAY_ORDER_FAILURE", payload: msg });
    throw error;
  }
};

export const getAllOrders = (orderType, assetSymbol) => async (dispatch) => {
  dispatch({ type: "GET_ALL_ORDERS_REQUEST" });
  try {
    const params = {};
    if (orderType) params.order_type = orderType;
    if (assetSymbol) params.asset_symbol = assetSymbol;

    const { data } = await api.get("/api/orders", { params });
    dispatch({ type: "GET_ALL_ORDERS_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: "GET_ALL_ORDERS_FAILURE", payload: msg });
    throw error;
  }
};

export const getOrderById = (orderId) => async (dispatch) => {
  dispatch({ type: "GET_ORDER_BY_ID_REQUEST" });
  try {
    const { data } = await api.get(`/api/orders/${orderId}`);
    dispatch({ type: "GET_ORDER_BY_ID_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: "GET_ORDER_BY_ID_FAILURE", payload: msg });
    throw error;
  }
};
