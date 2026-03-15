const API = "http://localhost:5000";

export const sendOtp = async (phone: string) => {

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  const res = await fetch(`${API}/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phone: cleanPhone })
  });

  return await res.json();

};

export const verifyOtpApi = async (phone: string, otp: string) => {

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  const res = await fetch(`${API}/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phone: cleanPhone, otp })
  });

  return await res.json();

};

export const sendWelcomeSms = async (phone: string, name: string) => {

  const res = await fetch(`${API}/welcome-sms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phone, name })
  });

  return await res.json();

};

export const sendHealthResultSms = async (
  phone: string,
  riskLevel: string,
  recommendations: string[]
) => {

  const res = await fetch(`${API}/health-result`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phone, riskLevel, recommendations })
  });

  return await res.json();

};