import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle, XCircle, Heart, Wind, Thermometer, Clock } from 'lucide-react';
import { getUser } from '@/lib/userStore';
import { calculateRisk, type HealthFormData, type HealthResult } from '@/lib/analysisEngine';
import { sendHealthResultSms } from '@/lib/smsService';
import { toast } from 'sonner';

const ease = [0.22, 1, 0.36, 1] as const;

const riskConfig = {
  'Healthy': { color: 'text-risk-healthy', bg: 'bg-risk-healthy', icon: CheckCircle },
  'Moderate Risk': { color: 'text-risk-moderate', bg: 'bg-risk-moderate', icon: AlertTriangle },
  'High Risk': { color: 'text-risk-high', bg: 'bg-risk-high', icon: XCircle },
};

const Results = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [result, setResult] = useState<HealthResult | null>(null);

  useEffect(() => {
    if (!user) { navigate('/register'); return; }
    const raw = sessionStorage.getItem('healthFormData');
    if (!raw) { navigate('/health-form'); return; }
    const formData: HealthFormData = JSON.parse(raw);
    const healthResult = calculateRisk(formData, user.age);
    setResult(healthResult);

    // Send health result SMS if user has a phone number
    if (user.phone) {
      sendHealthResultSms(user.phone, healthResult.level, healthResult.recommendations)
        .then(res => {
          if (res.success) toast.success('Health report SMS sent!');
        })
        .catch(() => console.error('Health result SMS failed'));
    }
  }, [user, navigate]);

  if (!result || !user) return null;

  const cfg = riskConfig[result.level];
  const Icon = cfg.icon;
  const vitals = result.vitalRanges;

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="display-text text-lg">AROGYANETR</span>
        </div>
        <span className="mono-label">Health Report</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="clinical-card-lg text-center"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${cfg.bg} bg-opacity-10 mb-4`}>
            <Icon className={`w-8 h-8 ${cfg.color}`} />
          </div>
          <h1 className="display-text text-3xl mb-1">{result.level}</h1>
          <p className="mono-label">Risk Score: {result.score}</p>
        </motion.div>

        {/* Vital Ranges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          <p className="section-number">Normal Vital Ranges for Age {user.age}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Heart, label: 'Heart Rate', value: `${vitals?.hr[0]}–${vitals?.hr[1]}`, unit: 'BPM' },
              { icon: Wind, label: 'SpO2', value: `${vitals?.spo2[0]}–${vitals?.spo2[1]}`, unit: '%' },
              { icon: Thermometer, label: 'Temperature', value: `${vitals?.temp[0]}–${vitals?.temp[1]}`, unit: '°C' },
              { icon: Clock, label: 'ECG PR', value: `${vitals?.ecg[0]}–${vitals?.ecg[1]}`, unit: 'sec' },
            ].map((v, i) => (
              <div key={i} className="clinical-card text-center">
                <v.icon className="w-4 h-4 text-primary mx-auto mb-2" />
                <p className="mono-label mb-1">{v.label}</p>
                <p className="display-text text-lg">{v.value}</p>
                <p className="text-muted-foreground text-xs">{v.unit}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Observations */}
        {result.observations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
          >
            <p className="section-number">Observations</p>
            <div className="clinical-card space-y-3">
              {result.observations.map((obs, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${cfg.bg} mt-2 shrink-0`} />
                  <p className="text-sm">{obs}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
        >
          <p className="section-number">Recommendations</p>
          <div className="clinical-card space-y-3">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mono-label mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SMS preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.4 }}
        >
          <p className="section-number">SMS Report Preview</p>
          <div className="clinical-card font-mono text-xs leading-relaxed text-muted-foreground">
            <p>arogyNetr Health Report:</p>
            <p>Status: {result.level}</p>
            <p>Recommendations:</p>
            {result.recommendations.slice(0, 2).map((r, i) => (
              <p key={i}>- {r}</p>
            ))}
            <p className="mt-2">Thank you for using arogyNetr.</p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button onClick={() => navigate('/health-form')} className="pill-button-primary flex-1">
            New Assessment
          </button>
          <button onClick={() => navigate('/')} className="pill-button-outline flex-1">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
