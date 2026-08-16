import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Flame, Mail, Lock, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { loginUser } from '../api/auth.api.js';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
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
        {/* Two-column on lg+, single column on smaller screens */}
        <div className="auth-grid">

          {/* Left aside — hidden on mobile, visible on lg+ */}
          <section className="auth-aside">
            <div className="auth-aside-top">
              <div>
                <p className="auth-highlight">Welcome back</p>
              </div>
              <div className="auth-logo-icon">
                <Flame size={24} strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <h3>Sign in and get back to your flow</h3>
              <p>Reconnect with your study circle, resume active chats, and continue collaborating with a clean workspace.</p>
            </div>

            <div className="auth-benefits">
              {[
                { title: 'Quick access', desc: 'Jump directly into your chat rooms and teammates.' },
                { title: 'Secure sign in', desc: 'Encrypted auth and modern password controls.' },
                { title: 'Focused workspace', desc: 'Minimal distractions and clear navigation.' },
              ].map((b) => (
                <div key={b.title} className="auth-benefit">
                  <span />
                  <div>
                    <strong>{b.title}</strong>
                    <div>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="auth-note">
              New to SyncMate?{' '}
              <Link to="/register" className="auth-link">
                Create an account
              </Link>
            </div>
          </section>

          {/* Right form panel */}
          <div className="auth-panel">
            <div className="auth-form-header">
              <div className="auth-brand-row">
                <div className="auth-brand-icon">
                  <Flame size={18} />
                </div>
                <span className="auth-brand-label">SyncMate</span>
              </div>
              <h2 className="auth-title">Welcome back</h2>
              <p className="auth-subtitle">Sign in to continue to your workspace.</p>
            </div>

            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field">
                <label className="auth-label" htmlFor="email">
                  Email or Username
                </label>
                <div className="auth-input-wrap">
                  <Mail size={18} className="auth-input-icon" />
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

              <div className="auth-field">
                <div className="auth-label-row">
                  <label className="auth-label" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="auth-forgot-btn"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="auth-input-wrap">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingRight: '2.75rem' }}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="auth-eye-btn"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <div className="btn-spinner" />
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="auth-switch-text">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one free
              </Link>
            </p>

            <div className="auth-quote">योगः कर्मसु कौशलम् — Excellence in action</div>
          </div>
        </div>
      </div>
    </div>
  );
}