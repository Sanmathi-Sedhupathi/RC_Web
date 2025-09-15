import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/sendMail", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("MAIL_USER or MAIL_PASS not set in environment");
      return res.status(500).json({ message: "Email is not configured on the server" });
    }
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,      // 465 for SSL, 587 for TLS
        secure: true, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    transporter.verify((err, success) => {
        if (err) console.error("SMTP connection failed:", err);
        else console.log("SMTP ready:", success);
      });

    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error("Nodemailer verification failed:", verifyErr);
      return res.status(500).json({ message: "Email service is not available" });
    }

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      replyTo: `${name} <${email}>`,
      to: process.env.MAIL_USER,
      subject: `New Contact from ${name}`,
      text: message,
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
        
        <!-- Logo/Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="./src/assets/hero.png" alt="Riders Companion" style="height: 50px;" />
          <h2 style="color:#e6524a; margin-top: 10px;">New Contact Request</h2>
        </div>
    
        <!-- Intro -->
        <p>Hello Riders Companion Team,</p>
        <p>You have received a new message from a user via the Riders Companion app contact form:</p>
    
        <!-- User Info -->
        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f3f4f6; padding: 10px; border-radius: 5px;">${message}</p>
        </div>
    
        <!-- Reply Button -->
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="mailto:${email}" style="background-color: #1D4ED8; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reply to User
          </a>
        </div>
    
        <!-- Footer -->
        <p style="font-size: 0.85em; color: #6b7280; text-align: center;">
          This message was sent from the Riders Companion application.
        </p>
    
      </div>
    `,
    
    });

    return res.status(200).json({ message: "Email sent successfully ✅" });
  } catch (error) {
    console.error("Email send error:", error);
    const safeMessage = (error && error.response && error.response) ? "Email service responded with an error" : "Failed to send email";
    return res.status(500).json({ message: safeMessage });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Mail API listening on http://localhost:${port}`);
});


