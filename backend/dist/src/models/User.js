"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// **** Functions **** //
const userSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    photo: { type: String },
    resetOtp: { type: Number },
    otpExpires: { type: Number },
}, { timestamps: true });
// **** Export default **** //
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
