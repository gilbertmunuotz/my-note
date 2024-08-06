import { configureStore } from "@reduxjs/toolkit";
import { notesAPISlice } from '../api/notesAPISlice';
import { userAPISlice } from '../api/userAPISlice';
import authReducer from '../api/authSlice';

export const store = configureStore({
    reducer: {
        [notesAPISlice.reducerPath]: notesAPISlice.reducer,
        [userAPISlice.reducerPath]: userAPISlice.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(notesAPISlice.middleware, userAPISlice.middleware,),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;