export interface NoteBody {
  title: string,
  text: string,
  user: string;
}

export interface ReqNoteBody {
  title: string,
  text: string;
}

export interface User {
  name?: string,
  email: string,
  password?: string,
  photo?: string;
}