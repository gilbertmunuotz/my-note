import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FetchedNotes, Note,
    //  Pinning 
    } from "../Interfaces/Interfaces";
import { SERVER_API } from "../config/constants";

const baseQuery = fetchBaseQuery({
    baseUrl: SERVER_API
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
                url: `/api/notes/all`,
                method: 'GET'
            }),
            providesTags: ['Notes'],
        }),
        addNewNote: builder.mutation<void, Note>({
            query: (note) => ({
                url: `/api/notes/new`,
                method: 'POST',
                body: note,
            }),
            invalidatesTags: ['Notes'],
        }),
        getNoteId: builder.query<Note, string>({
            query: (_id) => ({
                url: `/api/notes/note/${_id}`,
                method: 'GET'
            }),
            providesTags: ['Notes']
        }),
        updateNote: builder.mutation<void, Note>({
            query: (note) => ({
                url: `/api/notes/update/${note._id}`,
                method: 'PUT',
                body: note,
            }),
            invalidatesTags: ['Notes']
        }),
        deleteNote: builder.mutation<void, string>({
            query: (_id) => ({
                url: `/api/notes/delete/${_id}`,
                method: 'DELETE'
            }),
        }),
        // pinNote: builder.mutation<Pinning, string>({
        //     query: (_id) => ({
        //         url: `/api/notes/pin/${_id}`,
        //         method: 'PATCH'
        //     })
        // }),
    })
});

export const { useGetNotesQuery, useAddNewNoteMutation,
    useGetNoteIdQuery, useUpdateNoteMutation,
    useDeleteNoteMutation,
    //  usePinNoteMutation 
    } = notesAPISlice;