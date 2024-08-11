import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_API } from "../config/constants";
import { Credentials, UserInfo, ProfileInfo } from '../Interfaces/Interfaces';

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
        // Get User By id
        getUser: builder.query<ProfileInfo, string>({
            query: (_id) => ({
                url: `/user/${_id}`,
                method: 'GET'
            }),
            providesTags: ['User']
        }),
        // Update User Info
        updateUser: builder.mutation<void, { _id: string, formData: FormData }>({
            query: ({ _id, formData }) => ({
                url: `/update/${_id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['User']
        }),
    })
})


export const { useRegisterMutation, useLoginMutation,
    useLogoutMutation, useGetUserQuery,
    useUpdateUserMutation } = userAPISlice;