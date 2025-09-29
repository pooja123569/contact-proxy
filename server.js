import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // allow all origins or restrict to your React domain
app.use(express.json());

// const TARGET = "https://visiomatixmedia.infinityfree.me/saveContact.php";

const TARGET = "https://visiomatixmedia.infinityfree.me/saveContact.php?i=1";


app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ status: "error", message: "All fields required" });
    }

    // Forward request to InfinityFree server
    const response = await fetch(TARGET, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const text = await response.text();

    // Try to parse JSON safely
    try {
      const json = JSON.parse(text);
      return res.status(response.status).json(json);
    } catch {
      return res.status(502).json({ status: "error", message: "Invalid response from upstream", raw: text.slice(0, 1000) });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Proxy server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
