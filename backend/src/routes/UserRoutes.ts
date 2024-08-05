import { Router } from 'express';
import passport from '../middlewares/passport-config.ts';
import { validateLocalUser } from '../middlewares/userMiddleware';
import { localVerify, googleVerify, checkAuth } from '../middlewares/authMiddleware';
import { OAuth20, Registration, Login, IsLogged, Logout } from '../controllers/UserController';

// **** Functions **** //
//Initiate Express Router
const router = Router();


/* Google OAuth login route */
router.get('/auth/google', passport.authenticate('google'));

/* Google OAuth callback route */
router.get('/auth/google/callback', googleVerify, OAuth20);


/* Local registration route */
router.post('/register', validateLocalUser, Registration);


/* Local Login route */
router.post('/login', localVerify, Login);


/* Check if User is Logged In */
router.get('/isLoggedIn', checkAuth, IsLogged);


/* Local LogOut route */
router.delete('/logout', Logout);


// **** Export default **** //
export default router;