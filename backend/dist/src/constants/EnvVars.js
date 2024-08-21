"use strict";
/**
 * Environments variables declared here.
 */
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable node/no-process-env */
exports.default = {
    NodeEnv: ((_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : ''),
    Port: ((_b = process.env.PORT) !== null && _b !== void 0 ? _b : 0),
    MongoDB_URL: (_c = process.env.MONGODB_URL) !== null && _c !== void 0 ? _c : '',
    CookieProps: {
        Key: 'ExpressGeneratorTs',
        Secret: ((_d = process.env.COOKIE_SECRET) !== null && _d !== void 0 ? _d : ''),
        // Casing to match express cookie options
        Options: {
            httpOnly: true,
            signed: true,
            path: ((_e = process.env.COOKIE_PATH) !== null && _e !== void 0 ? _e : ''),
            maxAge: Number((_f = process.env.COOKIE_EXP) !== null && _f !== void 0 ? _f : 0),
            domain: ((_g = process.env.COOKIE_DOMAIN) !== null && _g !== void 0 ? _g : ''),
            secure: (process.env.SECURE_COOKIE === 'true'),
        },
    },
    Jwt: {
        Access_Secret: ((_h = process.env.JWT_ACCESS_SECRET) !== null && _h !== void 0 ? _h : ''),
        Refresh_Secret: ((_j = process.env.JWT_REFRESH_SECRET) !== null && _j !== void 0 ? _j : ''),
        Exp: ((_k = process.env.COOKIE_EXP) !== null && _k !== void 0 ? _k : ''), // exp at the same time as the cookie
    },
};
