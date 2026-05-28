import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Flame, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { registerUser } from '../api/auth.api.js';

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  // Backend requires full_name, username, email, password
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { level: 'weak', color: 'bg-red-500', text: 'text-red-500', label: 'Weak' };
    if (p.length < 10) return { level: 'medium', color: 'bg-amber-500', text: 'text-amber-500', label: 'Medium' };
    return { level: 'strong', color: 'bg-green-500', text: 'text-green-500', label: 'Strong' };
  };
  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.username || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data);
      navigate('/chat');
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <section className="auth-aside">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="auth-highlight">New account</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center text-white shadow-saffron">
                <Flame size={24} strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <h3>Create your SyncMate workspace</h3>
              <p>Build study groups, share ideas, and chat with your team in one polished workspace designed for learners.
              </p>
            </div>

            <div className="space-y-4">
              <div className="auth-benefit">
                <span />
                <div>
                  <strong>Smart collaboration</strong>
                  <div>Real-time conversation and quick access to project rooms.</div>
                </div>
              </div>
              <div className="auth-benefit">
                <span />
                <div>
                  <strong>Secure access</strong>
                  <div>Strong password guidance and safe account handling.</div>
                </div>
              </div>
              <div className="auth-benefit">
                <span />
                <div>
                  <strong>Designed for learners</strong>
                  <div>Simplified onboarding with a clean, distraction-free interface.</div>
                </div>
              </div>
            </div>

            <div className="auth-note">
              Have an account?{' '}
              <Link to="/login" className="font-semibold text-saffron-700 hover:underline">
                Sign in instead
              </Link>
            </div>
          </section>

          <div className="auth-panel">
            <div className="auth-form-header">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-saffron-50 flex items-center justify-center text-saffron-600">
                  <Flame size={18} />
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-saffron-700">SyncMate</span>
              </div>
              <h2 className="text-3xl font-semibold text-slate-900">Create your account</h2>
              <p className="text-sm text-slate-600">Join thousands of students & developers in a smarter learning community.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="full_name">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    className="form-input"
                    placeholder="Alex Morgan"
                    value={form.full_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">@</span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="form-input"
                    placeholder="alexmorgan"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input pr-11"
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-3">
                    <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-100">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.level === 'weak' ? '33%' : strength.level === 'medium' ? '66%' : '100%' }}></div>
                    </div>
                    <p className={`text-xs mt-2 font-medium ${strength.text}`}>{strength.label} password</p>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-saffron-700 hover:underline">
                Sign in
              </Link>
            </p>

            <div className="text-center text-xs text-slate-400 italic">योगः कर्मसु कौशलम् — Excellence in action</div>
          </div>
        </div>
      </div>
    </div>
  );
}
