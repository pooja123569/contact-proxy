import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors()); // allow all origins or restrict to your React domain
app.use(express.json());

// === MySQL Connection ===
// Replace with your InfinityFree / other MySQL credentials
const db = await mysql.createPool({
  host: "sql205.infinityfree.com",       // your MySQL host
  user: "if0_40049891",                  // your MySQL username
  password: "fmFOIuvmHyrG",              // your MySQL password
  database: "if0_40049891_contact_db",   // your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    // Save to MySQL
    await db.query(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    return res.json({ status: "success", message: "Contact saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
