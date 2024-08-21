"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewPasswordMiddleware = void 0;
const joi_1 = __importDefault(require("joi"));
const HttpStatusCodes_1 = __importDefault(require("../constants/HttpStatusCodes"));
const NewPasswordMiddleware = (req, res, next) => {
    //Perform Joi Validation
    const noteSchema = joi_1.default.object().keys({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }).options({ abortEarly: false });
    const { error } = noteSchema.validate(req.body, { abortEarly: false });
    //Check If Validation succeeded
    if (error) {
        return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
};
exports.NewPasswordMiddleware = NewPasswordMiddleware;
