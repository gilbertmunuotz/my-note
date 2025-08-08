import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';
import UserModel from '../models/User';
import bcrypt from 'bcryptjs';
import { User } from '../constants/Interfaces';

// Load environment variables
dotenv.config();

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User Not Found.!' });
        }
        if (!user.password) {
            return done(null, false, { message: 'Email Exists, Continue Via Google' });
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

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id).exec(); // exec() returns a real promise
        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        return error;
    }
});

export default passport;