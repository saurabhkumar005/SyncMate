// src/components/chat/MessageBubble.jsx
import { useState } from 'react';
import { Check, CheckCheck, SmilePlus } from 'lucide-react';
import UserAvatar from '../ui/UserAvatar.jsx';
import FileCard from '../ui/FileCard.jsx';
import { formatTime } from '../../utils/helpers.js';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export default function MessageBubble({
  message,
  isSent,
  showAvatar = true,
  isFirstInGroup = true,
  isLastInGroup = true,
}) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactions, setReactions] = useState(message.reactions || []);

  const addReaction = (emoji) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r
        );
      }
      return [...prev, { emoji, count: 1 }];
    });
    setShowReactionPicker(false);
  };

  const hasFile = message.type === 'file' || message.attachment;
  const hasImage = message.type === 'image' || message.imageUrl;

  const renderStatus = () => {
    if (!isSent) return null;
    const status = message.status || 'sent';
    if (status === 'read') return <CheckCheck size={14} style={{ color: '#fff', opacity: 0.8 }} />;
    if (status === 'delivered') return <CheckCheck size={14} style={{ color: '#fff', opacity: 0.6 }} />;
    return <Check size={14} style={{ color: '#fff', opacity: 0.5 }} />;
  };

  return (
    <div
      className={`message-group ${isSent ? 'sent' : 'received'}`}
      style={{ alignItems: isLastInGroup ? 'flex-end' : 'flex-start' }}
      onMouseEnter={() => {}}
      onMouseLeave={() => setShowReactionPicker(false)}
    >
      {/* Avatar (received messages only) */}
      {!isSent && (
        <div className="message-avatar">
          {showAvatar && isLastInGroup ? (
            <UserAvatar
              user={message.sender || { name: message.sender_name }}
              size="sm"
            />
          ) : (
            <div style={{ width: 32, height: 32 }} />
          )}
        </div>
      )}

      {/* Content */}
      <div className="message-content" style={{ maxWidth: '72%' }}>
        {/* Sender name (for groups, received only) */}
        {!isSent && isFirstInGroup && message.sender_name && (
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--saffron-600)',
            marginBottom: '0.2rem',
            paddingLeft: '0.25rem',
          }}>
            {message.sender_name}
          </span>
        )}

        {/* Bubble */}
        <div style={{ position: 'relative' }}>
          <div
            className={`message-bubble ${isSent ? 'sent' : 'received'}`}
            style={{
              borderRadius: isFirstInGroup && isLastInGroup
                ? isSent ? 'var(--radius-lg) var(--radius-lg) 4px var(--radius-lg)'
                          : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px'
                : isFirstInGroup
                  ? isSent ? 'var(--radius-lg) var(--radius-lg) var(--radius-md) var(--radius-lg)'
                            : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-md)'
                  : isLastInGroup
                    ? isSent ? 'var(--radius-md) var(--radius-lg) 4px var(--radius-lg)'
                              : 'var(--radius-lg) var(--radius-md) var(--radius-lg) 4px'
                    : isSent ? 'var(--radius-md) var(--radius-lg) var(--radius-md) var(--radius-lg)'
                              : 'var(--radius-lg) var(--radius-md) var(--radius-lg) var(--radius-md)',
            }}
          >
            {/* Image */}
            {hasImage && (
              <img
                src={message.imageUrl}
                alt="Shared image"
                style={{
                  maxWidth: 240,
                  maxHeight: 180,
                  borderRadius: 'var(--radius-sm)',
                  display: 'block',
                  marginBottom: message.content ? '0.5rem' : 0,
                }}
              />
            )}

            {/* Text content */}
            {message.content && (
              <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
            )}

            {/* File attachment */}
            {hasFile && message.attachment && (
              <FileCard
                filename={message.attachment.name}
                filesize={message.attachment.size}
                url={message.attachment.url}
                isSent={isSent}
              />
            )}
          </div>

          {/* Reaction picker trigger */}
          <button
            className="icon-btn"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [isSent ? 'left' : 'right']: '-36px',
              opacity: 0,
              transition: 'opacity 0.15s',
              width: 28,
              height: 28,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
            aria-label="Add reaction"
          >
            <SmilePlus size={15} />
          </button>

          {/* Reaction picker */}
          {showReactionPicker && (
            <div style={{
              position: 'absolute',
              [isSent ? 'right' : 'left']: 0,
              bottom: 'calc(100% + 6px)',
              background: 'white',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.6rem',
              display: 'flex',
              gap: '0.25rem',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 10,
              animation: 'slideUp 0.15s ease',
            }}>
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addReaction(emoji)}
                  style={{
                    fontSize: '1.1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Meta: time + status */}
        {isLastInGroup && (
          <div className="message-meta">
            <span className="message-time">
              {formatTime(message.created_at || message.timestamp)}
            </span>
            {renderStatus()}
          </div>
        )}

        {/* Reactions display */}
        {reactions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.25rem' }}>
            {reactions.map((r) => (
              <button
                key={r.emoji}
                className="message-reaction"
                onClick={() => addReaction(r.emoji)}
                aria-label={`${r.emoji} reaction, ${r.count} times`}
              >
                <span>{r.emoji}</span>
                {r.count > 1 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {r.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
