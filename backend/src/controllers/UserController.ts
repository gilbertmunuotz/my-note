import { Request, Response, NextFunction } from 'express';
import passport from '../middlewares/Authmiddleware';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { generateAccessToken, generateRefreshToken } from "../utilities/jwtToken";
import UserModel from '../models/User';
import bcrypt from 'bcryptjs';

//(DESC) Google OAuth callback route
async function OAuth20(req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate('google', { failureRedirect: '/login' }, (error, user) => {
        if (error) {
            return next(error);
        }

        if (!user) {
            return res.redirect('/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            // Generate tokens
            const accessToken = generateAccessToken(req.user);
            const refreshToken = generateRefreshToken(req.user);

            // Set tokens in cookies or send them in the response
            res.cookie('accessToken', accessToken, { httpOnly: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });

            // Redirect to the home page
            return res.redirect('/all');
        });

        // Redirect to the home page
        res.redirect('/all');
    });
};


//(DESC) Local registration route
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

        // Generate tokens
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        // Set tokens in cookies or send them in the response
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        return res.status(HttpStatusCodes.CREATED).json({ message: 'User registered successfully' });

    } catch (error) {
        next(error);
    }

}

export { OAuth20, Registration };