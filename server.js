import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

// === Update CORS ===
// Allow requests from your React frontend
app.use(cors({
  origin: ["http://localhost:8081", "https://your-frontend-domain.com"], // add your deployed frontend URL here
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

console.log("🔧 Initializing Email server...");

// === Configure Nodemailer transporter ===
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "godagepooja2003@gmail.com",
    pass: "fseuugdwuhxjqwep",
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

    const mailOptions = {
      from: email,
      to: "godagepooja2003@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ status: "success", message: "Contact message sent successfully" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Server error", details: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
