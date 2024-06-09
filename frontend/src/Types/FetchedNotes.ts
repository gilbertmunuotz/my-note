interface FetchedNotes {
    _id: string,
    title: string,
    text: string,
    createdAt: string,
    updatedAt: string;
}


interface SpinnerProps {
    loading: boolean;
}

export type { FetchedNotes, SpinnerProps };