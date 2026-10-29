import api from "@/api/axios";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_TWO_STEP_REQUEST,
  LOGIN_TWO_STEP_SUCCESS,
  LOGIN_TWO_STEP_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  SEND_VERIFICATION_OTP_REQUEST,
  SEND_VERIFICATION_OTP_SUCCESS,
  SEND_VERIFICATION_OTP_FAILURE,
  ENABLE_TWO_STEP_AUTH_REQUEST,
  ENABLE_TWO_STEP_AUTH_SUCCESS,
  ENABLE_TWO_STEP_AUTH_FAILURE,
  SEND_RESET_PASSWORD_REQUEST,
  SEND_RESET_PASSWORD_SUCCESS,
  SEND_RESET_PASSWORD_FAILURE,
  VERIFY_RESET_PASSWORD_REQUEST,
  VERIFY_RESET_PASSWORD_SUCCESS,
  VERIFY_RESET_PASSWORD_FAILURE,
  LOGOUT,
} from "./ActionsType";

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await api.post("/auth/signup", userData);
    const data = response.data;
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
    }
    dispatch({ type: REGISTER_SUCCESS, payload: data });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Registration failed";
    dispatch({ type: REGISTER_FAILURE, payload: message });
    throw error;
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await api.post("/auth/signin", userData);
    const data = response.data;
    const isTwoFactor = data.twoFactorAuthEnabled || data.isTwoFactorAuthEnabled;

    if (isTwoFactor) {
      dispatch({
        type: LOGIN_TWO_STEP_SUCCESS,
        payload: {
          session: data.session,
          message: data.message,
        },
      });
      return { twoFactor: true, session: data.session };
    }

    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      dispatch({ type: LOGIN_SUCCESS, payload: data });
    }
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Login failed";
    dispatch({ type: LOGIN_FAILURE, payload: message });
    throw error;
  }
};

export const verifyTwoFactorOtp = (otp, sessionId) => async (dispatch) => {
  dispatch({ type: LOGIN_TWO_STEP_REQUEST });
  try {
    const response = await api.post(`/auth/two-factor/otp/${otp}?id=${sessionId}`);
    const data = response.data;
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      dispatch({ type: LOGIN_SUCCESS, payload: data });
    }
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Invalid OTP";
    dispatch({ type: LOGIN_TWO_STEP_FAILURE, payload: message });
    throw error;
  }
};

export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const response = await api.get("/api/users/profile");
    dispatch({ type: GET_USER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: GET_USER_FAILURE, payload: message });
    throw error;
  }
};

export const sendVerificationOtp = (verificationType = "EMAIL") => async (dispatch) => {
  dispatch({ type: SEND_VERIFICATION_OTP_REQUEST });
  try {
    const response = await api.post(`/api/users/verification/${verificationType}/send-otp`);
    dispatch({ type: SEND_VERIFICATION_OTP_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: SEND_VERIFICATION_OTP_FAILURE, payload: message });
    throw error;
  }
};

export const enableTwoFactor = (otp) => async (dispatch) => {
  dispatch({ type: ENABLE_TWO_STEP_AUTH_REQUEST });
  try {
    const response = await api.patch(`/api/users/enable-two-factor/verify-otp/${otp}`);
    dispatch({ type: ENABLE_TWO_STEP_AUTH_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to verify OTP";
    dispatch({ type: ENABLE_TWO_STEP_AUTH_FAILURE, payload: message });
    throw error;
  }
};

export const sendForgotPasswordOtp = (data) => async (dispatch) => {
  dispatch({ type: SEND_RESET_PASSWORD_REQUEST });
  try {
    const response = await api.post("/auth/users/reset-password/send-otp", data);
    dispatch({ type: SEND_RESET_PASSWORD_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: SEND_RESET_PASSWORD_FAILURE, payload: message });
    throw error;
  }
};

export const resetPassword = (id, data) => async (dispatch) => {
  dispatch({ type: VERIFY_RESET_PASSWORD_REQUEST });
  try {
    const response = await api.patch(`/auth/users/reset-password/verify-otp?id=${id}`, data);
    dispatch({ type: VERIFY_RESET_PASSWORD_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: VERIFY_RESET_PASSWORD_FAILURE, payload: message });
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT });
};
