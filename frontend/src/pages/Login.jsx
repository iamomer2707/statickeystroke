import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/ui/GlassCard';
import CyberInput from '../components/ui/CyberInput';
import NeonButton from '../components/ui/NeonButton';
import ParticleBackground from '../components/layout/ParticleBackground';
import Navbar from '../components/layout/Navbar';
import API from '../api/axios';

export default function Login() {
  const location = useLocation();
  const initialAdmin =
    location.pathname.startsWith('/admin') || location.state?.mode === 'admin';
  const [formData, setFormData] = useState({ loginid: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(initialAdmin);
  const { login, adminLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isAdminMode) {
        const res = await API.post('/admin-login/', {
          username: formData.loginid,
          password: formData.password,
        });
        if (res.data.success) {
          adminLogin();
          toast.success('Admin access granted');
          navigate('/admin');
        }
      } else {
        const res = await API.post('/login/', formData);
        if (res.data.success) {
          login(res.data.user);
          toast.success(`Welcome back, ${res.data.user.name}`);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <ParticleBackground />
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10 pt-20"
      >
        <div className="flex justify-center mb-5">
          <div className="inline-flex rounded-xl bg-white/[0.04] border border-white/[0.08] p-1">
            {[
              { key: false, label: 'User' },
              { key: true, label: 'Admin' },
            ].map((opt) => (
              <button
                key={String(opt.key)}
                onClick={() => setIsAdminMode(opt.key)}
                className={`relative px-5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isAdminMode === opt.key
                    ? 'text-cyber-text'
                    : 'text-cyber-muted hover:text-cyber-text'
                }`}
              >
                {isAdminMode === opt.key && (
                  <motion.div
                    layoutId="login-pill"
                    className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.12]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <GlassCard className="p-7" gradient>
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyber-primary/10 border border-cyber-primary/25 mb-4">
              {isAdminMode ? (
                <Shield size={26} className="text-cyber-primary" aria-hidden="true" />
              ) : (
                <LogIn size={26} className="text-cyber-primary" aria-hidden="true" />
              )}
            </div>
            <h2 className="font-display text-2xl font-semibold text-cyber-text tracking-tight mb-1">
              {isAdminMode ? 'Admin sign in' : 'Welcome back'}
            </h2>
            <p className="text-sm text-cyber-muted">
              {isAdminMode
                ? 'Enter your admin credentials.'
                : 'Sign in to continue to your dashboard.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <CyberInput
              label={isAdminMode ? 'Username' : 'Login ID'}
              icon={User}
              placeholder={isAdminMode ? 'admin' : 'Your login ID'}
              value={formData.loginid}
              onChange={(e) => setFormData({ ...formData, loginid: e.target.value })}
              required
            />
            <CyberInput
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <NeonButton
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              variant={isAdminMode ? 'accent' : 'primary'}
              icon={isAdminMode ? Shield : LogIn}
              iconRight={ArrowRight}
            >
              {loading
                ? 'Verifying…'
                : isAdminMode
                  ? 'Sign in as admin'
                  : 'Sign in'}
            </NeonButton>
          </form>

          {!isAdminMode && (
            <div className="mt-6 text-center">
              <p className="text-xs text-cyber-muted">
                No account yet?{' '}
                <Link to="/register" className="text-cyber-primary hover:text-cyber-text transition-colors font-medium">
                  Create one
                </Link>
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
