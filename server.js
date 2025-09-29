import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔧 Initializing Email server...");

// === Configure Nodemailer transporter ===
// Replace with your email credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., "gmail"
  auth: {
    user: "godagepooja2003@gmail.com",
    pass: "fseuugdwuhxjqwep", // Use App Password if using Gmail
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
      console.log("⚠️ Validation failed: Missing fields");
      return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    // Prepare email
    const mailOptions = {
      from: email, // sender
      to: "godagepooja2003@gmail.com", // your email to receive messages
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

    return res.json({ status: "success", message: "Contact message sent successfully" });
  } catch (err) {
    console.error("❌ ERROR in /api/contact:");
    console.error("Error message:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
