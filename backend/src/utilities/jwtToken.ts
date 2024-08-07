import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

export const generateAccessToken = (user: any) => {
    return jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '30 min' });
};

export const generateRefreshToken = (user: any) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};