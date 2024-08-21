"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.unPinNote = exports.pinNote = exports.updateNote = exports.getSingleNote = exports.getAllNotes = exports.createNote = void 0;
const Note_1 = __importDefault(require("../models/Note"));
const HttpStatusCodes_1 = __importDefault(require("../constants/HttpStatusCodes"));
const mongoose_1 = __importDefault(require("mongoose"));
//(DESC) Create New Note
function createNote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Destructure Request Body and explicitly type it
        const { title, text, user } = req.body;
        try {
            // Validate user ID (you might want to add more checks here)
            if (!mongoose_1.default.Types.ObjectId.isValid(user)) {
                return res.status(HttpStatusCodes_1.default.BAD_REQUEST).send({ status: 'error', message: 'Invalid user ID' });
            }
            const newNote = yield Note_1.default.create({ title, text, user });
            return res.status(HttpStatusCodes_1.default.CREATED).send({ status: 'Success', message: 'Note Created Succesfully' });
        }
        catch (error) {
            console.error('An Error Occured, Please Try Again Later', error);
            res.status(HttpStatusCodes_1.default.SERVICE_UNAVAILABLE).send({ status: 'error', message: 'An Error Occured, Please Try Again Later' });
            next(error);
        }
    });
}
exports.createNote = createNote;
//(DESC) Get All Notes
function getAllNotes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract user ID from request
        const userId = req.params.id;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).send({ status: 'error', message: 'Invalid or missing user ID' });
        }
        try {
            // Fetch notes for the specific user
            const notes = yield Note_1.default.find({ user: userId });
            res.status(HttpStatusCodes_1.default.OK).json({ Quantity: notes.length, Notes: notes });
        }
        catch (error) {
            console.error('Error Getting Data', error);
            res.status(HttpStatusCodes_1.default.NOT_FOUND).send({ status: 'error', message: 'Error Getting Data' });
            next(error);
        }
    });
}
exports.getAllNotes = getAllNotes;
//(DESC) Get Single Note By Id
function getSingleNote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //Desctructure id from Req.body
        const { id } = req.params;
        //Find Note by id
        const note = yield Note_1.default.findById(id);
        if (!note) {
            res.status(HttpStatusCodes_1.default.NOT_FOUND).send({ status: 'error', message: 'Note Not Found' });
        }
        else {
            return res.status(HttpStatusCodes_1.default.OK).json(note);
        }
    });
}
exports.getSingleNote = getSingleNote;
//(DESC) Update Note By Id
function updateNote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //Destructure id from req.params
        const { id } = req.params;
        // Destructure Request Body and explicitly type it
        const noteData = req.body;
        //Destructure The Two value Pairs for validation
        const { title, text } = noteData;
        // Trim whitespaces
        const trimmedTitle = noteData.title.trim();
        const trimmedText = noteData.text.trim();
        try {
            if (!trimmedTitle) {
                return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ status: 'error', message: "Title can't be empty", });
            }
            else if (!trimmedText) {
                return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ status: 'error', message: "Text can't be empty", });
            }
            const updatingNote = yield Note_1.default.findByIdAndUpdate(id, noteData, { new: true });
            if (!updatingNote) {
                return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ status: 'error', message: 'Note Not Found' });
            }
            else {
                return res.status(HttpStatusCodes_1.default.OK).json({ status: 'Success', message: 'Note Updated Succesfully' });
            }
        }
        catch (error) {
            console.error('Error Updating Note', error);
            res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
            next(error);
        }
    });
}
exports.updateNote = updateNote;
//(DESC) Pin A Note By Id
function pinNote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //Destructure id from req.params
        const { id } = req.params;
        try {
            const note = yield Note_1.default.findById(id);
            if (!note) {
                return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ status: 'error', message: 'Note Not Found' });
            }
            // Set pinned flag to true
            note.pinned = true;
            const updatedNote = yield note.save();
            return res.status(HttpStatusCodes_1.default.OK).json({ status: 'Success', message: 'Note Pinned Successfully', Note: updatedNote, });
        }
        catch (error) {
            console.error('Error Pinning Note', error);
            res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ status: 'Error', message: 'Internal Server Error', });
            next(error);
        }
    });
}
exports.pinNote = pinNote;
//(DESC) Un Pin A Note By Id
function unPinNote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //Destructure id from req.params
        const { id } = req.params;
        try {
            const note = yield Note_1.default.findById(id);
            if (!note) {
                return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ status: 'error', message: 'Note Not Found' });
            }
            // Set pinned flag to false
            note.pinned = false;
            const updatedNote = yield note.save();
            return res.status(HttpStatusCodes_1.default.OK).json({ status: 'Success', message: 'Note Un Pinned Successfully', Note: updatedNote, });
        }
        catch (error) {
            console.error('Error Pinning Note', error);
            res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ status: 'Error', message: 'Internal Server Error', });
            next(error);
        }
    });
}
exports.unPinNote = unPinNote;
//(DESC) Delete Note By Id
function deleteNote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //Destructure id from Req.params
        const { id } = req.params;
        try {
            const deleteANote = yield Note_1.default.findByIdAndDelete(id);
            if (!deleteANote) {
                return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ status: 'error', message: 'Note Not Found' });
            }
            else {
                return res.status(HttpStatusCodes_1.default.OK).json({ status: 'Success', message: 'Note Deleted Succesfully' });
            }
        }
        catch (error) {
            console.error('Error Deleting Note');
            res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Internal Server Error' });
            next(error);
        }
    });
}
exports.deleteNote = deleteNote;
