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
  ENABLE_TWO_STEP_AUTH_SUCCESS,
  LOGOUT,
} from "./ActionsType";

const initialState = {
  user: null,
  jwt: localStorage.getItem("jwt") || null,
  loading: false,
  error: null,
  twoFactorSession: null,
  twoFactorMessage: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case LOGIN_TWO_STEP_REQUEST:
    case GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        jwt: action.payload.jwt,
        twoFactorSession: null,
        twoFactorMessage: null,
      };

    case LOGIN_TWO_STEP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        twoFactorSession: action.payload.session,
        twoFactorMessage: action.payload.message,
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
      };

    case ENABLE_TWO_STEP_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case LOGIN_TWO_STEP_FAILURE:
    case GET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      return {
        ...initialState,
        jwt: null,
        user: null,
      };

    default:
      return state;
  }
};

export default authReducer;
