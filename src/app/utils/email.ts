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


interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, any>;
}


// ---------------------------------------------------------------------------
// Inline HTML builder — no file I/O, zero runtime path dependency
// ---------------------------------------------------------------------------

interface TemplateContent {
    title: string;
    name: string;
    otp: string;
    subtitle: string;
    otpLabel: string;
    note: string;
    warning: string;
}

const buildEmailHtml = ({ title, name, otp, subtitle, otpLabel, note, warning }: TemplateContent): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e5e5; overflow: hidden; }
    .header { background-color: #4d7c0f; padding: 32px 20px; text-align: center; border-bottom: 3px solid #3a5a09; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; }
    .header .logo { font-size: 18px; font-weight: 800; color: #d9f99d; margin-bottom: 6px; }
    .content { padding: 40px 32px; text-align: center; }
    .greeting { font-size: 16px; color: #444; margin: 0 0 8px 0; }
    .subtitle { font-size: 14px; color: #777; margin: 0 0 32px 0; }
    .otp-label { font-size: 12px; font-weight: 600; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .otp-box { background-color: #f7fee7; border: 2px solid #a3e635; border-radius: 8px; padding: 20px 32px; margin: 0 auto 32px auto; display: inline-block; font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #3f6212; font-family: 'Courier New', monospace; }
    .note { font-size: 13px; color: #777; margin: 0 0 12px 0; }
    .warning { background-color: #fefce8; border: 1px solid #fde047; border-radius: 6px; padding: 12px 16px; font-size: 13px; color: #713f12; margin-top: 24px; text-align: left; }
    .footer { background-color: #fafafa; padding: 20px 32px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e5e5e5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NexDrop</div>
      <h1>${title}</h1>
    </div>
    <div class="content">
      <p class="greeting">Hello, <strong>${name}</strong></p>
      <p class="subtitle">${subtitle}</p>
      <div class="otp-label">${otpLabel}</div>
      <div class="otp-box">${otp}</div>
      <p class="note">${note}</p>
      <div class="warning"><strong>Important:</strong> ${warning}</div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} NexDrop. All rights reserved.</p>
      <p>This is an automated email &mdash; please do not reply.</p>
    </div>
  </div>
</body>
</html>`;


const templates: Record<string, (data: Record<string, any>) => string> = {
    "otp": (data) => buildEmailHtml({
        title: "Email Verification",
        name: data.name,
        otp: data.otp,
        subtitle: "Use the code below to verify your email address.",
        otpLabel: "Your verification code",
        note: "Enter this code on the verification page to complete your registration.",
        warning: "This code expires in 3 minutes. Never share it with anyone. If you did not request this, you can safely ignore this email.",
    }),
    "password-reset-otp": (data) => buildEmailHtml({
        title: "Password Reset OTP",
        name: data.name,
        otp: data.otp,
        subtitle: "We received a request to reset your password. Use the code below to proceed.",
        otpLabel: "Your reset code",
        note: "Enter this code on the password reset page along with your new password.",
        warning: "This code expires in 3 minutes. If you did not request a password reset, ignore this email — your account will remain unchanged. Never share this code with anyone.",
    }),
};


export const sendEmail = async ({ subject, templateName, templateData, to }: SendEmailOptions) => {
    try {
        const renderTemplate = templates[templateName];
        if (!renderTemplate) {
            throw new Error(`Unknown email template: "${templateName}"`);
        }

        const html = renderTemplate(templateData);

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
