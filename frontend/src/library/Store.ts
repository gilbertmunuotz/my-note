import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import { notesAPISlice } from '../api/notesAPISlice';
import { userAPISlice } from '../api/userAPISlice';
import authReducer from '../assets/authSlice';


// Persist configuration for auth slice
const authPersistConfig = {
    key: 'auth',
    storage,
    version: 1,
};

// Combine reducers into a single reducer object.
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer), // Only persist the auth slice
    [notesAPISlice.reducerPath]: notesAPISlice.reducer,
    [userAPISlice.reducerPath]: userAPISlice.reducer,
});


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            },
        }).concat(notesAPISlice.middleware, userAPISlice.middleware,),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// Create and export persistor for the store
export const persistor = persistStore(store);