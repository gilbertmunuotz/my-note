import { Router } from 'express';
import passport from '../middlewares/passport-config.ts';
import { validateLocalUser } from '../middlewares/userMiddleware';
import { localVerify, checkAuth } from '../middlewares/authMiddleware';
import { Registration, Login, IsLogged, Logout } from '../controllers/UserController';

// **** Functions **** //
//Initiate Express Router
const router = Router();


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