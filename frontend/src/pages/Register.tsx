import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Phone, Chrome } from 'lucide-react';
import { setUser, type UserData } from '@/lib/userStore';

const ease = [0.22, 1, 0.36, 1] as const;

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', gender: '' as UserData['gender'] | '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) e.age = 'Valid age required';
    if (!form.gender) e.gender = 'Select gender';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAuth = (method: 'phone' | 'google') => {
    if (!validate()) return;
    const userData: UserData = {
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender as UserData['gender'],
      authMethod: method,
    };
    setUser(userData);
    if (method === 'phone') {
      navigate('/otp');
    } else {
      // Simulate Google login success
      navigate('/health-form');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="display-text text-lg">arogyNetr</span>
        </div>

        <h1 className="display-text text-3xl mb-2">Create your account</h1>
        <p className="text-muted-foreground text-sm mb-8">Enter your details to get started with your health assessment.</p>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="mono-label mb-2 block">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your name"
              className="input-field"
              maxLength={100}
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="mono-label mb-2 block">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={e => setForm({ ...form, age: e.target.value })}
              placeholder="Enter your age"
              className="input-field"
              min={1}
              max={120}
            />
            {errors.age && <p className="text-destructive text-xs mt-1">{errors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="mono-label mb-2 block">Gender</label>
            <div className="flex gap-2">
              {(['Male', 'Female', 'Transgender'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({ ...form, gender: g })}
                  className={form.gender === g ? 'toggle-option-active' : 'toggle-option-inactive'}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender}</p>}
          </div>

          {/* Auth buttons */}
          <div className="pt-4 space-y-3">
            <button onClick={() => handleAuth('phone')} className="pill-button-primary w-full flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Register with Phone
            </button>
            <button onClick={() => handleAuth('google')} className="pill-button-outline w-full flex items-center justify-center gap-2">
              <Chrome className="w-4 h-4" />
              Register with Google
            </button>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-8">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
