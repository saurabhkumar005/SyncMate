// src/components/chat/ChatWindow.jsx
import { useEffect, useRef, useContext, useState, useMemo } from 'react';
import { Phone, Video, Search, Info, ArrowLeft, Hash } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import UserAvatar from '../ui/UserAvatar.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { formatDateLabel, groupMessagesByDate } from '../../utils/helpers.js';
import { MessageCircle } from 'lucide-react';

export default function ChatWindow({ onInfoClick, onBack, showBack = false }) {
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);
  const {
    selectedConversation,
    currentMessages,
    messagesLoading,
    typingUsers,
    selectedConversationId,
  } = useChatContext();

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Group messages by date
  const messageGroups = useMemo(() => {
    return groupMessagesByDate(currentMessages);
  }, [currentMessages]);

  // Derive conversation display info
  const getOtherUser = () => {
    if (!selectedConversation?.participants) return null;
    return selectedConversation.participants.find((p) => p.id !== user?.id);
  };

  const otherUser = getOtherUser();
  const isGroup = selectedConversation?.type === 'group';
  const displayName = selectedConversation?.name
    || otherUser?.name
    || otherUser?.username
    || 'Unknown';

  const typingList = typingUsers[selectedConversationId] || [];
  const isTyping = typingList.length > 0;

  // Compute message grouping for bubble rounding logic
  const flatMessages = currentMessages;

  if (!selectedConversationId) {
    return (
      <div className="chat-window" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState
          icon={MessageCircle}
          title="Select a conversation"
          description="Choose a conversation from the left to start chatting"
        />
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        {showBack && (
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Avatar */}
        {isGroup ? (
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            flexShrink: 0,
          }}>
            <Hash size={16} />
          </div>
        ) : (
          <UserAvatar
            user={otherUser || { name: displayName }}
            size="sm"
            showStatus
            status={otherUser?.isOnline ? 'online' : 'offline'}
          />
        )}

        {/* Info */}
        <div className="chat-header-info">
          <div className="chat-header-name">{displayName}</div>
          <div className="chat-header-status">
            {isTyping ? (
              <span style={{ color: 'var(--saffron-600)', fontStyle: 'italic' }}>
                typing...
              </span>
            ) : (
              <>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: otherUser?.isOnline ? 'var(--online)' : 'var(--offline)',
                    display: 'inline-block',
                  }}
                />
                <span>{otherUser?.isOnline ? 'Online' : 'Offline'}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="chat-header-actions">
          <button className="icon-btn" aria-label="Search in conversation" title="Search">
            <Search size={17} strokeWidth={1.8} />
          </button>
          <button className="icon-btn" aria-label="Voice call" title="Call">
            <Phone size={17} strokeWidth={1.8} />
          </button>
          <button className="icon-btn" aria-label="Video call" title="Video">
            <Video size={17} strokeWidth={1.8} />
          </button>
          <button
            className={`icon-btn`}
            onClick={onInfoClick}
            aria-label="View details"
            title="Details"
          >
            <Info size={17} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area" role="log" aria-live="polite" aria-label="Messages">
        {messagesLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div className="loading-spinner" />
          </div>
        )}

        {!messagesLoading && flatMessages.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            padding: '2rem',
          }}>
            <span style={{ fontSize: '2.5rem' }}>👋</span>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              Say hello to {displayName}!
            </p>
            <p style={{ fontSize: '0.82rem' }}>This is the beginning of your conversation.</p>
          </div>
        )}

        {!messagesLoading && Object.entries(messageGroups).map(([dateStr, msgs]) => (
          <div key={dateStr}>
            {/* Date divider */}
            <div className="date-divider" role="separator">
              {formatDateLabel(dateStr)}
            </div>

            {/* Messages in this date group */}
            {msgs.map((msg, idx) => {
              const isSent = msg.sender_id === user?.id || msg.senderId === user?.id;
              const prevMsg = msgs[idx - 1];
              const nextMsg = msgs[idx + 1];
              const sameSenderAsPrev = prevMsg && (prevMsg.sender_id === msg.sender_id || prevMsg.senderId === msg.senderId);
              const sameSenderAsNext = nextMsg && (nextMsg.sender_id === msg.sender_id || nextMsg.senderId === msg.sender_id);
              const isFirstInGroup = !sameSenderAsPrev;
              const isLastInGroup = !sameSenderAsNext;

              return (
                <MessageBubble
                  key={msg.id || `${dateStr}-${idx}`}
                  message={msg}
                  isSent={isSent}
                  showAvatar={isLastInGroup}
                  isFirstInGroup={isFirstInGroup}
                  isLastInGroup={isLastInGroup}
                />
              );
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="typing-indicator" aria-live="polite">
            <div className="typing-dots">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
            <span>
              {typingList.length === 1
                ? 'Someone is typing'
                : `${typingList.length} people are typing`}
            </span>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div style={{ position: 'relative' }}>
        <MessageInput />
      </div>
    </div>
  );
}
