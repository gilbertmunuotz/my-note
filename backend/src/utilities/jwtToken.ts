import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

export const generateAccessToken = (user: any) => {
    // Short-lived access token
    return jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '2 min' });
};

export const generateRefreshToken = (user: any) => {
    // Longer-lived refresh token
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '3 min' });
};