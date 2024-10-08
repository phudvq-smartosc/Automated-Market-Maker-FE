import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountState } from "../../types/accountState";


const initialState: AccountState = {
    connected: false,
    accountAddress: null,
    chainId: null,
    accountNo: -1
}
const metamaskSlice = createSlice({
    name: "metamask",
    initialState,
    reducers: {// NOTE: BY CASE
        setAccount: (state, action: PayloadAction<string | null>) => {
            state.accountAddress = action.payload
        },
        setChainId: (state, action: PayloadAction<string | null>) => {
            state.chainId = action.payload
        },
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload
        }

    }
})

export const { setAccount, setChainId, setConnected } = metamaskSlice.actions;
export default metamaskSlice.reducer 