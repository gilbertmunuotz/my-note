"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const HttpStatusCodes_1 = __importDefault(require("../constants/HttpStatusCodes"));
function UserMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Perform Joi Validation
        const userSchema = joi_1.default.object().keys({
            name: joi_1.default.string().required().optional(),
            email: joi_1.default.string().pattern(new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/i)).required().optional(),
            password: joi_1.default.string().required().optional(),
            photo: joi_1.default.string().optional() // Added optional photo field
        }).options({ abortEarly: false });
        const { error } = userSchema.validate(req.body, { abortEarly: false });
        //Check If There's an Error
        if (error) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ errors: error.details.map(detail => detail.message) });
        }
        next();
    });
}
//Export Default Constant
exports.default = UserMiddleware;
