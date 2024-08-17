import { Router } from 'express';
import upload from '../utilities/multerConfig';
import validateOTP from '../middlewares/OTPMiddleware';
import newPassword from '../middlewares/newPasswordMiddleware';
import { validateLocalUser } from '../middlewares/userMiddleware';
import { localVerify, checkAuth } from '../middlewares/authMiddleware';
import { Registration, Login, IsLogged, Logout, GetUser, UserUpdate, GenerateOTP, VerifyOTP, ChangePassword } from '../controllers/UserController';

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


/* Get User By Id */
router.get('/user/:id', GetUser);


/* Update User By Id */
router.put('/update/:id', upload.single('photo'), validateLocalUser, UserUpdate);


/* Generate OTP */
router.post('/user/Get-OTP', GenerateOTP);


/* Verify OTP */
router.post('/verify/otp', validateOTP, VerifyOTP);


/* Change Password */
router.post('/new-password', newPassword, ChangePassword);


// **** Export default **** //
export default router;