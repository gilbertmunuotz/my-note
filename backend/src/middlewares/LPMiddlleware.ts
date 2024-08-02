import passport from "passport";
import { Strategy } from "passport-local";
import dotenv from 'dotenv';
import UserModel from '../models/User';
import bcrypt from 'bcryptjs';
import { User } from '../constants/Interfaces';

// Load environment variables
dotenv.config();

// Local Strategy
passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        if (!user.password) {
            return done(null, false, { message: 'Email Already registered, Continue with Google' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialization and deserialization of user
passport.serializeUser((user, done) => {
    done(null, (user as User));
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: any, user: User) => {
        done(err, user as Express.User);
    });
});