import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// (DESC) send Mails
async function sendMail(email: string, otp: number) {

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: 'My Note',
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

    return new Promise<void>((resolve, reject) => {
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export { sendMail };