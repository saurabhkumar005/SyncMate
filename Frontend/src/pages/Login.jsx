// src/pages/Login.jsx
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
        err?.response?.data?.message || err?.response?.data?.error || 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
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
          Welcome back 👋
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Sign in to continue to your workspace
        </p>

        {/* Error */}
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
          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="login-email"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}
            >
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray-400)' }}
              />
              <input
                id="login-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label
                htmlFor="login-password"
                style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <button
                type="button"
                style={{ fontSize: '0.78rem', color: 'var(--saffron-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray-400)' }}
              />
              <input
                id="login-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--warm-gray-400)',
                  display: 'flex',
                }}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Signing in...
              </span>
            ) : 'Sign in'}
          </button>
        </form>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--saffron-600)', fontWeight: 600, textDecoration: 'none' }}>
            Create one free
          </Link>
        </p>

        {/* Divider + Sanskrit */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
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