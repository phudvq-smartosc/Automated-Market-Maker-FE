import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenPair } from "../../types/tokenPair";
import { TokenInterface } from "../../types/token";
import { DEFAULT_TOKEN_NAME, DEFAULT_TOKEN_SYMBOL, DEFAULT_TOKEN_IMG_PATH, DEFAULT_TOKEN_ADDRESS, DEFAULT_TOKEN_AMOUNT, DEFAULT_TOKEN_BALANCE} from "../../utils/defaultValue";

const initialState: TokenPair = {
  tokenPairInfo: [
    {
      tokenInterface: {
        name: DEFAULT_TOKEN_NAME,
        symbol: DEFAULT_TOKEN_SYMBOL,
        img: DEFAULT_TOKEN_IMG_PATH,
        address: DEFAULT_TOKEN_ADDRESS,
        balance: DEFAULT_TOKEN_BALANCE,
      },
      amount: DEFAULT_TOKEN_AMOUNT,
    },
    {
      tokenInterface: {
        name: DEFAULT_TOKEN_NAME,
        symbol: DEFAULT_TOKEN_SYMBOL,
        img: DEFAULT_TOKEN_IMG_PATH,
        address: DEFAULT_TOKEN_ADDRESS,
        balance: DEFAULT_TOKEN_BALANCE,
      },
      amount: DEFAULT_TOKEN_AMOUNT,
    },
  ],
};

const tokenPairSlice = createSlice({
  name: "tokenPair",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{ index: number; token: TokenInterface }>,
    ) => {
      const index = action.payload.index;
      const token: TokenInterface = action.payload.token;
      const otherIndex = index === 0 ? 1 : 0;

      // if (
      //   token.symbol == state.tokenPairInfo[otherIndex].tokenInterface.symbol
      //  && token.symbol != "TKN"

      // ) {
      //   console.log("token.symbol", token.symbol)
      //   console.log("state.tokenPairInfo[otherIndex].tokenInterface.symbol", state.tokenPairInfo[otherIndex].tokenInterface.symbol)
      //   alert("Don't choose same input and output token");
      //   return;
      // }
      state.tokenPairInfo[index].tokenInterface = token;
    },
    setBalance: (
      state,
      action: PayloadAction<{ index: number; balance: string }>,
    ) => {
      const index = action.payload.index;
      state.tokenPairInfo[index].tokenInterface.balance =
        action.payload.balance;
    },
    setAmount: (
      state,
      action: PayloadAction<{ index: number; amount: string }>,
    ) => {
      const index = action.payload.index;
      state.tokenPairInfo[index].amount =
        action.payload.amount;
    },
  },
});

export const { setToken, setBalance, setAmount } = tokenPairSlice.actions;

//NOTE: Automatically get the reducer behind the scene
export default tokenPairSlice.reducer;
