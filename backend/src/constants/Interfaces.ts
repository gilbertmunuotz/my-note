export interface NoteBody {
  title: string,
  text: string;
}

export interface ReqNoteBody {
  title: string,
  text: string;
}

export interface UNotes {
  title: string,
  text: string,
  pinned: boolean;
}

export interface User {
  name?: string,
  email: string,
  password?: string,
  photos?: string[];
}

export interface ReqUserBody {
  name: string,
  email: string,
  password: string,
  photos: string,
}