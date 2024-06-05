import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';

//(DESC) A sample to test the routes & connections
// eslint-disable-next-line @typescript-eslint/require-await
async function getSignal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.send('Welcome Back');
    } catch (error) {
        console.error('Error Getting Signal', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
        next(error);
    }
}


export { getSignal };