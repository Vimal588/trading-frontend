const initialState = {
  paymentResponse: null,
  paymentDetails: null,
  loading: false,
  error: null,
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_PAYMENT_REQUEST":
    case "GET_PAYMENT_DETAILS_REQUEST":
    case "ADD_PAYMENT_DETAILS_REQUEST":
      return { ...state, loading: true, error: null };

    case "CREATE_PAYMENT_SUCCESS":
      return { ...state, loading: false, paymentResponse: action.payload };

    case "GET_PAYMENT_DETAILS_SUCCESS":
    case "ADD_PAYMENT_DETAILS_SUCCESS":
      return { ...state, loading: false, paymentDetails: action.payload };

    case "CREATE_PAYMENT_FAILURE":
    case "GET_PAYMENT_DETAILS_FAILURE":
    case "ADD_PAYMENT_DETAILS_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default paymentReducer;
