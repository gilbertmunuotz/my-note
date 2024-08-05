import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FetchedNotes, Note, } from "../Interfaces/Interfaces";
import { SERVER_API } from "../config/constants";

const baseQuery = fetchBaseQuery({
    baseUrl: `${SERVER_API}/api/notes`
});

export const notesAPISlice = createApi({
    reducerPath: "notesAPI",
    tagTypes: ['Notes'],
    baseQuery,
    endpoints: (builder) => ({

        // First paramater Represents the Expected Return Data Type
        // Second parameter Represents the Passed Data Type

        getNotes: builder.query<FetchedNotes, void>({
            query: () => ({
                url: `/all`,
                method: 'GET'
            }),
            providesTags: ['Notes'],
        }),
        addNewNote: builder.mutation<void, Note>({
            query: (note) => ({
                url: `/new`,
                method: 'POST',
                body: note,
            }),
            invalidatesTags: ['Notes'],
        }),
        getNoteId: builder.query<Note, string>({
            query: (_id) => ({
                url: `/note/${_id}`,
                method: 'GET'
            }),
            providesTags: ['Notes']
        }),
        updateNote: builder.mutation<void, Note>({
            query: (note) => ({
                url: `/update/${note._id}`,
                method: 'PUT',
                body: note,
            }),
            invalidatesTags: ['Notes']
        }),
        deleteNote: builder.mutation<void, string>({
            query: (_id) => ({
                url: `/delete/${_id}`,
                method: 'DELETE'
            }),
        }),
    })
});


export const { useGetNotesQuery, useAddNewNoteMutation, useGetNoteIdQuery, useUpdateNoteMutation, useDeleteNoteMutation, } = notesAPISlice;