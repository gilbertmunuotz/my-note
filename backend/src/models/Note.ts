import { Schema, model } from "mongoose";
import { UNotes } from '../constants/Interfaces'


// **** Functions **** //
const messageSchema = new Schema<UNotes>({
    title: { type: String },
    text: { type: String },
    pinned: { type: Boolean },
}, { timestamps: true });



// **** Export default **** //
const MessageModel = model<UNotes>('Note', messageSchema);
export default MessageModel;