"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmationEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '1025'),
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    } : undefined
});
const sendEmail = async (email, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
    }
    catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
const sendConfirmationEmail = async (email, token) => {
    const link = `${process.env.API_URL}/api/confirm/${token}`;
    const subject = 'Confirm your Weather Subscription';
    const html = `<p>Click <a href="${link}">here</a> to confirm your subscription.</p>`;
    await (0, exports.sendEmail)(email, subject, html);
};
exports.sendConfirmationEmail = sendConfirmationEmail;
