import { Router } from 'express';
import upload from '../utilities/multerConfig';
import validateOTP from '../middlewares/OTPMiddleware';
import { NewPasswordMiddleware } from "../middlewares/NewPasswordMiddleware";
import UserMiddleware from '../middlewares/UserMiddleware';
import { localVerify, checkAuth } from "../middlewares/authMiddleware"
import { Registration, Login, IsLogged, RefreshToken, Logout, GetUser, UserUpdate, GenerateOTP, VerifyOTP, ChangePassword } from '../controllers/UserController';
import { RateLimiter } from '../utilities/rate-limit';

// **** Functions **** //
//Initiate Express Router
const router = Router();

/* Local registration route */
router.post('/register', RateLimiter, UserMiddleware, Registration);


/* Local Login route */
router.post('/login', RateLimiter, localVerify, Login);


/* Check if User is Logged In */
router.get('/isLoggedIn', checkAuth, IsLogged);


/* Get New Access Token*/
router.post('/refresh-token', RefreshToken);


/* Local LogOut route */
router.delete('/logout', Logout);


/* Get User By Id */
router.get('/user/:id', GetUser);


/* Update User By Id */
router.put('/update/:id', upload.single('photo'), UserMiddleware, UserUpdate);


/* Generate OTP */
router.post('/user/Get-OTP', RateLimiter, GenerateOTP);


/* Verify OTP */
router.post('/verify/otp', validateOTP, VerifyOTP);


/* Change Password */
router.post('/new-password', NewPasswordMiddleware, ChangePassword);


// **** Export default **** //
export default router;