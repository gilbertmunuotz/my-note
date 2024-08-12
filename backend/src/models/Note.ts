import mongoose, { Schema, model, Document } from "mongoose";

// Interfaces
export interface UNotes extends Document {
    title: string;
    text: string;
    user: mongoose.Types.ObjectId; // Indicating that user is of type ObjectId
    pinned: boolean;
}

// **** Functions **** //
const messageSchema = new Schema<UNotes>({
    title: { type: String },
    text: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pinned: { type: Boolean },
}, { timestamps: true });



// **** Export default **** //
const MessageModel = model<UNotes>('Note', messageSchema);
export default MessageModel;