// src/components/layout/TopBar.jsx
import { useContext, useState } from 'react';
import { Bell, MessageCircle, ChevronDown, Search, Menu, Flame } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import UserAvatar from '../ui/UserAvatar.jsx';

export default function TopBar({ onMenuClick }) {
  const { user } = useContext(AuthContext);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="top-bar" role="banner">
      {/* Mobile hamburger - visible only on mobile via CSS */}
      <button
        className="icon-btn mobile-only"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        id="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <div
          className="navbar-logo"
          style={{ width: 32, height: 32, borderRadius: 8, fontSize: '0.85rem' }}
        >
          <Flame size={15} strokeWidth={2.5} />
        </div>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: '1.05rem',
          color: 'var(--text-primary)',
        }}>
          SyncMate
        </span>
      </div>

      {/* Global Search */}
      <div
        className="top-search"
        style={{ flex: 1, maxWidth: 480 }}
        role="search"
      >
        <Search size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search messages, users or rooms..."
          aria-label="Global search"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <span className="kbd-shortcut">⌘ K</span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button className="user-menu-btn" aria-label="User menu" aria-haspopup="true">
          <UserAvatar user={user} size="sm" showStatus status="online" />
          <div style={{ textAlign: 'left' }}>
            <div className="user-menu-name">
              {user?.name || user?.username || 'User'}
            </div>
            <div className="user-menu-role">
              {user?.role || 'Student'}
            </div>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </header>
  );
}
