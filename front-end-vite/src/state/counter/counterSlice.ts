//NOTE: Functionality: define 
// 1. init value 
// 2. declare reducers necessary: decrement, increment

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
    value: number;
}

const initialState: CounterState = {
    value: 0,
};

const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state, action) => {
            //NOTE: This behind the scene still do the own copy => overwrite the old value

            state.value += action.payload
        },
        decrement: (state, action) => {
            state.value -= action.payload;
        },
        incrementByAmount: (state, action: PayloadAction<{ value: number }>) => {
            state.value += action.payload.value
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(incrementAsync.pending, () => {
                console.log("incrementAsync.pending");

            })
            .addCase(incrementAsync.fulfilled, (state, action: PayloadAction<number>) => {
                state.value += action.payload;
            });
    }
});


export const incrementAsync = createAsyncThunk<number, number>(
    "counter/incrementAsync",
    async (amount: number) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return amount
    }
)
export const { increment, decrement, incrementByAmount } = counterSlice.actions

//NOTE: Automatically get the reducer behind the scene
export default counterSlice.reducer