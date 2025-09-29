import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

// === Update CORS ===
app.use(cors({
  origin: ["http://localhost:8081", "https://your-frontend-domain.com"], // Add your deployed frontend URL
  methods: ["GET", "POST"],
}));

app.use(express.json());

console.log("🔧 Initializing Email server...");

// === Configure Nodemailer transporter ===
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "godagepooja2003@gmail.com", // your verified Gmail
    pass: "fseuugdwuhxjqwep",         // Gmail App Password
  },
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Server is running" });
});

app.post("/api/contact", async (req, res) => {
  console.log("📨 Received POST request to /api/contact");
  console.log("📦 Request body:", req.body);

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    // Updated mailOptions
    const mailOptions = {
      from: "godagepooja2003@gmail.com", // must be verified Gmail
      to: "godagepooja2003@gmail.com",   // your email to receive messages
      replyTo: email,                     // user’s email
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully!");
      return res.json({ status: "success", message: "Contact message sent successfully" });
    } catch (err) {
      console.error("❌ Failed to send email:", err);
      return res.status(500).json({ status: "error", message: "Failed to send email", details: err.message });
    }

  } catch (err) {
    return res.status(500).json({ status: "error", message: "Server error", details: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
