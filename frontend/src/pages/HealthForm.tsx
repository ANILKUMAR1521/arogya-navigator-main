import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, LogOut } from 'lucide-react';
import { getUser, clearUser } from '@/lib/userStore';
import type { HealthFormData } from '@/lib/analysisEngine';

const ease = [0.22, 1, 0.36, 1] as const;

const HealthForm = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [formData, setFormData] = useState<HealthFormData>({
    diabetes: 'No', asthma: 'No', heartDisease: 'No',
    pregnancy: 'No', smoking: 'No', alcohol: 'No', exerciseFrequency: 'Weekly',
  });

  useEffect(() => {
    if (!user) navigate('/register');
  }, [user, navigate]);

  const showPregnancy = user?.gender === 'Female' || user?.gender === 'Transgender';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data in sessionStorage for the loading/results flow
    sessionStorage.setItem('healthFormData', JSON.stringify(formData));
    navigate('/loading');
  };

  const Toggle = ({ field, label }: { field: keyof HealthFormData; label: string }) => (
    <div className="clinical-card">
      <label className="block text-sm font-medium mb-3">{label}</label>
      <div className="flex gap-2">
        {['Yes', 'No'].map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => setFormData({ ...formData, [field]: opt })}
            className={formData[field] === opt ? 'toggle-option-active' : 'toggle-option-inactive'}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="display-text text-lg">arogyNetr</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">{user?.name}</span>
          <button onClick={() => { clearUser(); navigate('/'); }} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-6 py-8 space-y-10"
      >
        <div>
          <h1 className="display-text text-3xl mb-2">Health Assessment</h1>
          <p className="text-muted-foreground text-sm">Complete this form for your personalized health risk analysis.</p>
        </div>

        {/* Section 1: Clinical Background */}
        <section>
          <p className="section-number">01. Clinical Background</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Toggle field="diabetes" label="Diabetes" />
            <Toggle field="asthma" label="Asthma" />
            <Toggle field="heartDisease" label="Heart Disease" />
            {showPregnancy && <Toggle field="pregnancy" label="Pregnancy" />}
          </div>
        </section>

        {/* Section 2: Daily Lifestyle */}
        <section>
          <p className="section-number">02. Daily Lifestyle</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Toggle field="smoking" label="Do you smoke?" />
            <Toggle field="alcohol" label="Do you consume alcohol?" />
          </div>

          <div className="clinical-card mt-4">
            <label className="block text-sm font-medium mb-3">How often do you exercise?</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Daily', 'Weekly', 'Rarely', 'Never'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormData({ ...formData, exerciseFrequency: opt })}
                  className={formData.exerciseFrequency === opt ? 'toggle-option-active' : 'toggle-option-inactive'}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button type="submit" className="pill-button-primary w-full text-base">
          Analyze Health Data
        </button>
      </motion.form>
    </div>
  );
};

export default HealthForm;
