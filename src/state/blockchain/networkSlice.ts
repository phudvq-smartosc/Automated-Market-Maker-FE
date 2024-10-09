import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contract, ethers } from "ethers";
import { Network } from '../../types/network';


const initialState: Network = {
  provider: null,
  signer: null,
  account: null,
  coins: [],
  chainID: null,
  router: null,
  factory: null,
  weth: null,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<ethers.providers.Web3Provider | null>) => {
      state.provider = action.payload;
    },
    setSigner: (state, action: PayloadAction<ethers.Signer | null>) => {
      state.signer = action.payload;
    },
    setAccount: (state, action: PayloadAction<string | null>) => {
      state.account = action.payload;
    },
    setCoins: (state, action: PayloadAction<string[]>) => {
      state.coins = action.payload;
    },
    setChainID: (state, action: PayloadAction<number | null>) => {
      state.chainID = action.payload;
    },
    setRouter: (state, action: PayloadAction<Contract | null>) => {
      state.router = action.payload;
    },
    setFactory: (state, action: PayloadAction<Contract | null>) => {
      state.factory = action.payload;
    },
  },
});

export const {
  setProvider,
  setSigner,
  setAccount,
  setCoins,
  setChainID,
  setRouter,
  setFactory,
} = networkSlice.actions;

export default networkSlice.reducer;