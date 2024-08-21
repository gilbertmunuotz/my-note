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
exports.ChangePassword = exports.VerifyOTP = exports.GenerateOTP = exports.UserUpdate = exports.GetUser = exports.Logout = exports.IsLogged = exports.Login = exports.Registration = void 0;
const HttpStatusCodes_1 = __importDefault(require("../constants/HttpStatusCodes"));
const jwtToken_1 = require("../utilities/jwtToken");
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("../utilities/cloudinary");
const NodeMailer_1 = require("../utilities/NodeMailer");
const crypto_1 = __importDefault(require("crypto"));
//(DESC) Passport Local User registration 
function Registration(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Destructre req.body
        const { name, email, password } = req.body;
        try {
            // Check if User Already Exists
            let user = yield User_1.default.findOne({ email });
            if (user) {
                return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ message: 'Email already exists!' });
            }
            // Hash Password Using bcryptjs
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
            // Create a new user
            const newUser = new User_1.default({ name, email, password: hashedPassword });
            yield newUser.save();
            return res.status(HttpStatusCodes_1.default.CREATED).json({ message: 'User Registered successfully' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.Registration = Registration;
//(DESC) Passport Local User login 
function Login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            // Generate tokens
            const accessToken = (0, jwtToken_1.generateAccessToken)(user);
            const refreshToken = (0, jwtToken_1.generateRefreshToken)(user);
            // Set tokens in cookies
            res.cookie('accessToken', accessToken, { httpOnly: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            return res.status(HttpStatusCodes_1.default.OK).json({ message: 'Login successful', user });
        }
        catch (error) {
            return next(error);
        }
    });
}
exports.Login = Login;
;
//(DESC) Check If User Is Logged
function IsLogged(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(HttpStatusCodes_1.default.OK).json({ message: 'This is a protected route', user: req.user });
    });
}
exports.IsLogged = IsLogged;
//(DESC) Passport Local Logout User
function Logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Clear cookies that store JWTs
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(HttpStatusCodes_1.default.OK).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ message: 'Logout Error' });
        }
    });
}
exports.Logout = Logout;
//(DESC) Update User Information By Id
function GetUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Desrtucture Req.body
        const { id } = req.params;
        //Find User by id
        const user = yield User_1.default.findById(id);
        if (!user) {
            res.status(HttpStatusCodes_1.default.NOT_FOUND).send({ status: 'error', message: 'User Not Found' });
        }
        else {
            return res.status(HttpStatusCodes_1.default.OK).json(user);
        }
    });
}
exports.GetUser = GetUser;
//(DESC) Update User Information
function UserUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //Destructure id from req.params
        const { id } = req.params;
        // Destructure Request Body and explicitly type it
        const { name, email, password } = req.body;
        const photo = req.file; // Access uploaded file from multer
        try {
            // Check if the user exists by ID
            const existingUser = yield User_1.default.findById(id);
            if (!existingUser) {
                return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ status: 'error', message: 'User Not Found' });
            }
            // Initialize update object with current user data
            let updateData = {
                name: name || existingUser.name,
                email: email || existingUser.email,
            };
            // Check if a new password is provided and hash it
            if (password) {
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                updateData.password = hashedPassword;
            }
            // Upload photo if provided and it's an image
            if (req.file && req.file.buffer) {
                const uploadedPhoto = yield cloudinary_1.cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
                    upload_preset: 'my-notecloud',
                });
                if (uploadedPhoto) {
                    // Assign the secure URL to the photo field if Present
                    updateData.photo = uploadedPhoto.secure_url;
                }
            }
            else {
                // Retain the existing photo if no new photo is provided
                updateData.photo = existingUser.photo;
            }
            // Update the user with the new data
            const updateUser = yield User_1.default.findByIdAndUpdate(id, updateData, { new: true });
            if (!updateUser) {
                return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ status: 'error', message: 'User Not Found' });
            }
            return res.status(HttpStatusCodes_1.default.OK).json({ status: 'Success', message: 'User Updated Successfully', data: updateUser });
        }
        catch (error) {
            console.error('Error Updating User:', error);
            res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
            next(error);
        }
    });
}
exports.UserUpdate = UserUpdate;
//(DESC) Check E-mail &Send OTP 
function GenerateOTP(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Destructure Req.body
        const { email } = req.body;
        try {
            const user = yield User_1.default.findOne({ email });
            if (!user) {
                return res.status(HttpStatusCodes_1.default.NOT_FOUND).json({ status: 'Error', message: 'No user found with Such Email.' });
            }
            // Generate a 6-digit OTP
            const otp = crypto_1.default.randomInt(100000, 999999);
            user.resetOtp = otp;
            // 10 minutes expiry
            user.otpExpires = Date.now() + 10 * 60 * 1000;
            yield user.save();
            // Send OTP email
            yield (0, NodeMailer_1.sendMail)(email, otp);
            res.status(HttpStatusCodes_1.default.OK).json({ status: 'Success', Message: 'OTP Sent to Your Email' });
        }
        catch (error) {
            console.error('Error in ResetPassword:', error);
            res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ status: 'Error', Message: 'Failed to process password reset OTP.' });
        }
    });
}
exports.GenerateOTP = GenerateOTP;
//(DESC) Verify OTP
function VerifyOTP(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Destructure req.body
        const { email, otp } = req.body;
        try {
            const user = yield User_1.default.findOne({ email });
            if (!user || user.resetOtp !== otp || (user.otpExpires && user.otpExpires < Date.now())) {
                return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ status: 'Error', Message: 'Invalid or expired OTP.' });
            }
            //if OTP is valid 
            return res.status(HttpStatusCodes_1.default.OK).json({ status: 'Success', Message: "OTP verified successfully" });
        }
        catch (error) {
            res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ status: 'Error', Message: 'Internal Server Error.' });
        }
    });
}
exports.VerifyOTP = VerifyOTP;
//(DESC) Change Password
function ChangePassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Destructure req.body
        const { email, password } = req.body;
        try {
            const user = yield User_1.default.findOne({ email });
            if (!user) {
                return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ message: 'User not found.' });
            }
            // Generate Salts
            const salt = yield bcryptjs_1.default.genSalt(10);
            // Hash the new password
            const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
            // Update the user document
            user.password = hashedPassword;
            // Clear OTP in DB
            user.resetOtp = undefined;
            user.otpExpires = undefined;
            // Save User
            yield user.save();
            return res.status(HttpStatusCodes_1.default.OK).json({ status: 'Success', Message: 'Password Changed successful.' });
        }
        catch (error) {
            console.error("Error Changing Password", error);
            res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
            next(error);
        }
    });
}
exports.ChangePassword = ChangePassword;
