//  *** Import Router & Controller Func ***//
import { Router } from "express";
import validateNote from "../middlewares/NoteMiddleware";
import { createNote, getAllNotes, getSingleNote, updateNote, deleteNote } from '../controllers/NotesController';

// **** Functions **** //
//Initiate Express Router
const router = Router();


/* GET All Notes */
router.get('/all', getAllNotes);


/* POST New Note */
router.post('/new', validateNote, createNote);


/* GET Single Note By Id */
router.get('/note/:id', getSingleNote);


/* Update Not By Id */
router.put('/update/:id', updateNote);


/* DELETE Single Note By Id */
router.delete('/delete/:id', deleteNote);


// **** Export default **** //
export default router;