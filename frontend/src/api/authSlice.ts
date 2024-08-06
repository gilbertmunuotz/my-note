import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../library/Store';

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        isUserAuth: false,
        user: null
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.isUserAuth = true;
            state.user = action.payload;
        },
        logoutSuccess: (state) => {
            state.isUserAuth = false;
            state.user = null;
        },
    },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

// Selector functions to access user information
export const isAuthenticated = (state: RootState) => state.auth.isUserAuth;

export default authSlice.reducer;