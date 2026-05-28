// src/components/chat/ChatList.jsx
import { useState, useMemo, useContext } from 'react';
import { Search, SquarePen, SlidersHorizontal, Users, MessageCircle, Hash } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import UserAvatar from '../ui/UserAvatar.jsx';
import { formatTime } from '../../utils/helpers.js';
import EmptyState from '../ui/EmptyState.jsx';
import NewChatModal from './NewChatModal.jsx';

const FILTERS = ['All', 'Unread', 'Groups'];

export default function ChatList({ onSelectConversation }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const { conversations, selectedConversationId, selectConversation, unreadCounts, loading } =
    useChatContext();
  const { user } = useContext(AuthContext);

  const totalUnread = useMemo(
    () => Object.values(unreadCounts).reduce((s, n) => s + n, 0),
    [unreadCounts]
  );

  // Helper to derive display name for search
  const getDisplayName = (conv) => {
    if (conv.type === 'group') return conv.group_name || '';
    if (conv.participants && Array.isArray(conv.participants)) {
      const other = conv.participants.find(p => Number(p.id) !== Number(user?.id));
      return (other?.full_name || other?.username || '');
    }
    return '';
  };

  const filtered = useMemo(() => {
    let list = conversations;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          getDisplayName(c).toLowerCase().includes(q) ||
          c.last_message?.toLowerCase().includes(q)
      );
    }
    if (activeFilter === 'Unread') {
      list = list.filter((c) => (unreadCounts[Number(c.id)] || 0) > 0);
    } else if (activeFilter === 'Groups') {
      list = list.filter((c) => c.type === 'group');
    }
    return list;
  }, [conversations, search, activeFilter, unreadCounts, user]);

  const handleSelect = (id) => {
    selectConversation(id);
    onSelectConversation?.(id);
  };

  const getConversationName = (conv) => {
    if (conv.type === 'group') return conv.group_name || `Group ${conv.id}`;
    if (conv.participants && Array.isArray(conv.participants)) {
      const other = conv.participants.find(p => Number(p.id) !== Number(user?.id));
      return other?.full_name || other?.username || `Chat ${conv.id}`;
    }
    return `Chat ${conv.id}`;
  };

  const getConversationUser = (conv) => {
    if (conv.participants && Array.isArray(conv.participants)) {
      return conv.participants.find(p => Number(p.id) !== Number(user?.id));
    }
    return null;
  };

  const isGroup = (conv) => conv.type === 'group' || conv.type === 'room';

  return (
    <aside className="chat-list-panel" aria-label="Conversations">
      {/* Header */}
      <div className="chat-list-header">
        <div className="chat-list-title">
          <span>Messages</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="icon-btn" aria-label="Filter options" title="Filter">
              <SlidersHorizontal size={16} strokeWidth={1.8} />
            </button>
            <button className="icon-btn" aria-label="New message" title="New conversation" onClick={() => setIsNewChatOpen(true)}>
              <SquarePen size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="search-bar" role="search">
          <Search size={15} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" role="tablist" aria-label="Message filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
            role="tab"
            aria-selected={activeFilter === f}
          >
            {f}
            {f === 'Unread' && totalUnread > 0 && (
              <span className="filter-count">{totalUnread}</span>
            )}
          </button>
        ))}
      </div>

      {/* Conversation List */}
      <div className="chat-list" role="list">
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div className="loading-spinner" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={MessageCircle}
            title={search ? 'No results found' : 'No conversations yet'}
            description={search ? 'Try a different search term' : 'Start a new conversation to get going'}
          />
        )}

        {!loading && filtered.map((conv) => {
          const name = getConversationName(conv);
          const otherUser = getConversationUser(conv);
          const group = isGroup(conv);
          const unread = unreadCounts[Number(conv.id)] || 0;
          const isSelected = Number(conv.id) === Number(selectedConversationId);

          return (
            <div
              key={conv.id}
              className={`chat-item ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelect(conv.id)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(conv.id)}
              aria-label={`Conversation with ${name}`}
              aria-current={isSelected ? 'true' : undefined}
            >
              {/* Avatar */}
              {group ? (
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: conv.color || 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {conv.icon || <Hash size={16} />}
                  </div>
                </div>
              ) : (
                <UserAvatar
                  user={otherUser || { name }}
                  size="sm"
                  className=""
                />
              )}

              {/* Meta */}
              <div className="chat-item-meta">
                <div className="chat-item-top">
                  <span className="chat-item-name" style={unread > 0 ? { fontWeight: 700 } : {}}>
                    {name}
                  </span>
                  <span className="chat-item-time">
                    {formatTime(conv.last_message_time || conv.updated_at)}
                  </span>
                </div>
                <div className="chat-item-preview">
                  {conv.last_sender && conv.type !== 'direct' && (
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginRight: 2 }}>
                      {conv.last_sender_name}:
                    </span>
                  )}
                  <span style={unread > 0 ? { color: 'var(--text-primary)', fontWeight: 500 } : {}}>
                    {conv.last_message || 'No messages yet'}
                  </span>
                </div>
              </div>

              {/* Unread badge */}
              {unread > 0 && (
                <span className="unread-badge" aria-label={`${unread} unread messages`}>
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <NewChatModal isOpen={isNewChatOpen} onClose={() => setIsNewChatOpen(false)} />
    </aside>
  );
}
