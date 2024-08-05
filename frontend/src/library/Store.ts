import { configureStore } from "@reduxjs/toolkit";
import { notesAPISlice } from '../api/notesAPISlice';
import { userAPISlice } from '../api/userAPISlice';

export const store = configureStore({
    reducer: {
        [notesAPISlice.reducerPath]: notesAPISlice.reducer,
        [userAPISlice.reducerPath]: userAPISlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(notesAPISlice.middleware, userAPISlice.middleware),
});