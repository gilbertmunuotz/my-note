import { configureStore } from "@reduxjs/toolkit";
import { notesAPISlice } from '../app/APISlice';

export const store = configureStore({
    reducer: {
        [notesAPISlice.reducerPath]: notesAPISlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(notesAPISlice.middleware),
});