import { Request, Response, NextFunction } from "express";
import NoteModel from "../models/Note";
import { NoteBody, ReqNoteBody } from "../constants/Interfaces";
import HttpStatusCodes from "../constants/HttpStatusCodes";

//(DESC) Create New Note
async function createNote(req: Request, res: Response, next: NextFunction) {

    // Destructure Request Body and explicitly type it
    const { title, text }: NoteBody = req.body;

    try {
        const newNote = await NoteModel.create<NoteBody>({ title, text })
        return res.status(HttpStatusCodes.CREATED).send({ status: 'Success', message: 'Note Created Succesfully' });

    } catch (error) {
        console.error('An Error Occured, Please Try Again Later', error);
        res.status(HttpStatusCodes.SERVICE_UNAVAILABLE).send({ status: 'error', message: 'An Error Occured, Please Try Again Later' });
        next(error);
    }
}


//(DESC) Get All Notes
async function getAllNotes(req: Request, res: Response, next: NextFunction) {
    try {
        const notes = await NoteModel.find({})
        res.status(HttpStatusCodes.OK).json({ Quantity: notes.length, Notes: notes })
    } catch (error) {
        console.error('Error Getting Data', error);
        res.status(HttpStatusCodes.NOT_FOUND).send({ status: 'error', message: 'Error Getting Data' });
        next(error);
    }
}


//(DESC) Get Single Note By Id
async function getSingleNote(req: Request, res: Response, next: NextFunction) {

    //Desctructure id from Req.body
    const { id } = req.params;

    //Find Note by id
    const note = await NoteModel.findById(id);

    if (!note) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ status: 'error', message: 'Note Not Found' });
    } else {
        return res.status(HttpStatusCodes.OK).json(note);
    }
}


//(DESC) Update Note By Id
async function updateNote(req: Request, res: Response, next: NextFunction) {

    //Destructure id from req.params
    const { id } = req.params;

    // Destructure Request Body and explicitly type it
    const noteData: ReqNoteBody = req.body;

    //Destructure The Two value Pairs for validation
    const { title, text } = noteData;

    // Trim whitespaces
    const trimmedTitle = noteData.title.trim();
    const trimmedText = noteData.text.trim();


    try {

        if (!trimmedTitle) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ status: 'error', message: "Title can't be empty", });
        } else if (!trimmedText) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ status: 'error', message: "Text can't be empty", });
        }

        const updatingNote = await NoteModel.findByIdAndUpdate<ReqNoteBody>(id, noteData, { new: true });

        if (!updatingNote) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'Note Not Found' });
        } else {
            return res.status(HttpStatusCodes.OK).json({ status: 'Success', message: 'Note Updated Succesfully' });
        }
    } catch (error) {
        console.error('Error Updating Note', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
        next(error);
    }
}


//(DESC) Pin A Note By Id
async function pinNote(req: Request, res: Response, next: NextFunction) {

    //Destructure id from req.params
    const { id } = req.params;

    try {
        const note = await NoteModel.findById(id);

        if (!note) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'Note Not Found' });
        }

        // Set pinned flag to true
        note.pinned = true;
        const updatedNote = await note.save();

        return res.status(HttpStatusCodes.OK).json({ status: 'Success', message: 'Note Pinned Successfully', Note: updatedNote, });
    } catch (error) {
        console.error('Error Pinning Note', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'Error', message: 'Internal Server Error', });
        next(error);
    }
}


//(DESC) Un Pin A Note By Id
async function unPinNote(req: Request, res: Response, next: NextFunction) {

    //Destructure id from req.params
    const { id } = req.params;

    try {
        const note = await NoteModel.findById(id);

        if (!note) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'Note Not Found' });
        }

        // Set pinned flag to false
        note.pinned = false;
        const updatedNote = await note.save();

        return res.status(HttpStatusCodes.OK).json({ status: 'Success', message: 'Note Un Pinned Successfully', Note: updatedNote, });
    } catch (error) {
        console.error('Error Pinning Note', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'Error', message: 'Internal Server Error', });
        next(error);
    }
}

//(DESC) Delete Note By Id
async function deleteNote(req: Request, res: Response, next: NextFunction) {

    //Destructure id from Req.params
    const { id } = req.params;

    try {

        const deleteANote = await NoteModel.findByIdAndDelete(id);

        if (!deleteANote) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'Note Not Found' });
        } else {
            return res.status(HttpStatusCodes.OK).json({ status: 'Success', message: 'Note Deleted Succesfully' });
        }

    } catch (error) {
        console.error('Error Deleting Note');
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Internal Server Error' });
        next(error);
    }
}

export { createNote, getAllNotes, getSingleNote, updateNote, pinNote, unPinNote, deleteNote }