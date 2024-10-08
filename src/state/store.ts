import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/counterSlice'
import tokenPairReducer from './tokenPair/tokenPairSlice'
import pairReducer from './pair/pairSlice'
import networkReducer from './blockchain/networkSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        tokenPair: tokenPairReducer,
        network: networkReducer,
        pair: pairReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
})

//NOTE: return type of helper util of type of store.getState
// => Anytime need to select using the selector => Use RootState
export type RootState = ReturnType<typeof store.getState>
// For asynchronous
export type AppDispatch = typeof store.dispatch