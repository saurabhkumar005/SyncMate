// src/components/layout/TopBar.jsx
import { useContext, useState } from 'react';
import { Bell, Search, Menu, Flame, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import UserAvatar from '../ui/UserAvatar.jsx';

export default function TopBar({ onMenuClick }) {
  const { user } = useContext(AuthContext);
  const [searchOpen, setSearchOpen] = useState(false);

  // Prefer full_name, fallback to username
  const displayName = user?.full_name || user?.name || user?.username || 'User';

  return (
    <header className="top-bar" role="banner">

      {/* Mobile hamburger — visible only on mobile */}
      <button
        className="icon-btn mobile-only"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        id="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Logo — always visible */}
      <div className="top-bar-logo">
        <div className="navbar-logo" style={{ width: 32, height: 32, borderRadius: 8, fontSize: '0.85rem' }}>
          <Flame size={15} strokeWidth={2.5} />
        </div>
        <span className="top-bar-brand">SyncMate</span>
      </div>

      {/* Global Search — full bar on desktop, icon-only on mobile */}
      {searchOpen ? (
        /* Mobile expanded search overlay */
        <div className="top-search-expanded mobile-only">
          <Search size={15} strokeWidth={2} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search messages or users..."
            aria-label="Search"
            autoFocus
          />
          <button
            className="icon-btn"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            style={{ flexShrink: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      ) : null}

      {/* Desktop search bar */}
      <div className="top-search desktop-only" role="search">
        <Search size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search messages, users or rooms..."
          aria-label="Global search"
        />
        {/* ⌘K shortcut — desktop only, no point showing on mobile */}
        <span className="kbd-shortcut">⌘ K</span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right actions */}
      <div className="top-bar-actions">
        {/* Search icon — mobile only, opens expanded search */}
        <button
          className="icon-btn mobile-only"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          <Search size={18} strokeWidth={1.8} />
        </button>

        {/* User info — compressed on mobile */}
        <button className="user-menu-btn" aria-label="User menu" aria-haspopup="true">
          <UserAvatar user={user} size="sm" showStatus status="online" />
          {/* Name + role only on medium+ screens */}
          <div className="user-menu-text">
            <div className="user-menu-name">{displayName}</div>
            <div className="user-menu-role">{user?.role || 'Student'}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
