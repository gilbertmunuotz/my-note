import { Router } from 'express';
import passport from '../middlewares/Authmiddleware';
import validateLocalUser from '../middlewares/UserMiddleware';
import { OAuth20, Registration } from '../controllers/UserController';

// **** Functions **** //
//Initiate Express Router
const router = Router();


/* Google OAuth login route */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


/* Google OAuth callback route */
router.get('/auth/google/callback', OAuth20);


/* Local registration route */
router.post('/register', validateLocalUser, Registration);


// **** Export default **** //
export default router;