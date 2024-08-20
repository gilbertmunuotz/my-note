//  *** Import Router & Controller Func ***//
import { Router } from "express";
import NoteMiddleware from '../middlewares/NoteMiddleware';
import { createNote, getAllNotes, getSingleNote, updateNote, pinNote, unPinNote, deleteNote } from '../controllers/NotesController';

// **** Functions **** //
//Initiate Express Router
const router = Router();


/* GET All Notes */
router.get('/all/:id', getAllNotes);


/* POST New Note */
router.post('/new', NoteMiddleware, createNote);


/* GET Single Note By Id */
router.get('/note/:id', getSingleNote);


/* Update Note By Id */
router.put('/update/:id', NoteMiddleware, updateNote);


/* Pin A Note By Id */
router.patch('/pin/:id', pinNote);


/* Un Pin A Note By Id */
router.patch('/unpin/:id', unPinNote);


/* DELETE Single Note By Id */
router.delete('/delete/:id', deleteNote);


// **** Export default **** //
export default router;