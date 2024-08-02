import passport from 'passport';
import UserModel from '../models/User';
import { User } from '../constants/Interfaces';

// Import All strategy configurations
import '../middlewares/GPMiddleware';
import '../middlewares/LPMiddlleware';

// Serialization and deserialization of user
passport.serializeUser((user, done) => {
    done(null, (user as User));
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: any, user: User) => {
        done(err, user as Express.User);
    });
});