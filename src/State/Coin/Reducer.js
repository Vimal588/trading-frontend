import {
  GET_COINLIST_REQUEST,   // ✅ correct name
  GET_COINLIST_SUCCESS,
  GET_COINLIST_FAILURE,
  GET_TOP50_REQUEST,
  GET_TOP50_SUCCESS,
  GET_TOP50_FAILURE,
  GET_TRENDING_REQUEST,
  GET_TRENDING_SUCCESS,
  GET_TRENDING_FAILURE,
  GET_MARKET_CHART_REQUEST,
  GET_MARKET_CHART_SUCCESS,
  GET_MARKET_CHART_FAILURE,
  SEARCH_COIN_REQUEST,
  SEARCH_COIN_SUCCESS,
  SEARCH_COIN_FAILURE,
  GET_COIN_DETAILS_REQUEST,
  GET_COIN_DETAILS_SUCCESS,
  GET_COIN_DETAILS_FAILURE,
} from "./ActionType";
const initialState = {
  coinList: [],
  top50: [],
  trending: [],
  marketChart: null,
  searchResults: [],
  coinDetails: null,
  loading: false,
  error: null,
};
const coinReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COINLIST_REQUEST:   // use the imported constant, not a string literal
    case GET_TOP50_REQUEST:
    case GET_TRENDING_REQUEST:
    case GET_MARKET_CHART_REQUEST:
    case SEARCH_COIN_REQUEST:
    case GET_COIN_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_COINLIST_SUCCESS:
      return { ...state, loading: false, error: null, coinList: action.payload };

    case GET_TOP50_SUCCESS:
      return { ...state, loading: false, top50: action.payload };

    case GET_TRENDING_SUCCESS:
      return { ...state, loading: false, trending: action.payload };

    case GET_MARKET_CHART_SUCCESS:
      return { ...state, loading: false, marketChart: action.payload };

    case SEARCH_COIN_SUCCESS:
      return { ...state, loading: false, searchResults: action.payload };

    case GET_COIN_DETAILS_SUCCESS:
      return { ...state, loading: false, coinDetails: action.payload };

    case GET_COINLIST_FAILURE:
    case GET_TOP50_FAILURE:
    case GET_TRENDING_FAILURE:
    case GET_MARKET_CHART_FAILURE:
    case SEARCH_COIN_FAILURE:
    case GET_COIN_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default coinReducer;