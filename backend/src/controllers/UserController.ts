import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { generateAccessToken, generateRefreshToken } from "../utilities/jwtToken";
import UserModel from '../models/User';
import bcrypt from 'bcryptjs';
import { USERS_URL } from '../constants/constant';


//(DESC) Google OAuth callback
async function OAuth20(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.user;

    try {
        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set tokens in cookies and send them in the response
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        // Redirect to the frontend home page
        res.redirect(`${USERS_URL}/home`);

    } catch (error) {
        return next(error);
    }
};


//(DESC) Passport Local User registration 
async function Registration(req: Request, res: Response, next: NextFunction) {

    // Destructre req.body
    const { name, email, password } = req.body;

    try {
        // Check if User Already Exists
        let user = await UserModel.findOne({ email });

        if (user) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Email already exists, Login with Google or use another Email' });
        }

        // Hash Password Using bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new UserModel({ name, email, password: hashedPassword });

        await newUser.save();

        return res.status(HttpStatusCodes.CREATED).json({ message: 'User registered successfully' });

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

        return res.status(HttpStatusCodes.OK).json({ message: 'Login successful', accessToken, refreshToken });
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


export { OAuth20, Registration, Login, IsLogged, Logout };