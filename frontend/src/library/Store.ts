import { configureStore } from "@reduxjs/toolkit";
import { notesAPISlice } from '../api/notesAPISlice';

export const store = configureStore({
    reducer: {
        [notesAPISlice.reducerPath]: notesAPISlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(notesAPISlice.middleware),
});