import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AccountState {
    connected: boolean;
    accountAddress: string | null;
    chainId: string | null
    // accountNo: number;
}

const initialState: AccountState = {
    connected: false,
    accountAddress: null,
    chainId: null
}
const metamaskSlice = createSlice({
    name: "metamask",
    initialState,
    reducers: {
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