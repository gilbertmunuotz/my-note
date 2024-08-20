import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { User } from '../constants/Interfaces';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


// Load environment variables
dotenv.config();


// Verify Local Passport User
export async function localVerify(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', { session: false }, (error: any, user: User, info: { message: string }) => {

        if (!user) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: info ? info.message : 'Login failed', user })
        }

        req.login(user, { session: false }, async (error) => {
            if (error) {
                return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' })
            }
        })

        req.user = user;
        next();
    })(req, res, next);
}


// Check if user is Authenticated
export async function checkAuth(req: Request, res: Response, next: NextFunction) {

    // Get the cookie Token
    const cookie = req.cookies.accessToken;

    //check if cookie Token is present
    if (!cookie) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Unathorized Access!. Denied" });
    }

    try {
        // check If token is Valid
        const decodedToken = jwt.verify(cookie, process.env.JWT_SECRET!);
        req.user = decodedToken;
        next();

    } catch (error) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Invalid Token' });
    }
}