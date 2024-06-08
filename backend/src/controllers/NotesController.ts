
import { Request, Response, NextFunction } from "express";
import NoteModel from "../models/Note";
import HttpStatusCodes from "../constants/HttpStatusCodes";


//(DESC) A sample to test the routes & connections
async function getSignal(req: Request, res: Response, next: NextFunction) {
    try {
        res.send('Welcome Back To My Note');
    } catch (error) {
        console.error('Error Getting Signal', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
        next(error);
    }
}


//(DESC) Create New Note
async function createNote(req: Request, res: Response, next: NextFunction) {

    //Define Interface
    interface NoteBody {
        title: string,
        text: string
    }

    // Destructure Request Body and explicitly type it
    const { title, text }: NoteBody = req.body;

    try {
        const newNote = await NoteModel.create<NoteBody>({ title, text })
        return res.status(HttpStatusCodes.CREATED).send({ message: 'Note Created Succesfully' });

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
        res.status(HttpStatusCodes.OK).json({ notes })
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

    //Define Interface
    interface ReqNoteBody {
        title: string,
        text: string
    }

    //Destructure id from req.params
    const { id } = req.params;

    // Destructure Request Body and explicitly type it
    const noteData: ReqNoteBody = req.body;

    const { title, text } = noteData;

    try {
        const updatingNote = await NoteModel.findByIdAndUpdate<ReqNoteBody>(id, noteData, { new: true });

        if (!updatingNote) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'Note Not Found' });
        } else {
            return res.status(HttpStatusCodes.OK).json({ status: 'Succes', message: 'Note Updated Succesfully' });
        }
    } catch (error) {
        console.error('Error Updating Note', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
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

export { getSignal, createNote, getAllNotes, getSingleNote, updateNote, deleteNote }