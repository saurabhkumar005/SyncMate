import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Flame, Mail, Lock, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { loginUser } from '../api/auth.api.js';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  // We can use either email or username, backend allows identifier 'email' | 'username'
  // and 'password'
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data);
      navigate('/chat');
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.response?.data?.error || 'Invalid credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <section className="auth-aside">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="auth-highlight">Welcome back</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center text-white shadow-saffron">
                <Flame size={24} strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <h3>Sign in and get back to your flow</h3>
              <p>Reconnect with your study circle, resume active chats, and continue collaborating with a clean workspace.</p>
            </div>

            <div className="space-y-4">
              <div className="auth-benefit">
                <span />
                <div>
                  <strong>Quick access</strong>
                  <div>Jump directly into your chat rooms and teammates.</div>
                </div>
              </div>
              <div className="auth-benefit">
                <span />
                <div>
                  <strong>Secure sign in</strong>
                  <div>Encrypted auth and modern password controls.</div>
                </div>
              </div>
              <div className="auth-benefit">
                <span />
                <div>
                  <strong>Focused workspace</strong>
                  <div>Minimal distractions and clear navigation.</div>
                </div>
              </div>
            </div>

            <div className="auth-note">
              New to SyncMate?{' '}
              <Link to="/register" className="font-semibold text-saffron-700 hover:underline">
                Create an account
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
              <h2 className="text-3xl font-semibold text-slate-900">Welcome back</h2>
              <p className="text-sm text-slate-600">Sign in to continue to your workspace.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="text"
                    className="form-input"
                    placeholder="you@example.com or @username"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-saffron-700 hover:text-saffron-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input pr-11"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-saffron-700 hover:underline">
                Create one free
              </Link>
            </p>

            <div className="text-center text-xs text-slate-400 italic">योगः कर्मसु कौशलम् — Excellence in action</div>
          </div>
        </div>
      </div>
    </div>
  );
}