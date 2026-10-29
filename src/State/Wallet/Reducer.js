const initialState = {
  wallet: null,
  loading: false,
  error: null,

  withdrawals: [],
  withdrawalsLoading: false,
  withdrawalSubmitting: false,
  withdrawalError: null,

  adminWithdrawals: [],
  adminWithdrawalsLoading: false,

  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_WALLET_REQUEST":
    case "WALLET_TRANSFER_REQUEST":
    case "PAY_ORDER_REQUEST":
    case "DEPOSIT_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_WALLET_SUCCESS":
    case "WALLET_TRANSFER_SUCCESS":
    case "PAY_ORDER_SUCCESS":
    case "DEPOSIT_SUCCESS":
      return { ...state, loading: false, error: null, wallet: action.payload };

    case "GET_WALLET_FAILURE":
    case "WALLET_TRANSFER_FAILURE":
    case "PAY_ORDER_FAILURE":
    case "DEPOSIT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "GET_WITHDRAWALS_REQUEST":
      return { ...state, withdrawalsLoading: true, withdrawalError: null };
    case "GET_WITHDRAWALS_SUCCESS":
      return { ...state, withdrawalsLoading: false, withdrawals: action.payload };
    case "GET_WITHDRAWALS_FAILURE":
      return { ...state, withdrawalsLoading: false, withdrawalError: action.payload };

    case "WITHDRAWAL_REQUEST":
      return { ...state, withdrawalSubmitting: true, withdrawalError: null };
    case "WITHDRAWAL_SUCCESS":
      return { ...state, withdrawalSubmitting: false, withdrawalError: null };
    case "WITHDRAWAL_FAILURE":
      return { ...state, withdrawalSubmitting: false, withdrawalError: action.payload };

    case "ADMIN_WITHDRAWALS_REQUEST":
      return { ...state, adminWithdrawalsLoading: true };
    case "ADMIN_WITHDRAWALS_SUCCESS":
      return { ...state, adminWithdrawalsLoading: false, adminWithdrawals: action.payload };
    case "ADMIN_WITHDRAWALS_FAILURE":
      return { ...state, adminWithdrawalsLoading: false };

    case "GET_TRANSACTIONS_REQUEST":
      return { ...state, transactionsLoading: true, transactionsError: null };
    case "GET_TRANSACTIONS_SUCCESS":
      return { ...state, transactionsLoading: false, transactions: action.payload };
    case "GET_TRANSACTIONS_FAILURE":
      return { ...state, transactionsLoading: false, transactionsError: action.payload };

    default:
      return state;
  }
};

export default walletReducer;
