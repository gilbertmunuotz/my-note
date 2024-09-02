import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { generateAccessToken, generateRefreshToken } from "../utilities/jwtToken";
import UserModel from '../models/User';
import bcrypt from 'bcryptjs';
import { User } from '../constants/Interfaces';
import { cloudinary } from '../utilities/cloudinary';
import { sendMail } from '../utilities/NodeMailer';
import crypto from 'crypto';
import jwt from "jsonwebtoken";


//(DESC) Passport Local User registration 
async function Registration(req: Request, res: Response, next: NextFunction) {

    // Destructre req.body
    const { name, email, password } = req.body;

    try {
        // Check if User Already Exists
        let user = await UserModel.findOne({ email });

        if (user) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Email already exists!' });
        }

        // Hash Password Using bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new UserModel({ name, email, password: hashedPassword });

        await newUser.save();

        return res.status(HttpStatusCodes.CREATED).json({ message: 'User Registered successfully' });

    } catch (error) {
        next(error);
    }
}


//(DESC) Passport Local User login 
async function Login(req: Request, res: Response, next: NextFunction) {

    try {
        const user = req.user;

        // Generate Access Token
        const accessToken = generateAccessToken(user);

        // Generate Refresh Token
        const refreshToken = generateRefreshToken(user);

        // Store Refresh Token in an HttpOnly cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });


        // Send both the access &refresh token to client
        return res.status(HttpStatusCodes.OK).json({ message: 'Login successful', user, accessToken, refreshToken });
    } catch (error) {
        return next(error);
    }
};


// (DESC) Check If User Is Logged
async function IsLogged(req: Request, res: Response, next: NextFunction) {
    res.status(HttpStatusCodes.OK).json({ message: 'This is a protected route', user: req.user });
}


// (DESC) Get New Access Token
async function RefreshToken(req: Request, res: Response, next: NextFunction) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: 'No Refresh Token Provided' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as jwt.Secret, (error: any, user: any) => {
        if (error) {
            return res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_ACCESS_SECRET as jwt.Secret, { expiresIn: '15 min' });

        return res.status(HttpStatusCodes.OK).json({ message: 'Access Token Refreshed Successfully', accessToken, });
    })
};


// (DESC) Passport Local Logout User
async function Logout(req: Request, res: Response, next: NextFunction) {

    try {
        // Clear the refresh token cookie stored in Server
        res.clearCookie('refreshToken');

        // Optionally, you can also clear the access token cookie
        res.clearCookie('accessToken');
        return res.status(HttpStatusCodes.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Logout Error' });
    }
}


//(DESC) Update User Information By Id
async function GetUser(req: Request, res: Response, next: NextFunction) {

    // Desrtucture Req.body
    const { id } = req.params;


    //Find User by id
    const user = await UserModel.findById(id);

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ status: 'error', message: 'User Not Found' });
    } else {
        return res.status(HttpStatusCodes.OK).json(user);
    }
}


//(DESC) Update User Information
async function UserUpdate(req: Request, res: Response, next: NextFunction) {

    //Destructure id from req.params
    const { id } = req.params;


    // Destructure Request Body and explicitly type it
    const { name, email, password } = req.body;
    const photo = req.file; // Access uploaded file from multer

    try {
        // Check if the user exists by ID
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'User Not Found' });
        }


        // Initialize update object with current user data
        let updateData: Partial<User> = {
            name: name || existingUser.name,
            email: email || existingUser.email,
        };

        // Check if a new password is provided and hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }


        // Upload photo if provided and it's an image
        if (req.file && req.file.buffer) {
            const uploadedPhoto = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
                upload_preset: 'my-notecloud',
            });
            if (uploadedPhoto) {
                // Assign the secure URL to the photo field if Present
                updateData.photo = uploadedPhoto.secure_url;
            }
        } else {
            // Retain the existing photo if no new photo is provided
            updateData.photo = existingUser.photo;
        }


        // Update the user with the new data
        const updateUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updateUser) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'User Not Found' });
        }

        return res.status(HttpStatusCodes.OK).json({ status: 'Success', message: 'User Updated Successfully', data: updateUser });
    }
    catch (error) {
        console.error('Error Updating User:', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
        next(error);
    }
}


//(DESC) Check E-mail &Send OTP 
async function GenerateOTP(req: Request, res: Response, next: NextFunction) {

    // Destructure Req.body
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'Error', message: 'No user found with Such Email.' });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999);

        user.resetOtp = otp;
        // 10 minutes expiry
        user.otpExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Send OTP email
        await sendMail(email, otp);

        res.status(HttpStatusCodes.OK).json({ status: 'Success', Message: 'OTP Sent to Your Email' });
    } catch (error) {
        console.error('Error in ResetPassword:', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'Error', Message: 'Failed to process password reset OTP.' });

    }
}


//(DESC) Verify OTP
async function VerifyOTP(req: Request, res: Response, next: NextFunction) {

    // Destructure req.body
    const { email, otp } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user || user.resetOtp !== otp || (user.otpExpires && user.otpExpires < Date.now())) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ status: 'Error', Message: 'Invalid or expired OTP.' });
        }

        //if OTP is valid 
        return res.status(HttpStatusCodes.OK).json({ status: 'Success', Message: "OTP verified successfully" })

    }
    catch (error) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'Error', Message: 'Internal Server Error.' });
    }
}


//(DESC) Change Password
async function ChangePassword(req: Request, res: Response, next: NextFunction) {

    // Destructure req.body
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'User not found.' });
        }

        // Generate Salts
        const salt = await bcrypt.genSalt(10);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user document
        user.password = hashedPassword;

        // Clear OTP in DB
        user.resetOtp = undefined;
        user.otpExpires = undefined;

        // Save User
        await user.save();

        return res.status(HttpStatusCodes.OK).json({ status: 'Success', Message: 'Password Changed successful.' });

    } catch (error) {
        console.error("Error Changing Password", error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
        next(error);
    }
}


export {
    Registration, Login,
    IsLogged, Logout,
    GetUser, UserUpdate,
    GenerateOTP, VerifyOTP,
    ChangePassword, RefreshToken
};