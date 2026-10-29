const initialState = {
  watchlist: null,
  items: [],
  loading: false,
  error: null,
};

const watchlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_WATCHLIST_REQUEST":
    case "TOGGLE_WATCHLIST_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_WATCHLIST_SUCCESS":
      return {
        ...state,
        loading: false,
        watchlist: action.payload,
        items: action.payload?.coins || [],
      };

    case "TOGGLE_WATCHLIST_SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "GET_WATCHLIST_FAILURE":
    case "TOGGLE_WATCHLIST_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default watchlistReducer;
