import { Schema, model } from 'mongoose';
import { User } from '../constants/Interfaces';


// **** Functions **** //
const userSchema = new Schema<User>({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    photo: { type: String },
}, { timestamps: true });



// **** Export default **** //
const UserModel = model<User>('User', userSchema);
export default UserModel;