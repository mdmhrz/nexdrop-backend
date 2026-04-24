/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";
import status from "http-status";
import path from "path";
import ejs from "ejs";


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


export const sendEmail = async ({ subject, templateName, templateData, to }: SendEmailOptions) => {
    try {
        const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
        console.log(`[Email] Rendering template from: ${templatePath}`);

        const html = await ejs.renderFile(templatePath, templateData);

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
