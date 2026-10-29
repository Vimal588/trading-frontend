import api from "@/api/axios";
import {
  GET_WALLET_REQUEST,
  GET_WALLET_SUCCESS,
  GET_WALLET_FAILURE,
  WALLET_TRANSFER_REQUEST,
  WALLET_TRANSFER_SUCCESS,
  WALLET_TRANSFER_FAILURE,
  DEPOSIT_REQUEST,
  DEPOSIT_SUCCESS,
  DEPOSIT_FAILURE,
  GET_TRANSACTIONS_REQUEST,
  GET_TRANSACTIONS_SUCCESS,
  GET_TRANSACTIONS_FAILURE,
  GET_WITHDRAWALS_REQUEST,
  GET_WITHDRAWALS_SUCCESS,
  GET_WITHDRAWALS_FAILURE,
  WITHDRAWAL_REQUEST,
  WITHDRAWAL_SUCCESS,
  WITHDRAWAL_FAILURE,
  ADMIN_WITHDRAWALS_REQUEST,
  ADMIN_WITHDRAWALS_SUCCESS,
  ADMIN_WITHDRAWALS_FAILURE,
  PROCEED_WITHDRAWAL_REQUEST,
  PROCEED_WITHDRAWAL_SUCCESS,
  PROCEED_WITHDRAWAL_FAILURE,
} from "./ActionType";

export const getUserWallet = () => async (dispatch) => {
  dispatch({ type: GET_WALLET_REQUEST });
  try {
    const { data } = await api.get("/api/wallet");
    dispatch({ type: GET_WALLET_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: GET_WALLET_FAILURE, payload: msg });
    throw error;
  }
};

export const addMoneyToWallet = (orderId, paymentId) => async (dispatch) => {
  dispatch({ type: DEPOSIT_REQUEST });
  try {
    const { data } = await api.put("/api/wallet/deposit", null, {
      params: { order_id: orderId, payment_id: paymentId },
    });
    dispatch({ type: DEPOSIT_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: DEPOSIT_FAILURE, payload: msg });
    throw error;
  }
};

export const walletToWalletTransfer = (walletId, reqBody) => async (dispatch) => {
  dispatch({ type: WALLET_TRANSFER_REQUEST });
  try {
    const { data } = await api.put(`/api/wallet/${walletId}/transfer`, reqBody);
    dispatch({ type: WALLET_TRANSFER_SUCCESS, payload: data });
    dispatch(getUserWallet());
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: WALLET_TRANSFER_FAILURE, payload: msg });
    throw error;
  }
};

export const getTransactions = () => async (dispatch) => {
  dispatch({ type: GET_TRANSACTIONS_REQUEST });
  try {
    const { data } = await api.get("/api/transactions");
    dispatch({ type: GET_TRANSACTIONS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: GET_TRANSACTIONS_FAILURE, payload: msg });
    throw error;
  }
};

export const getWithdrawalHistory = () => async (dispatch) => {
  dispatch({ type: GET_WITHDRAWALS_REQUEST });
  try {
    const { data } = await api.get("/api/withdrawal");
    dispatch({ type: GET_WITHDRAWALS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: GET_WITHDRAWALS_FAILURE, payload: msg });
    throw error;
  }
};

export const requestWithdrawal = (amount) => async (dispatch) => {
  dispatch({ type: WITHDRAWAL_REQUEST });
  try {
    const { data } = await api.post(`/api/withdrawal/${amount}`);
    dispatch({ type: WITHDRAWAL_SUCCESS, payload: data });
    await Promise.all([dispatch(getUserWallet()), dispatch(getWithdrawalHistory())]);
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: WITHDRAWAL_FAILURE, payload: msg });
    throw error;
  }
};

export const getAllWithdrawalsAdmin = () => async (dispatch) => {
  dispatch({ type: ADMIN_WITHDRAWALS_REQUEST });
  try {
    const { data } = await api.get("/api/admin/withdrawal");
    dispatch({ type: ADMIN_WITHDRAWALS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: ADMIN_WITHDRAWALS_FAILURE, payload: msg });
    throw error;
  }
};

export const proceedWithdrawalAdmin = (id, accept) => async (dispatch) => {
  dispatch({ type: PROCEED_WITHDRAWAL_REQUEST });
  try {
    const { data } = await api.patch(`/api/admin/withdrawal/${id}/proceed/${accept}`);
    dispatch({ type: PROCEED_WITHDRAWAL_SUCCESS, payload: data });
    dispatch(getAllWithdrawalsAdmin());
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: PROCEED_WITHDRAWAL_FAILURE, payload: msg });
    throw error;
  }
};
