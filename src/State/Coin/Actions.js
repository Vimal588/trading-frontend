import api from "@/api/axios";
import {
  GET_COINLIST_REQUEST,
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

export const getCoinList = (page = 1) => async (dispatch) => {
  dispatch({ type: GET_COINLIST_REQUEST });
  try {
    const { data } = await api.get("/coins", { params: { page } });
    dispatch({ type: GET_COINLIST_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: GET_COINLIST_FAILURE, payload: msg });
    throw error;
  }
};

export const getTop50Coins = () => async (dispatch) => {
  dispatch({ type: GET_TOP50_REQUEST });
  try {
    const { data } = await api.get("/coins/top50");
    dispatch({ type: GET_TOP50_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: GET_TOP50_FAILURE, payload: msg });
    throw error;
  }
};

export const getTrendingCoins = () => async (dispatch) => {
  dispatch({ type: GET_TRENDING_REQUEST });
  try {
    // Note: Backend endpoint is spelled /coins/treading
    const { data } = await api.get("/coins/treading");
    dispatch({ type: GET_TRENDING_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: GET_TRENDING_FAILURE, payload: msg });
    throw error;
  }
};

export const getMarketChart = (coinId, days) => async (dispatch) => {
  dispatch({ type: GET_MARKET_CHART_REQUEST });
  try {
    const { data } = await api.get(`/coins/${coinId}/chart`, {
      params: { days },
    });
    dispatch({ type: GET_MARKET_CHART_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: GET_MARKET_CHART_FAILURE, payload: msg });
    throw error;
  }
};

export const searchCoin = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_COIN_REQUEST });
  try {
    const { data } = await api.get("/coins/search", {
      params: { q: keyword },
    });
    dispatch({ type: SEARCH_COIN_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: SEARCH_COIN_FAILURE, payload: msg });
    throw error;
  }
};

export const getCoinDetails = (coinId) => async (dispatch) => {
  dispatch({ type: GET_COIN_DETAILS_REQUEST });
  try {
    const { data } = await api.get(`/coins/details/${coinId}`);
    dispatch({ type: GET_COIN_DETAILS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: GET_COIN_DETAILS_FAILURE, payload: msg });
    throw error;
  }
};
