interface FetchedNotes {
    _id: string,
    title: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    pinned: boolean;
}


interface SpinnerProps {
    loading: boolean;
}

interface AddNotes {
    open: boolean,
    onClose: () => void;
}
export type { FetchedNotes, SpinnerProps, AddNotes };