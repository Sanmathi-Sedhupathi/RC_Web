
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use host: "smtp.example.com"
      auth: {
        user: process.env.MAIL_USER, // your email
        pass: process.env.MAIL_PASS, // your app password
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_USER, // where you receive emails
      subject: `New Contact from ${name}`,
      text: message,
      html: `
        <h3>New Contact Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return res.status(200).json({ message: "Email sent successfully ✅" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
}
