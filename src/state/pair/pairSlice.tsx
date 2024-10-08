import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenPair } from "../../types/tokenPair";
import { TokenInterfaceReduce } from "../../types/token";
import { PairInterface } from "../../types/pair";
const token1: TokenInterfaceReduce = {
  name: "Token",
  symbol: "TKN",
  address: "0x",
};

const token2: TokenInterfaceReduce = {
  name: "Token",
  symbol: "TKN",
  address: "0x",
};

// Initial state
const initialState = {
  pair: {
    id: "pair1",
    combinedSymbol: "TKN-TKN",
    token0: token1,
    token1: token2,
  } as PairInterface,
};

const pairSlice = createSlice({
  name: "pair",
  initialState,
  reducers: {
    setPair: (
      state,
      action: PayloadAction<{
        pairId: string;
        combinedSymbol: string;
        token0Name: string;
        token0Address: string;
        token0Symbol: string;
        token1Name: string;
        token1Address: string;
        token1Symbol: string;
      }>,
    ) => {
      const pairId = action.payload.pairId;
      const combinedSymbol = action.payload.combinedSymbol;
      const token0Address = action.payload.token0Address;
      const token1Address = action.payload.token1Address;
      const token0Symbol = action.payload.token0Symbol;
      const token1Symbol = action.payload.token1Symbol;
      const token0Name = action.payload.token0Name;
      const token1Name = action.payload.token1Name;
      
      state.pair.id = pairId;
      state.pair.combinedSymbol = combinedSymbol;
      state.pair.token0.address = token0Address;
      state.pair.token1.address = token1Address;
      state.pair.token0.symbol = token0Symbol;
      state.pair.token1.symbol = token1Symbol;
      state.pair.token0.name = token0Name;
      state.pair.token1.name = token1Name;
    },
  },
});

export const { setPair } = pairSlice.actions;
export default pairSlice.reducer;
