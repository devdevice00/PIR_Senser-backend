import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const BREVO_API_KEY = process.env.BREVO_API_KEY;

app.post("/send-email", async (req, res) => {
  const { email, deviceName } = req.body;

  if (!email) {
    return res.status(400).json({ error: "No email" });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Pir Sensor",
          email: "no-reply@pirsenser.com"
        },
        to: [{ email }],
        subject: "เข้าสู่ระบบสำเร็จ",
        htmlContent: `
          <h2>เข้าสู่ระบบแล้ว 🎉</h2>
          <p>อุปกรณ์: ${deviceName}</p>
        `,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Send email failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
