import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { getUser, setUser } from '@/lib/userStore';
import { sendOtp, sendWelcomeSms, verifyOtpApi } from '@/lib/smsService';
import { toast } from 'sonner';

const ease = [0.22, 1, 0.36, 1] as const;

const OtpVerification = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  useEffect(() => {
    if (!user) navigate('/register');
  }, [user, navigate]);

  const [sending, setSending] = useState(false);

  const handleSendOtp = async () => {

  setSending(true);
  setError("");

  try {

    const result = await sendOtp(phone);

    if (result.success) {

      setSent(true);
      toast.success("OTP sent successfully");

    } else {

      setError("Failed to send OTP");

    }

  } catch (err) {

    console.error(err);
    setError("Server error");

  }

  setSending(false);

};

  const verifyOtp = async () => {

  setVerifying(true);

  const result = await verifyOtpApi(phone, otp);

  if (!result.success) {

    setError("Invalid OTP");
    setVerifying(false);
    return;

  }

  const cleanPhone = phone.replace(/\D/g, '');

  if (user) {
    setUser({ ...user, phone: cleanPhone });
  }

  setTimeout(() => navigate('/health-form'), 800);

};

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="w-full max-w-md"
      >
        <button onClick={() => navigate('/register')} className="flex items-center gap-1 text-muted-foreground text-sm mb-8 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="display-text text-lg">AROGYANETR</span>
        </div>

        {!sent ? (
          <>
            <h1 className="display-text text-3xl mb-2">Phone Verification</h1>
            <p className="text-muted-foreground text-sm mb-8">We'll send a 6-digit verification code to your phone.</p>

            <div>
              <label className="mono-label mb-2 block">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="input-field"
                maxLength={15}
              />
              {error && <p className="text-destructive text-xs mt-1">{error}</p>}
            </div>

            <button onClick={handleSendOtp} disabled={sending} className="pill-button-primary w-full mt-6 disabled:opacity-50">
              {sending ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <h1 className="display-text text-3xl mb-2">Enter OTP</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Code sent to <span className="text-foreground font-medium">{phone}</span>
            </p>

            <div>
              <label className="mono-label mb-2 block">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="input-field text-center text-2xl tracking-[0.3em]"
                maxLength={6}
              />
              {error && <p className="text-destructive text-xs mt-1">{error}</p>}
              {generatedOtp && (
                <p className="text-primary text-xs mt-3 text-center">
                  Demo mode OTP: <span className="font-semibold tracking-widest">{generatedOtp}</span>
                </p>
              )}
            </div>

            <button onClick={verifyOtp} disabled={verifying} className="pill-button-primary w-full mt-6 disabled:opacity-50">
              {verifying ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button onClick={() => { setSent(false); setOtp(''); setError(''); setSending(false); setGeneratedOtp(''); }} className="text-primary text-sm mt-4 block mx-auto">
              Resend Code
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OtpVerification;
