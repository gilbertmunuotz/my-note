import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from "../constants/HttpStatusCodes";

//DESC 
async function getSignal(req: Request, res: Response, next: NextFunction) {
    try {
        res.send('Welcome Back To My Note');
    } catch (error) {
        console.error('Error Getting Signal', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
        next(error);
    }
}

export { getSignal }