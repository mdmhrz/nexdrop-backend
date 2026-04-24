/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";
import status from "http-status";


const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
});


const templates: Record<string, (data: Record<string, any>) => string> = {
    otp: ({ name, otp }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
  .header h1 { margin: 0; font-size: 28px; }
  .content { padding: 40px 20px; text-align: center; }
  .otp-box { background-color: #f0f0f0; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 30px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea; font-family: 'Courier New', monospace; }
  .message { font-size: 16px; color: #666; margin: 20px 0; }
  .warning { background-color: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 5px; font-size: 14px; margin: 20px 0; }
  .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; }
</style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Email Verification</h1></div>
    <div class="content">
      <p class="message">Hello <strong>${name}</strong>,</p>
      <p class="message">Your email verification code is:</p>
      <div class="otp-box">${otp}</div>
      <p class="message">Enter this code to verify your email address.</p>
      <div class="warning"><strong>Security Note:</strong> This OTP is valid for 3 minutes only. Do not share this code with anyone.</div>
      <p class="message" style="color:#999;font-size:14px;">If you didn't request this code, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Nex Drop. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>`,

    "password-reset-otp": ({ name, otp }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
  .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px 20px; text-align: center; }
  .header h1 { margin: 0; font-size: 28px; }
  .content { padding: 40px 20px; text-align: center; }
  .otp-box { background-color: #f0f0f0; border: 2px solid #f5576c; border-radius: 8px; padding: 20px; margin: 30px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f5576c; font-family: 'Courier New', monospace; }
  .message { font-size: 16px; color: #666; margin: 20px 0; }
  .warning { background-color: #ffe5e5; border: 1px solid #f5576c; color: #c81e1e; padding: 15px; border-radius: 5px; font-size: 14px; margin: 20px 0; }
  .steps { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: left; }
  .steps ol { margin: 10px 0; padding-left: 20px; }
  .steps li { margin: 10px 0; color: #666; }
  .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; }
</style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Password Reset Request</h1></div>
    <div class="content">
      <p class="message">Hello <strong>${name}</strong>,</p>
      <p class="message">We received a request to reset your password. Use the code below to proceed:</p>
      <div class="otp-box">${otp}</div>
      <div class="steps">
        <strong>How to reset your password:</strong>
        <ol>
          <li>Copy the code above</li>
          <li>Go to the password reset page</li>
          <li>Paste the code and enter your new password</li>
          <li>Confirm the change</li>
        </ol>
      </div>
      <div class="warning"><strong>Important:</strong> This code is valid for 3 minutes only. If you didn't request this, ignore this email and your account will remain unchanged.</div>
      <p class="message" style="color:#999;font-size:14px;">For security reasons, we never send passwords via email. Do not share this code with anyone.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Nex Drop. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>`,
};


interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, any>;
}


export const sendEmail = async ({ subject, templateName, templateData, to }: SendEmailOptions) => {
    try {
        const templateFn = templates[templateName];
        if (!templateFn) {
            throw new Error(`Email template "${templateName}" not found`);
        }

        const html = templateFn(templateData);

        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to,
            subject,
            html,
        });

        console.log(`Email sent to ${to}: ${info.messageId}`);

    } catch (error: any) {
        console.error(`Error sending email to ${to}:`, error.message);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
}
