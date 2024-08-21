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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const constant_1 = require("./src/constants/constant");
// Load env variables
dotenv_1.default.config();
const EnvVars_1 = __importDefault(require("./src/constants/EnvVars"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const NotesRoute_1 = __importDefault(require("./src/routes/NotesRoute"));
const UserRoutes_1 = __importDefault(require("./src/routes/UserRoutes"));
const HttpStatusCodes_1 = __importDefault(require("./src/constants/HttpStatusCodes"));
const passport_1 = __importDefault(require("passport"));
require("./src/middlewares/passport-config.ts");
//Connect to MongoDB
function connectToMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(EnvVars_1.default.MongoDB_URL);
            console.log('MongoDB connected successfully!');
        }
        catch (error) {
            console.error('Error Connecting to MongoDB', error);
        }
    });
}
//Call The Function
connectToMongo();
// Initiate Express
const app = (0, express_1.default)();
// Add your Middlewares & Other Logics Here
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: `${constant_1.USERS_URL}`,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
//Test Sample Route
app.get('/api', (req, res, next) => {
    try {
        res.send('Welcome Back To My Note');
    }
    catch (error) {
        console.error('Error Getting Signal', error);
        res.status(HttpStatusCodes_1.default.INTERNAL_SERVER_ERROR).send({ status: 'error', message: 'Internal Server Error' });
        next(error);
    }
});
//Define Routes Here
app.use('/api/notes', NotesRoute_1.default); //Note Related Routes
app.use('/v1/Auth', UserRoutes_1.default); //Auth User Related Routes
// Listen to Server Response
const port = EnvVars_1.default.Port;
app.listen(port, () => {
    console.log(`Server Listening on Port ${port}`);
});
// Export the app instance
module.exports = app;
