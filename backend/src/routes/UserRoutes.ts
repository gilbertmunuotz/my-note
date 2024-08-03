import { Router } from 'express';
import passport from '../middlewares/GPMiddleware';
import validateLocalUser from '../middlewares/UserMiddleware';
import { OAuth20, Registration, Login, Logout } from '../controllers/UserController';

// **** Functions **** //
//Initiate Express Router
const router = Router();


/* Google OAuth login route */
router.get('/auth/google', passport.authenticate('google'));


/* Google OAuth callback route */
router.get('/auth/google/callback', OAuth20);


/* Local registration route */
router.post('/register', validateLocalUser, Registration);


/* Local Login route */
router.post('/login', Login);


/* Local LogOut route */
router.delete('/logout', Logout);


// **** Export default **** //
export default router;