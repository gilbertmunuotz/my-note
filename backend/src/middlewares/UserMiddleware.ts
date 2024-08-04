import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import HttpStatusCodes from "../constants/HttpStatusCodes";

async function validateLocalUser(req: Request, res: Response, next: NextFunction) {

    // Perform Joi Validation
    const userSchema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().pattern(new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/i)).required(),
        password: Joi.string().required(),
    }).options({ abortEarly: false });

    const { error } = userSchema.validate(req.body, { abortEarly: false });

    //Check If There's an Error
    if (error) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: error.details.map(detail => detail.message) });
    }

    next();
}

//Export Default Constant
export { validateLocalUser };