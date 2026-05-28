// src/components/layout/AppLayout.jsx
// The main authenticated app shell with navbar + topbar + content area
import { useState, useCallback } from 'react';
import Navbar from './Navbar.jsx';
import TopBar from './TopBar.jsx';

export default function AppLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const openNav = useCallback(() => setMobileNavOpen(true), []);
  const closeNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="app-layout">
      {/* Left Navbar */}
      <Navbar isMobileOpen={mobileNavOpen} onMobileClose={closeNav} />

      {/* Right: topbar + main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar onMenuClick={openNav} />
        <main
          style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
