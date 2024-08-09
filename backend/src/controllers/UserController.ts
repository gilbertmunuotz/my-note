import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { generateAccessToken, generateRefreshToken } from "../utilities/jwtToken";
import UserModel from '../models/User';
import bcrypt from 'bcryptjs';
import { User, ReqUserBody } from '../constants/Interfaces';
import { cloudinary } from '../utilities/cloudinary';

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

//(DESC) Update User Information
async function UserUpdate(req: Request, res: Response, next: NextFunction) {

    //Destructure id from req.params
    const { id } = req.params;


    // Destructure Request Body and explicitly type it
    const userData: User = req.body;

    //Destructure The Two value Pairs for validation
    const { name, email, password, photo } = userData;

    try {

        // Check if the user exists by ID
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'User Not Found' });
        }


        // Initialize update object with current user data
        let updateData: string = {
            name: name || existingUser.name,
            email: email || existingUser.email
        }

        // Check if a new password is provided and hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }
        // Check if Image Exists
        if (photo) {
            const profilePhoto = await cloudinary.uploader.upload(photo, {
                upload_preset: "my-notecloud"
            })

            if (profilePhoto) {
                const updateUser = await UserModel.findByIdAndUpdate<ReqUserBody>(id, { name, email, password, photo: profilePhoto });

                if (!updateUser) {
                    return res.status(HttpStatusCodes.NOT_FOUND).json({ status: 'error', message: 'User Not Found' })
                } else {
                    return res.status(HttpStatusCodes.OK).json({ status: 'Success', message: 'User Updated Succesfully' });
                }
            }
        }
    } catch (error) {
        console.error('Error Updating User', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
        next(error);
    }
}


export { Registration, Login, IsLogged, Logout, UserUpdate };