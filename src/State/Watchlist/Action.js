import api from "@/api/axios";

export const getUserWatchlist = () => async (dispatch) => {
  dispatch({ type: "GET_WATCHLIST_REQUEST" });
  try {
    const { data } = await api.get("/api/watchlist/user");
    dispatch({ type: "GET_WATCHLIST_SUCCESS", payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: "GET_WATCHLIST_FAILURE", payload: msg });
    throw error;
  }
};

export const toggleWatchlist = (coinId) => async (dispatch) => {
  dispatch({ type: "TOGGLE_WATCHLIST_REQUEST" });
  try {
    const { data } = await api.patch(`/api/watchlist/add/coin/${coinId}`);
    dispatch({ type: "TOGGLE_WATCHLIST_SUCCESS", payload: data });
    // Re-fetch watchlist to ensure synchronized list
    dispatch(getUserWatchlist());
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: "TOGGLE_WATCHLIST_FAILURE", payload: msg });
    throw error;
  }
};
