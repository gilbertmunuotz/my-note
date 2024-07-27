interface Note {
    _id: string,
    title: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    pinned: boolean;
}

interface FetchedNotes {
    Quantity: number,
    Notes: Note[];
}

interface SpinnerProps {
    loading: boolean;
}

interface AddNotes {
    open: boolean,
    onClose: () => void;
}

interface EditNoteProps extends AddNotes {
    noteId: string
}

export type { Note, FetchedNotes, SpinnerProps, AddNotes, EditNoteProps };