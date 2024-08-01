import { Schema, model } from 'mongoose';
import { User } from '../constants/Interfaces';


// **** Functions **** //
const userSchema = new Schema<User>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    displayName: { type: String },
    photos: [{ type: String }],
}, { timestamps: true });



// **** Export default **** //
const UserModel = model<User>('User', userSchema);
export default UserModel;