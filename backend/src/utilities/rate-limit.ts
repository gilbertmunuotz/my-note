import { Request, Response, NextFunction } from "express";
import rateLimit from 'express-rate-limit';

// Create Rate Limiter for Login
export const RateLimiter = rateLimit({
    max: 5, // Max requests
    windowMs: 15 * 60 * 1000, // 15 minutes
    handler: (req: Request, res: Response, next: NextFunction, options) => {
        res.status(options.statusCode).json({
            status: 'error',
            message: options.message,
        });
    },
    message: 'Too Many Attempts, Try After 15mins',
    statusCode: 429, // HTTP status code for Too Many Requests
});