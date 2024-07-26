import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FetchedNotes, Note } from "../Interfaces/Interfaces";

const URL = `http://localhost:8000`;

const baseQuery = fetchBaseQuery({
    baseUrl: URL
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
        getNoteId: builder.query<Note, void>({
            query: (_id) => ({
                url: `/api/notes/note/${_id}`,
                method: 'GET'
            }),
            providesTags: ['Notes']
        }),
        updateNote: builder.mutation<void, Note>({
            query: (note_id) => ({
                url: `/api/notes/update/${note_id._id}`,
                method: 'PUT',
                body: note_id,
            }),
            invalidatesTags: ['Notes']
        }),
    })
});

export const { useGetNotesQuery, useAddNewNoteMutation, useGetNoteIdQuery, useUpdateNoteMutation } = notesAPISlice;