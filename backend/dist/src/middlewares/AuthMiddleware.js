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
exports.checkAuth = exports.localVerify = void 0;
const passport_1 = __importDefault(require("passport"));
const HttpStatusCodes_1 = __importDefault(require("../constants/HttpStatusCodes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Verify Local Passport User
function localVerify(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('local', { session: false }, (error, user, info) => {
            if (!user) {
                return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ message: info ? info.message : 'Login failed', user });
            }
            req.login(user, { session: false }, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
                }
            }));
            req.user = user;
            next();
        })(req, res, next);
    });
}
exports.localVerify = localVerify;
// Check if user is Authenticated
function checkAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the cookie Token
        const cookie = req.cookies.accessToken;
        //check if cookie Token is present
        if (!cookie) {
            return res.status(HttpStatusCodes_1.default.UNAUTHORIZED).json({ message: "Unathorized Access!. Denied" });
        }
        try {
            // check If token is Valid
            const decodedToken = jsonwebtoken_1.default.verify(cookie, process.env.JWT_SECRET);
            req.user = decodedToken;
            next();
        }
        catch (error) {
            res.status(HttpStatusCodes_1.default.BAD_REQUEST).json({ message: 'Invalid Token' });
        }
    });
}
exports.checkAuth = checkAuth;
