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
exports.sendMail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Load environment variables
dotenv_1.default.config();
// (DESC) send Mails
function sendMail(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });
        const mailOptions = {
            from: `My Note`,
            to: email,
            subject: 'One-time Verification Code',
            html: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Email</title>
</head>

<body stye="line-height:2, margin:50px, padding:20px">
    <h1 style="background-color: #1976D2;">Action Required: One-Time Verification Code</h1>
    <p1>
        You are receiving this email because a request was made for a one-time
        code that can be used for password Reset.
        </p>

        <p2>Please enter the following code for verification</p2>
        <p style="font-size:2em"> ${otp} </p>
        <p3>It expires in 10 minutes.</p3>

        <p>If you did not request this change, please Ignore this Mail</p3>
        <br/> Thanks 🙏
</body>

</html>`,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    });
}
exports.sendMail = sendMail;
