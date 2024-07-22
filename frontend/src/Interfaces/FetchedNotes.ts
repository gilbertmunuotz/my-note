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

export type { FetchedNotes, SpinnerProps };