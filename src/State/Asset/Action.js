import api from "@/api/axios";

export const getUserAssets = () => async (dispatch) => {
  dispatch({ type: "GET_USER_ASSETS_REQUEST" });
  try {
    const { data } = await api.get("/api/asset");
    dispatch({ type: "GET_USER_ASSETS_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: "GET_USER_ASSETS_FAILURE", payload: msg });
    throw error;
  }
};

export const getAssetById = (assetId) => async (dispatch) => {
  dispatch({ type: "GET_ASSET_BY_ID_REQUEST" });
  try {
    const { data } = await api.get(`/api/asset/${assetId}`);
    dispatch({ type: "GET_ASSET_BY_ID_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: "GET_ASSET_BY_ID_FAILURE", payload: msg });
    throw error;
  }
};

export const getAssetByCoinAndUser = (coinId) => async (dispatch) => {
  dispatch({ type: "GET_ASSET_BY_COIN_REQUEST" });
  try {
    const { data } = await api.get(`/api/asset/coin/${coinId}/user`);
    dispatch({ type: "GET_ASSET_BY_COIN_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: "GET_ASSET_BY_COIN_FAILURE", payload: msg });
    throw error;
  }
};
