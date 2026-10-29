const initialState = {
  userAssets: [],
  assetDetails: null,
  coinAsset: null,
  loading: false,
  error: null,
};

const assetReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_ASSETS_REQUEST":
    case "GET_ASSET_BY_ID_REQUEST":
    case "GET_ASSET_BY_COIN_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_USER_ASSETS_SUCCESS":
      return { ...state, loading: false, userAssets: action.payload };

    case "GET_ASSET_BY_ID_SUCCESS":
      return { ...state, loading: false, assetDetails: action.payload };

    case "GET_ASSET_BY_COIN_SUCCESS":
      return { ...state, loading: false, coinAsset: action.payload };

    case "GET_USER_ASSETS_FAILURE":
    case "GET_ASSET_BY_ID_FAILURE":
    case "GET_ASSET_BY_COIN_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default assetReducer;
