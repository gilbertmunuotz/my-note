interface Note {
    _id?: string,
    title: string,
    text: string,
    createdAt?: string,
    updatedAt?: string,
    pinned?: boolean,
    user?: string;
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
    _id: string;
    name: string;
    email: string;
    password: string;
    photos: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


interface ProfileInfo {
    _id?: string,
    name?: string,
    email?: string,
    password?: string,
    photo?: string;
}


interface VerifyOTP {
    email: string,
    otp: number;
}


interface GetOTP {
    email: string;
}


interface ResetPass {
    email: string,
    password: string;
}


export type {
    Note, FetchedNotes,
    SpinnerProps, AddNotes,
    EditNoteProps, Credentials,
    UserInfo, AuthResponse,
    ProfileInfo, VerifyOTP,
    GetOTP, ResetPass
};