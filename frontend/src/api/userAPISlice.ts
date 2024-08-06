import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_API } from "../config/constants";
import { Credentials, UserInfo } from '../Interfaces/Interfaces';

const baseQuery = fetchBaseQuery({
    baseUrl: `${SERVER_API}/v1/Auth`,
    credentials: 'include'
});


export const userAPISlice = createApi({
    reducerPath: "userAPI",
    tagTypes: ['User'],
    baseQuery,
    endpoints: (builder) => ({
        // Local Passport Registration
        register: builder.mutation<void, Credentials>({
            query: (credentials) => ({
                url: `/register`,
                method: 'POST',
                body: credentials,
            }),
        }),

        // Local Passport Login
        login: builder.mutation<void, UserInfo>({
            query: (userInfo) => ({
                url: `/login`,
                method: 'POST',
                body: userInfo,
            }),
        }),

        // Local Passport logout 
        logout: builder.mutation<void, void>({
            query: () => ({
                url: `/logout`,
                method: 'DELETE'
            }),
        }),

        // Google OAuth 
        googleStratergy: builder.query({
            query: () => ({
                url: `/auth/google/callback`,
                method: 'GET',
            }),
        }),
    })
})


export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGoogleStratergyQuery } = userAPISlice;