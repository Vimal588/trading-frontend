const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  submitting: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_ORDERS_REQUEST":
    case "GET_ORDER_BY_ID_REQUEST":
      return { ...state, loading: true, error: null };

    case "PAY_ORDER_REQUEST":
      return { ...state, submitting: true, error: null };

    case "GET_ALL_ORDERS_SUCCESS":
      return { ...state, loading: false, orders: action.payload };

    case "GET_ORDER_BY_ID_SUCCESS":
      return { ...state, loading: false, currentOrder: action.payload };

    case "PAY_ORDER_SUCCESS":
      return {
        ...state,
        submitting: false,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
      };

    case "GET_ALL_ORDERS_FAILURE":
    case "GET_ORDER_BY_ID_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "PAY_ORDER_FAILURE":
      return { ...state, submitting: false, error: action.payload };

    default:
      return state;
  }
};

export default orderReducer;
