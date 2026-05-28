// src/components/chat/ChatWindow.jsx
import { useEffect, useRef, useContext } from 'react';
import { Phone, Video, Search, Info, ArrowLeft, Hash } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import MessageInput from './MessageInput.jsx';

/* ─── Helpers ─── */
function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDateLabel(dateStr) {
  const d    = new Date(dateStr);
  const diff = Math.floor((Date.now() - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
}

function groupByDate(messages) {
  const groups = {};
  messages.forEach((msg) => {
    const key = new Date(msg.created_at || Date.now()).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(msg);
  });
  return groups;
}

function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ─── ChatWindow ─── */
export default function ChatWindow({ onInfoClick, onBack, showBack = false }) {
  const bottomRef = useRef(null);
  const { user }  = useContext(AuthContext);
  const {
    selectedConversation,
    currentMessages,
    messagesLoading,
    typingUsers,
    selectedConversationId,
  } = useChatContext();

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  /* ── Empty state ── */
  if (!selectedConversationId) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 12, background: '#ece5dd',
      }}>
        <div style={{ fontSize: '4rem' }}>💬</div>
        <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#334155' }}>SyncMate Chat</div>
        <div style={{ color: '#94a3b8', fontSize: '0.88rem', textAlign: 'center', maxWidth: 240 }}>
          Pick a conversation or click ✏️ to start a new one.
        </div>
      </div>
    );
  }

  /* ── Derived values ── */
  const myId       = Number(user?.id);
  const otherUser  = selectedConversation?.participants?.find(p => Number(p.id) !== myId) || null;
  const isGroup    = selectedConversation?.type === 'group';
  const displayName =
    selectedConversation?.group_name ||
    otherUser?.full_name ||
    otherUser?.username ||
    `Chat #${selectedConversationId}`;

  const typingList = typingUsers[selectedConversationId] || [];
  const isTyping   = typingList.length > 0;
  const msgGroups  = groupByDate(currentMessages);

  return (
    <div className="chat-window" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ══ Header ══ */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 16px', background: '#fff',
        borderBottom: '1px solid #e8e0d6', flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        {showBack && (
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Avatar */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: isGroup
            ? 'linear-gradient(135deg,#6366f1,#4f46e5)'
            : 'linear-gradient(135deg,#f97316,#ea6f0a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '0.85rem',
        }}>
          {isGroup ? <Hash size={16} /> : initials(displayName)}
        </div>

        {/* Name / status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 1 }}>
            {isTyping
              ? <span style={{ color: '#16a34a', fontStyle: 'italic' }}>typing…</span>
              : isGroup && selectedConversation?.participants
                ? `${selectedConversation.participants.length} members`
                : null
            }
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {[
            { Icon: Search, label: 'Search' },
            { Icon: Phone,  label: 'Call' },
            { Icon: Video,  label: 'Video' },
            { Icon: Info,   label: 'Details', onClick: onInfoClick },
          ].map(({ Icon, label, onClick }) => (
            <button key={label} className="icon-btn" onClick={onClick} aria-label={label} title={label}>
              <Icon size={17} strokeWidth={1.8} />
            </button>
          ))}
        </div>
      </div>

      {/* ══ Messages Area ══ */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex',
        flexDirection: 'column', background: '#ece5dd',
        padding: '8px 0',
      }}>

        {/* Loading */}
        {messagesLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="loading-spinner" />
          </div>
        )}

        {/* No messages */}
        {!messagesLoading && currentMessages.length === 0 && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8, padding: '2rem',
          }}>
            <span style={{ fontSize: '2.5rem' }}>👋</span>
            <p style={{ fontWeight: 600, color: '#374151', margin: 0 }}>Say hello to {displayName}!</p>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: 0 }}>No messages yet. Start the conversation!</p>
          </div>
        )}

        {/* Message groups by date */}
        {!messagesLoading && Object.entries(msgGroups).map(([dateStr, msgs]) => (
          <div key={dateStr}>

            {/* ── Date chip ── */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
              <span style={{
                background: '#d1f2e8', color: '#065f46', fontSize: '0.72rem',
                fontWeight: 600, padding: '3px 12px', borderRadius: 20,
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              }}>
                {formatDateLabel(dateStr)}
              </span>
            </div>

            {/* ── Bubbles ── */}
            {msgs.map((msg, idx) => {
              /*
               * WhatsApp convention:
               *   isSent = true  → YOU sent it  → RIGHT side  (green bubble)
               *   isSent = false → THEY sent it → LEFT  side  (white bubble)
               */
              const isSent   = Number(msg.sender_id) === myId;
              const prevSame = idx > 0 && Number(msgs[idx - 1].sender_id) === Number(msg.sender_id);
              const nextSame = idx < msgs.length - 1 && Number(msgs[idx + 1].sender_id) === Number(msg.sender_id);
              const showAvatar = !isSent && !nextSame; // avatar on last message of a group

              // Border radius — "tail" at bottom corner of first bubble in group
              const radius = isSent
                ? (prevSame ? '18px 4px 4px 18px' : '18px 4px 18px 18px')   // right bubbles
                : (prevSame ? '4px 18px 18px 18px' : '4px 18px 18px 18px'); // left bubbles — tail top-left on first

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: isSent ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    padding: `1px ${isSent ? '12px' : '8px'} 1px ${isSent ? '8px' : '8px'}`,
                    marginBottom: nextSame ? 1 : 6,
                  }}
                >
                  {/* ── Receiver avatar (LEFT side) ── */}
                  {!isSent && (
                    <div style={{ width: 30, height: 30, flexShrink: 0, marginRight: 6, alignSelf: 'flex-end' }}>
                      {showAvatar ? (
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                        }}>
                          {initials(msg.username || otherUser?.username || '?')}
                        </div>
                      ) : (
                        <div style={{ width: 30 }} />
                      )}
                    </div>
                  )}

                  {/* ── Bubble ── */}
                  <div style={{ maxWidth: '68%' }}>
                    {/* Group sender name — received only, first in run */}
                    {!isSent && !prevSame && isGroup && (
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7c3aed', marginBottom: 2, paddingLeft: 4 }}>
                        {msg.username || 'Unknown'}
                      </div>
                    )}

                    <div style={{
                      padding: '7px 10px 4px 10px',
                      borderRadius: radius,
                      /* YOUR messages: green tint (WhatsApp style) */
                      background: isSent ? '#d9fdd3' : '#ffffff',
                      color: '#111827',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.13)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}

                      {/* Time + tick — inline, right-aligned */}
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'flex-end', gap: 2,
                        marginTop: 2, marginBottom: -1,
                      }}>
                        <span style={{ fontSize: '0.63rem', color: '#8a9da0' }}>
                          {formatTime(msg.created_at)}
                        </span>
                        {isSent && (
                          <span style={{ fontSize: '0.75rem', color: '#53bdeb', lineHeight: 1 }}>
                            {msg.status === 'sending' ? '🕐' : '✓✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '2px 8px 8px', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 30 }} />
            <div style={{
              padding: '9px 14px', borderRadius: '4px 18px 18px 18px',
              background: '#fff', boxShadow: '0 1px 1px rgba(0,0,0,0.13)',
              display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#b0b7bc',
                  display: 'inline-block',
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ══ Message Input ══ */}
      <MessageInput />
    </div>
  );
}
