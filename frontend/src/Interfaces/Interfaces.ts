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

export interface RouteParams {
    _id: string
}

interface SpinnerProps {
    loading: boolean;
}

interface AddNotes {
    open: boolean,
    onClose: () => void;
}

export type { Note, FetchedNotes, SpinnerProps, AddNotes };