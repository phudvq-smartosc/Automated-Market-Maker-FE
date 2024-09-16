import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/counterSlice'
import metamaskReducer from './metamaskAccount/connectMetaMaskAccount'
export const store = configureStore({
    reducer: {
        // NOTE: can have many reducers here
        counter: counterReducer,
        metamask: metamaskReducer
    },
})

//NOTE: return type of helper util of type of store.getState
// => Anytime need to select using the selector => Use RootState
export type RootState = ReturnType<typeof store.getState>
// For asynchronous
export type AppDispatch = typeof store.dispatch