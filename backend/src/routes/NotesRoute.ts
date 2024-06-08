//  *** Import Router & Controller Func ***//
import { Router } from "express";
import validateNote from "../middlewares/NoteMiddleware";
import { getSignal, createNote, getAllNotes, getSingleNote, deleteNote } from '../controllers/NotesController';

// **** Functions **** //
//Initiate Express Router
const router = Router();


/*GET Signal*/
router.get('/api/v1', getSignal);


/* POST New Note */
router.post('/api/newnote', createNote, validateNote);


/* GET All Notes */
router.get('/api/allNotes', getAllNotes);


/* GET Single Note By Id */
router.get('/api/note/:id', getSingleNote);


/* DELETE Single Note By Id */
router.delete('/api/delete/:id', deleteNote);


// **** Export default **** //
export default router;