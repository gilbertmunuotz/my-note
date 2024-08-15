import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { generateAccessToken, generateRefreshToken } from "../utilities/jwtToken";
import UserModel from '../models/User';
import bcrypt from 'bcryptjs';
import { User } from '../constants/Interfaces';
import { cloudinary } from '../utilities/cloudinary';
import { sendMail } from '../utilities/NodeMailer';
import crypto from 'crypto';


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

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set tokens in cookies
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        return res.status(HttpStatusCodes.OK).json({ message: 'Login successful', user });
    } catch (error) {
        return next(error);
    }
};


//(DESC) Check If User Is Logged
async function IsLogged(req: Request, res: Response, next: NextFunction) {
    res.status(HttpStatusCodes.OK).json({ message: 'This is a protected route', user: req.user });
}


//(DESC) Passport Local Logout User
async function Logout(req: Request, res: Response, next: NextFunction) {

    try {
        // Clear cookies that store JWTs
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
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
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'Error', Message: 'No user found with Such email.' });
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


//(DESC) Verify OTP & Reset Password
async function VerifyOTP(req: Request, res: Response, next: NextFunction) {

    // Destructure req.body
    const { email, otp, newpassword } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user || user.resetOtp !== otp || (user.otpExpires && user.otpExpires < Date.now())) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ status: 'Error', Message: 'Invalid or expired OTP.' });
        }
        // OTP is valid and not expired
        else {

            try {
                // Hash the new password
                const hashedPassword = await bcrypt.hash(newpassword, 10);

                // Update the user document
                user.password = hashedPassword,
                    user.resetOtp = undefined,
                    user.otpExpires = undefined,

                    //Save new Credentials
                    await user.save();
                return res.status(HttpStatusCodes.OK).json({ status: 'Success', Message: "Password reset successful", user })

            } catch (error) {
                console.error('Error Updating Password', error);
                return res.status(HttpStatusCodes.BAD_REQUEST).json({ status: 'Error', Message: 'Error Updating Password' })
            }
        }
    } catch (error) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'Error', Message: 'Internal Server Error.' });
    }
}

export { Registration, Login, IsLogged, Logout, GetUser, UserUpdate, GenerateOTP, VerifyOTP };