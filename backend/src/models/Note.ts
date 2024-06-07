import { Schema, model, Document } from "mongoose";

// **** Define Types **** //
export interface UNotes extends Document {
    title: string;
    text: string;
    created: Date;
}

// **** Functions **** //
const messageSchema = new Schema<UNotes>({
    title: { type: String },
    text: { type: String },
    created: { type: Date }
}, { timestamps: true });

// **** Export default **** //
const MessageModel = model<UNotes>('Note', messageSchema);
export default MessageModel;