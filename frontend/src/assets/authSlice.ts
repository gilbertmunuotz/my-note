import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../library/Store';
import { AuthResponse } from '../Interfaces/Interfaces';

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        isUserAuth: false,
        user: null,
        accessToken: null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.isUserAuth = true;
            state.user = action.payload;
            state.accessToken = action.payload.accessToken;
        },
        logoutSuccess: (state) => {
            state.isUserAuth = false;
            state.user = null;
            state.accessToken = null;
        },
    },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

// Selector functions to access user information
export const isAuthenticated = (state: RootState) => state.auth.isUserAuth; // Auth State Selector
export const user = (state: RootState): AuthResponse | null => state.auth.user; // User Info Selector

export default authSlice.reducer;