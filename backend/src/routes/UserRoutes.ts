import { Router } from 'express';
import { validateLocalUser } from '../middlewares/userMiddleware';
import { localVerify, checkAuth } from '../middlewares/authMiddleware';
import { Registration, Login, IsLogged, Logout, UserUpdate } from '../controllers/UserController';

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


/* Update User By Id */
router.put('/update/:id', validateLocalUser, UserUpdate);


// **** Export default **** //
export default router;