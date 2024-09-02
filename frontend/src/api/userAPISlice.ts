import { BaseQueryFn, FetchBaseQueryError, FetchBaseQueryMeta, FetchArgs, fetchBaseQuery, createApi, BaseQueryApi } from '@reduxjs/toolkit/query/react';
import { RootState } from '../library/Store';
import { SERVER_API } from "../config/constants";
import { Credentials, UserInfo, ProfileInfo, GetOTP, VerifyOTP, ResetPass } from '../Interfaces/Interfaces';
import { refreshTokenSuccess, logoutSuccess } from '../assets/authSlice';
import { isTokenExpired } from '../utilities/Tokenfunc';
import { jwtDecode } from 'jwt-decode';

// Base query without re-auth logic
const baseQuery = fetchBaseQuery({
    baseUrl: `${SERVER_API}/v1/Auth`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const accessToken = state.auth.accessToken;

        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return headers;
    }
});

// Helper function to refresh the token and retry the original request
const refreshTokenAndRetry = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object, oldAccessToken: string) => {

    // Attempt to refresh token
    const refreshResult = await fetch(`${SERVER_API}/v1/Auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${oldAccessToken}` }
    }).then(response => response.json());

    if (refreshResult.accessToken) {
        const newAccessToken = refreshResult.accessToken;

        // Dispatch action to update accessToken in the Redux store
        api.dispatch(refreshTokenSuccess({ accessToken: newAccessToken }));

        const headers = new Headers();
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        const updatedResult = await baseQuery(args, api, { ...extraOptions, headers });

        return updatedResult;
    } else {
        // Refresh failed, handle logout
        api.dispatch(logoutSuccess());
        return { error: { message: 'Failed to refresh token' } as unknown as FetchBaseQueryError };
    }
};


// Custom baseQuery with re-auth logic
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (args, api, extraOptions) => {
    const state = api.getState() as RootState;
    const accessToken = state.auth.accessToken;
    const refreshToken = state.auth.refreshToken;

    // Check if refresh token exists and is expired
    if (refreshToken && isTokenExpired(refreshToken)) {
        window.confirm("Your Session has Expired!. Login Again");
        api.dispatch(logoutSuccess());
        return { error: { message: 'No valid refresh token available' } as unknown as FetchBaseQueryError };
    }

    // Check if access token exists and is expired
    if (accessToken) {
        const decodedToken: { exp: number } = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            // The access token has expired, refresh it immediately
            return await refreshTokenAndRetry(args, api, extraOptions, accessToken);
        } else {
            // Set a timeout to refresh the token just before it expires
            const timeUntilExpiration = decodedToken.exp * 1000 - Date.now();
            if (timeUntilExpiration < 60000) { // Refresh 1 minute before expiration
                setTimeout(async () => {
                    return await refreshTokenAndRetry(args, api, extraOptions, accessToken);
                }, timeUntilExpiration - 10000); // 10 seconds before it expires
            }
        }
    }

    // Continue with the base query if access token is valid
    return baseQuery(args, api, extraOptions);
};

export const userAPISlice = createApi({
    reducerPath: "userAPI",
    tagTypes: ['User'],
    baseQuery: baseQueryWithReauth, // Set the baseQuery to handle reauth logic
    endpoints: (builder) => ({
        // Local Passport Registration (Unauthenticated)
        register: builder.mutation<void, Credentials>({
            query: (credentials) => ({
                url: `/register`,
                method: 'POST',
                body: credentials,
                baseQuery: baseQuery // Use the base query without reauth for registration
            }),
        }),
        // Local Passport Login (Unauthenticated)
        login: builder.mutation<void, UserInfo>({
            query: (userInfo) => ({
                url: `/login`,
                method: 'POST',
                body: userInfo,
                baseQuery: baseQuery // Use the base query without reauth for login
            }),
        }),
        // Local Passport logout (Authenticated)
        logout: builder.mutation<void, void>({
            query: () => ({
                url: `/logout`,
                method: 'DELETE',
            }),
        }),
        // Get User By id (Authenticated)
        getUser: builder.query<ProfileInfo, string>({
            query: (_id) => ({
                url: `/user/${_id}`,
                method: 'GET',
            }),
            providesTags: ['User']
        }),
        // Update User Info (Authenticated)
        updateUser: builder.mutation<void, { _id: string, formData: FormData; }>({
            query: ({ _id, formData }) => ({
                url: `/update/${_id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['User']
        }),
        // Get User OTP (Unauthenticated)
        getOTP: builder.mutation<void, GetOTP>({
            query: (email) => ({
                url: `/user/Get-OTP`,
                method: 'POST',
                body: email,
                baseQuery: baseQuery // Use the base query without reauth for OTP requests
            }),
        }),
        // Verify User OTP (Unauthenticated)
        verifyOTP: builder.mutation<string, VerifyOTP>({
            query: (data) => ({
                url: `/verify/otp`,
                method: 'POST',
                body: data,
                baseQuery: baseQuery // Use the base query without reauth for OTP verification
            })
        }),
        // Reset Password (Unauthenticated)
        resetPassword: builder.mutation<void, ResetPass>({
            query: (userInfo) => ({
                url: `/new-password`,
                method: 'POST',
                body: userInfo,
                baseQuery: baseQuery // Use the base query without reauth for password reset
            })
        })
    })
});

export const { useRegisterMutation, useLoginMutation,
    useLogoutMutation, useGetUserQuery,
    useUpdateUserMutation, useGetOTPMutation, useVerifyOTPMutation, useResetPasswordMutation } = userAPISlice;