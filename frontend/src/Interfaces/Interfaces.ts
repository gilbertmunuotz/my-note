interface Note {
    _id?: string,
    title: string,
    text: string,
    createdAt?: string,
    updatedAt?: string,
    pinned?: boolean;
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


interface Credentials {
    name: string,
    email: string,
    password: string
}


interface UserInfo {
    email: string,
    password: string
}


interface AuthResponse {
    message: string;
    user: {
        _id: string;
        name: string;
        email: string;
        password: string;
        photos: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}



export type { Note, FetchedNotes, SpinnerProps, AddNotes, EditNoteProps, Credentials, UserInfo, AuthResponse };