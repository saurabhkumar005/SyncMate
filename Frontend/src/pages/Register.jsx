import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Flame, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { registerUser } from '../api/auth.api.js';

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
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
    if (p.length < 6) return { level: 'weak',   color: '#ef4444', label: 'Weak',   pct: '33%' };
    if (p.length < 10) return { level: 'medium', color: '#f59e0b', label: 'Medium', pct: '66%' };
    return              { level: 'strong',  color: '#22c55e', label: 'Strong',  pct: '100%' };
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
        <div className="auth-grid">

          {/* Left aside — hidden on mobile, shown on lg+ */}
          <section className="auth-aside">
            <div className="auth-aside-top">
              <div>
                <p className="auth-highlight">New account</p>
              </div>
              <div className="auth-logo-icon">
                <Flame size={24} strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <h3>Create your SyncMate workspace</h3>
              <p>Build study groups, share ideas, and chat with your team in one polished workspace designed for learners.</p>
            </div>

            <div className="auth-benefits">
              {[
                { title: 'Smart collaboration', desc: 'Real-time conversation and quick access to project rooms.' },
                { title: 'Secure access',        desc: 'Strong password guidance and safe account handling.' },
                { title: 'Designed for learners',desc: 'Simplified onboarding with a clean, distraction-free interface.' },
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
              Have an account?{' '}
              <Link to="/login" className="auth-link">Sign in instead</Link>
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
              <h2 className="auth-title">Create your account</h2>
              <p className="auth-subtitle">Join thousands of students &amp; developers in a smarter learning community.</p>
            </div>

            {error && (
              <div className="auth-error">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field">
                <label className="auth-label" htmlFor="full_name">Full Name</label>
                <div className="auth-input-wrap">
                  <User size={18} className="auth-input-icon" />
                  <input
                    id="full_name" name="full_name" type="text"
                    className="form-input"
                    placeholder="Alex Morgan"
                    value={form.full_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="username">Username</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon" style={{ fontWeight: 600, fontSize: '1rem' }}>@</span>
                  <input
                    id="username" name="username" type="text"
                    className="form-input"
                    placeholder="alexmorgan"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="email">Email</label>
                <div className="auth-input-wrap">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="email" name="email" type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="password">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="password" name="password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingRight: '2.75rem' }}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={handleChange}
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
                {strength && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{
                      height: 5, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', width: strength.pct,
                        background: strength.color,
                        borderRadius: 99,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', fontWeight: 600, color: strength.color }}>
                      {strength.label} password
                    </p>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <div className="btn-spinner" /> : 'Create account'}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>

            <div className="auth-quote">योगः कर्मसु कौशलम् — Excellence in action</div>
          </div>
        </div>
      </div>
    </div>
  );
}
