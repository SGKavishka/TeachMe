import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    console.log(`Email skipped in development: ${subject} -> ${to}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
    text
  });
};

