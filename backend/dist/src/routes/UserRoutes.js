"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multerConfig_1 = __importDefault(require("../utilities/multerConfig"));
const OTPMiddleware_1 = __importDefault(require("../middlewares/OTPMiddleware"));
const NewPasswordMiddleware_1 = require("../middlewares/NewPasswordMiddleware");
const UserMiddleware_1 = __importDefault(require("../middlewares/UserMiddleware"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const UserController_1 = require("../controllers/UserController");
// **** Functions **** //
//Initiate Express Router
const router = (0, express_1.Router)();
/* Local registration route */
router.post('/register', UserMiddleware_1.default, UserController_1.Registration);
/* Local Login route */
router.post('/login', AuthMiddleware_1.localVerify, UserController_1.Login);
/* Check if User is Logged In */
router.get('/isLoggedIn', AuthMiddleware_1.checkAuth, UserController_1.IsLogged);
/* Local LogOut route */
router.delete('/logout', UserController_1.Logout);
/* Get User By Id */
router.get('/user/:id', UserController_1.GetUser);
/* Update User By Id */
router.put('/update/:id', multerConfig_1.default.single('photo'), UserMiddleware_1.default, UserController_1.UserUpdate);
/* Generate OTP */
router.post('/user/Get-OTP', UserController_1.GenerateOTP);
/* Verify OTP */
router.post('/verify/otp', OTPMiddleware_1.default, UserController_1.VerifyOTP);
/* Change Password */
router.post('/new-password', NewPasswordMiddleware_1.NewPasswordMiddleware, UserController_1.ChangePassword);
// **** Export default **** //
exports.default = router;
