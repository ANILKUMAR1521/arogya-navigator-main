const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
//const PORT = 5000;

// 🔑 Replace with your Fast2SMS API Key
const FAST2SMS_API_KEY = "WfotqhODC9NP2DpEwm2spWiBj3tbjDSvc4L6NJmSJu7SEqtLQkgfoHSOo7Tf";

let otpStore = {};


// ========================
// SEND OTP
// ========================
app.post("/send-otp", async (req, res) => {

  const { phone } = req.body;

  if (!phone) {
    return res.json({ success: false, message: "Phone required" });
  }

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[cleanPhone] = otp;

  try {

    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: FAST2SMS_API_KEY,
        route: "otp",
        variables_values: otp,
        numbers: cleanPhone
      }
    });

    console.log("OTP SMS response:", response.data);

    res.json({ success: true });

  } catch (error) {

    console.log("OTP SMS error:", error.response?.data || error.message);

    res.json({ success: false });

  }

});


// ========================
// VERIFY OTP
// ========================
app.post("/verify-otp", (req, res) => {

  const { phone, otp } = req.body;

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  if (otpStore[cleanPhone] == otp) {

    delete otpStore[cleanPhone];

    return res.json({ success: true });

  }

  res.json({ success: false });

});


// ========================
// WELCOME SMS
// ========================
app.post("/welcome-sms", async (req, res) => {

  const { phone, name } = req.body;

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  const message = `Welcome ${name}! Thank you for registering with ArogyaNetr. Stay healthy!`;

  try {

    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: FAST2SMS_API_KEY,
        route: "q",
        message: message,
        language: "english",
        numbers: cleanPhone
      }
    });

    console.log("Welcome SMS response:", response.data);

    res.json({ success: true });

  } catch (error) {

    console.log("Welcome SMS error:", error.response?.data || error.message);

    res.json({ success: false });

  }

});


// ========================
// HEALTH RESULT SMS
// ========================
app.post("/health-result", async (req, res) => {

  const { phone, riskLevel, recommendations } = req.body;

  if (!phone) {
    return res.json({ success: false, message: "Phone required" });
  }

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  const message =
`ArogyaNetr Health Report

Status: ${riskLevel}

Recommendations:
- ${recommendations?.[0] || ""}
- ${recommendations?.[1] || ""}

Thank you for using ArogyaNetr.`;

  try {

    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: FAST2SMS_API_KEY,
        route: "q",
        message: message,
        language: "english",
        numbers: cleanPhone
      }
    });

    console.log("Health Result SMS response:", response.data);

    res.json({ success: true });

  } catch (error) {

    console.log("Health Result SMS error:", error.response?.data || error.message);

    res.json({ success: false });

  }

});


// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
