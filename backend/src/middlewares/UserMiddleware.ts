    import { Request, Response, NextFunction } from "express";
    import Joi from "joi";
    import HttpStatusCodes from "../constants/HttpStatusCodes";

    async function validateLocalUser(req: Request, res: Response, next: NextFunction) {

        // Perform Joi Validation
        const userSchema = Joi.object().keys({
            name: Joi.string().required().optional(),
            email: Joi.string().pattern(new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/i)).required().optional(),
            password: Joi.string().required().optional(),
            photo: Joi.string().optional() // Added optional photo field
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