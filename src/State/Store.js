import { combineReducers, legacy_createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Auth/Reducer";
import coinReducer from "./Coin/Reducer";
import walletReducer from "./Wallet/Reducer";
import paymentReducer from "./Payment/Reducer";
import orderReducer from "./Order/Reducer";
import assetReducer from "./Asset/Reducer";
import watchlistReducer from "./Watchlist/Reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  coin: coinReducer,
  wallet: walletReducer,
  payment: paymentReducer,
  order: orderReducer,
  asset: assetReducer,
  watchlist: watchlistReducer,
});

export const store = legacy_createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
