import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Smartphone } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="display-text text-lg">arogyNetr</span>
        </div>
        <button onClick={() => navigate('/register')} className="pill-button-primary text-sm py-2.5 px-6">
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease }}
          className="mono-label mb-6"
        >
          Automated Health Assessment
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="display-text text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6"
        >
          Your health,
          <br />
          precisely analyzed.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-lg mb-10"
        >
          Register, complete a quick health assessment, and receive an instant risk analysis with personalized recommendations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button onClick={() => navigate('/register')} className="pill-button-primary text-base">
            Start Health Check
          </button>
          <button className="pill-button-outline text-base">
            Learn More
          </button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 w-full"
        >
          {[
            { icon: Activity, title: 'Risk Analysis', desc: 'Rule-based health scoring with age-specific vital ranges' },
            { icon: Shield, title: 'Secure Data', desc: 'Your health information is protected and private' },
            { icon: Smartphone, title: 'SMS Alerts', desc: 'Receive your health report directly via SMS' },
          ].map((f, i) => (
            <div key={i} className="clinical-card text-left">
              <f.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="py-8 text-center">
        <p className="mono-label">© 2026 arogyNetr</p>
      </footer>
    </div>
  );
};

export default Landing;
