import passport from "passport";
import { Strategy as GoogleStratergy } from 'passport-google-oauth20';
import { USERS_URL } from '../constants/constant';
import UserModel from '../models/User';
import { User } from '../constants/Interfaces';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


// Google OAuth Strategy
passport.use(new GoogleStratergy({
    clientID: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    callbackURL: `${USERS_URL}/auth/google/callback`,
    scope: ['profile', 'email'], // Request profile and email data
},
    async (accessToken, refreshToken, profile, done) => {
        try {

            // Search for an existing user with the email address provided by Google
            let user = await UserModel.findOne({ email: profile.emails?.[0].value });

            if (!user) {
                user = new UserModel({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails?.[0].value,
                    photos: profile.photos?.map(photo => photo.value) || [],
                });
                await user.save();

            } else if (!user.googleId) {
                // Assigns the Google ID from the OAuth profile to the googleId field of the user object. 
                user.googleId = profile.id;
                await user.save();
            }

            return done(null, user);

        } catch (error) {
            return done(error, false);
        }
    }
));


// Serialization and deserialization of user
passport.serializeUser((user, done) => {
    done(null, (user as User));
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: any, user: User) => {
        done(err, user as Express.User);
    });
});

export default passport;