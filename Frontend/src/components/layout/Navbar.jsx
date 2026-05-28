// src/components/layout/Navbar.jsx
import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Users, MessageCircle, CheckSquare, Calendar,
  BookOpen, FileText, Timer, FolderOpen, User2,
  Trophy, Settings, Menu, X, ChevronDown, LogOut,
  Flame
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useChatContext } from '../../context/ChatContext.jsx';
import UserAvatar from '../ui/UserAvatar.jsx';

const NAV_ITEMS = [
  { id: 'messages',    label: 'Messages',     icon: MessageCircle,  path: '/chat',    badge: true },
];

export default function Navbar({ isMobileOpen, onMobileClose }) {
  const [expanded, setExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { totalUnread } = useChatContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobileOpen) onMobileClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/chat' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="mobile-overlay" onClick={onMobileClose} />
      )}

      <nav
        className={`navbar ${expanded ? 'expanded' : 'collapsed'} ${isMobileOpen ? 'mobile-open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="navbar-header">
          <div className="navbar-logo" aria-label="SyncMate">
            <Flame size={18} strokeWidth={2.5} />
          </div>
          <span className="navbar-brand">SyncMate</span>
          {isMobileOpen && (
            <button
              className="icon-btn"
              onClick={onMobileClose}
              style={{ marginLeft: 'auto' }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Toggle button (desktop) */}
        <div style={{ padding: '0.5rem 0.75rem 0', display: 'flex', justifyContent: expanded ? 'flex-end' : 'center' }}>
          <button
            className="navbar-toggle"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="navbar-nav">
          <div className="nav-section-label" style={{ opacity: expanded ? 1 : 0, transition: 'opacity 0.2s' }}>Chat Application</div>

          {NAV_ITEMS.map(({ id, label, icon: Icon, path, badge }) => (
            <button
              key={id}
              className={`nav-item ${isActive(path) ? 'active' : ''}`}
              onClick={() => handleNavClick(path)}
              title={!expanded ? label : undefined}
              aria-label={label}
            >
              <span className="nav-icon">
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <span className="nav-label">{label}</span>
              {badge && totalUnread > 0 && (
                <span className="nav-badge">{totalUnread > 99 ? '99+' : totalUnread}</span>
              )}
            </button>
          ))}
        </div>

        {/* Sanskrit Quote */}
        <div className="navbar-quote mandala-bg">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: 'serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--saffron-600)',
              lineHeight: 1.4,
              marginBottom: '0.1rem',
            }}>
              योगः कर्मसु कौशलम्
            </p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Excellence in action
            </p>
          </div>
        </div>

        {/* User profile */}
        <div className="navbar-footer">
          <div
            className="user-profile-mini"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
          >
            <UserAvatar user={user} size="sm" showStatus status="online" />
            <div className="nav-label" style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user?.name || user?.username || 'User'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {user?.role || 'Student'}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }}
              className="nav-label" />
          </div>

          {userMenuOpen && expanded && (
            <div style={{
              margin: '0.25rem 0.5rem',
              background: 'var(--warm-gray-50)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
            }}>
              <button
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  color: '#ef4444',
                  fontWeight: 500,
                }}
                onClick={handleLogout}
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
