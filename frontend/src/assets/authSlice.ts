import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../library/Store';

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        isUserAuth: false,
        user: null,
        accessToken: null,
        refreshToken: null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.isUserAuth = true;
            state.user = action.payload;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logoutSuccess: (state) => {
            state.isUserAuth = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

// Selector functions to access user information
export const isAuthenticated = (state: RootState) => state.auth.isUserAuth;

export default authSlice.reducer;