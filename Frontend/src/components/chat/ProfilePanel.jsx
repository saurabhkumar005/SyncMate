// src/components/chat/ProfilePanel.jsx
import { useState } from 'react';
import { X, User, Search, BellOff, MoreHorizontal, Image, FileText, Archive, Download } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext.jsx';
import UserAvatar from '../ui/UserAvatar.jsx';

const TABS = ['Details', 'Media & Files'];

const MOCK_MEDIA = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=120&h=120&fit=crop',
];

const MOCK_FILES = [
  { name: 'chat-flow-diagram.png', size: '1.2 MB', date: 'Yesterday', type: 'img' },
  { name: 'requirements-docs.pdf', size: '2.1 MB', date: '2 days ago', type: 'pdf' },
  { name: 'component-structure.zip', size: '4.3 MB', date: '3 days ago', type: 'zip' },
];

const fileIconColors = {
  pdf: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  img: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  zip: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  doc: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
};

export default function ProfilePanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('Details');
  const { selectedConversation, currentUserId } = useChatContext();

  const otherParticipant = selectedConversation?.participants?.find(
    (p) => p.id !== currentUserId
  );

  const displayUser = otherParticipant || {
    name: selectedConversation?.name || 'Unknown',
    username: '',
    bio: '',
  };

  return (
    <aside className={`details-panel ${isOpen ? 'open' : 'closed'}`} aria-label="Details panel">
      {/* Header */}
      <div className="details-header">
        <div className="details-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`details-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close details panel">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="details-body">
        {activeTab === 'Details' && (
          <>
            {/* Profile center */}
            <div className="details-profile-center">
              <UserAvatar user={displayUser} size="2xl" showStatus status="online" />
              <p className="details-name">{displayUser.name || displayUser.username}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="status-dot online" style={{ position: 'static', border: 'none' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--online)', fontWeight: 500 }}>
                  Online
                </span>
              </div>

              {/* Quick actions */}
              <div className="details-quick-actions">
                {[
                  { icon: User, label: 'Profile' },
                  { icon: Search, label: 'Search' },
                  { icon: BellOff, label: 'Mute' },
                  { icon: MoreHorizontal, label: 'More' },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="quick-action" aria-label={label}>
                    <div className="quick-action-icon">
                      <Icon size={18} strokeWidth={1.8} />
                    </div>
                    <span className="quick-action-label">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="details-section">
              <div className="details-section-title">About</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {displayUser.bio || 'Full Stack Developer and UI/UX Enthusiast.'}
              </p>
              <button style={{
                fontSize: '0.8rem',
                color: 'var(--saffron-600)',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginTop: '0.3rem',
              }}>
                View more
              </button>
            </div>

            {/* Shared Media preview */}
            <div className="details-section">
              <div className="details-section-title">
                Shared Media
                <span className="details-section-action" onClick={() => setActiveTab('Media & Files')}>
                  View all
                </span>
              </div>
              <div className="media-grid">
                {MOCK_MEDIA.slice(0, 5).map((src, i) => (
                  <div key={i} className="media-thumb">
                    <img src={src} alt={`Shared media ${i + 1}`} loading="lazy" />
                    {i === 4 && (
                      <div className="media-thumb-overlay">+12</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Files */}
            <div className="details-section">
              <div className="details-section-title">
                Shared Files
                <span className="details-section-action">View all</span>
              </div>
              <div>
                {MOCK_FILES.map((file, i) => {
                  const style = fileIconColors[file.type] || { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' };
                  return (
                    <div key={i} className="shared-file-item">
                      <div
                        className="file-icon"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: style.bg,
                          color: style.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {file.type === 'img' ? <Image size={17} strokeWidth={1.8} /> : <FileText size={17} strokeWidth={1.8} />}
                      </div>
                      <div className="shared-file-meta">
                        <div className="shared-file-name">{file.name}</div>
                        <div className="shared-file-info">{file.size} · {file.date}</div>
                      </div>
                      <button className="icon-btn" style={{ width: 28, height: 28 }} aria-label="Download file">
                        <Download size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'Media & Files' && (
          <>
            <div className="details-section">
              <div className="details-section-title">Photos & Videos</div>
              <div className="media-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {MOCK_MEDIA.map((src, i) => (
                  <div key={i} className="media-thumb">
                    <img src={src} alt={`Media ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">
              <div className="details-section-title">Files</div>
              {MOCK_FILES.map((file, i) => {
                const style = fileIconColors[file.type] || { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' };
                return (
                  <div key={i} className="shared-file-item">
                    <div
                      className="file-icon"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: style.bg,
                        color: style.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={17} strokeWidth={1.8} />
                    </div>
                    <div className="shared-file-meta">
                      <div className="shared-file-name">{file.name}</div>
                      <div className="shared-file-info">{file.size} · {file.date}</div>
                    </div>
                    <button className="icon-btn" style={{ width: 28, height: 28 }} aria-label="Download file">
                      <Download size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
