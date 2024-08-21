"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//  *** Import Router & Controller Func ***//
const express_1 = require("express");
const NoteMiddleware_1 = require("../middlewares/NoteMiddleware");
const NotesController_1 = require("../controllers/NotesController");
// **** Functions **** //
//Initiate Express Router
const router = (0, express_1.Router)();
/* GET All Notes */
router.get('/all/:id', NotesController_1.getAllNotes);
/* POST New Note */
router.post('/new', NoteMiddleware_1.NoteMiddleware, NotesController_1.createNote);
/* GET Single Note By Id */
router.get('/note/:id', NotesController_1.getSingleNote);
/* Update Note By Id */
router.put('/update/:id', NoteMiddleware_1.NoteMiddleware, NotesController_1.updateNote);
/* Pin A Note By Id */
router.patch('/pin/:id', NotesController_1.pinNote);
/* Un Pin A Note By Id */
router.patch('/unpin/:id', NotesController_1.unPinNote);
/* DELETE Single Note By Id */
router.delete('/delete/:id', NotesController_1.deleteNote);
// **** Export default **** //
exports.default = router;
