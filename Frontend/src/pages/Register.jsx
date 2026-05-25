// src/pages/Register.jsx
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Flame, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
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
    if (p.length < 6) return { level: 'weak', color: '#ef4444', label: 'Weak' };
    if (p.length < 10) return { level: 'medium', color: '#f59e0b', label: 'Medium' };
    return { level: 'strong', color: '#22c55e', label: 'Strong' };
  };
  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data);
      navigate('/chat');
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.response?.data?.error || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="navbar-logo" style={{ width: 44, height: 44, borderRadius: 12, fontSize: '1.1rem' }}>
            <Flame size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: '1.35rem',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}>
              SyncMate
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Collaborate · Learn · Grow
            </p>
          </div>
        </div>

        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: '1.2rem',
          color: 'var(--text-primary)',
          marginBottom: '0.25rem',
        }}>
          Create your account ✨
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Join thousands of students & developers on SyncMate
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            color: '#dc2626',
            fontSize: '0.85rem',
          }}>
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div style={{ marginBottom: '0.85rem' }}>
            <label htmlFor="reg-name" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray-400)' }} />
              <input
                id="reg-name"
                name="full_name"
                type="text"
                className="form-input"
                placeholder="Alex Morgan"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Username */}
          <div style={{ marginBottom: '0.85rem' }}>
            <label htmlFor="reg-username" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray-400)', fontSize: '0.9rem' }}>@</span>
              <input
                id="reg-username"
                name="username"
                type="text"
                className="form-input"
                placeholder="alexmorgan"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                style={{ paddingLeft: '2rem' }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '0.85rem' }}>
            <label htmlFor="reg-email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray-400)' }} />
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="reg-password" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray-400)' }} />
              <input
                id="reg-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warm-gray-400)', display: 'flex' }}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {/* Strength bar */}
            {strength && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ height: 4, background: 'var(--warm-gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: strength.level === 'weak' ? '33%' : strength.level === 'medium' ? '66%' : '100%',
                    background: strength.color,
                    borderRadius: 4,
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }} />
                </div>
                <p style={{ fontSize: '0.72rem', color: strength.color, marginTop: '0.2rem', fontWeight: 600 }}>
                  {strength.label} password
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--saffron-600)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'serif', fontSize: '0.8rem', color: 'var(--saffron-600)', fontWeight: 600 }}>
            योगः कर्मसु कौशलम्
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.15rem' }}>
            Excellence in action · Bhagavad Gita 2.50
          </p>
        </div>
      </div>
    </div>
  );
}
