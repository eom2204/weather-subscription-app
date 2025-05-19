import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '1025'),
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
});

export const sendEmail = async (email: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export const sendConfirmationEmail = async (email: string, token: string) => {
  const link = `${process.env.API_URL}/api/confirm/${token}`;
  const subject = 'Confirm your Weather Subscription';
  const html = `<p>Click <a href="${link}">here</a> to confirm your subscription.</p>`;
  await sendEmail(email, subject, html);
};