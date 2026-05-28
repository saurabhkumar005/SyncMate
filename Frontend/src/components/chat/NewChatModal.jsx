// src/components/chat/NewChatModal.jsx
import { useState, useRef, useEffect } from 'react';
import { X, UserPlus, Search, AlertCircle, Loader } from 'lucide-react';
import { createDirectConversation } from '../../api/chat.api.js';
import { useChatContext } from '../../context/ChatContext.jsx';

export default function NewChatModal({ isOpen, onClose }) {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const { loadConversations, selectConversation } = useChatContext();

  useEffect(() => {
    if (isOpen) {
      setIdentifier('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = identifier.trim();
    if (!val) { setError('Please enter a username or email'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await createDirectConversation({ identifier: val });
      const convId = res.data?.id;
      if (!convId) throw new Error('Invalid response from server');
      // Load fresh conversations list first, then open the chat
      await loadConversations();
      selectConversation(convId);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'User not found. Check the username or email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Card */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '28px',
        width: '92%',
        maxWidth: '430px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
        position: 'relative',
        animation: 'slideUp 0.2s ease',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32, borderRadius: '50%',
            border: 'none', background: '#f1f5f9',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748b', transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
        >
          <X size={16} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316, #ea6f0a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <UserPlus size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>Start a New Chat</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Find someone by username or email</div>
          </div>
        </div>

        <div style={{ height: 1, background: '#f1f5f9', margin: '16px 0' }} />

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px',
            backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: 10,
            marginBottom: 14, fontSize: '0.85rem', lineHeight: 1.4,
            border: '1px solid #fecaca',
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
            Username or Email address
          </label>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={15} style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#94a3b8', pointerEvents: 'none',
            }} />
            <input
              ref={inputRef}
              type="text"
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
              placeholder="e.g. john or john@example.com"
              disabled={loading}
              onKeyDown={(e) => e.key === 'Escape' && onClose()}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                fontSize: '0.9rem',
                border: error ? '2px solid #fca5a5' : '2px solid #e2e8f0',
                borderRadius: 10,
                outline: 'none',
                background: loading ? '#f8fafc' : '#fff',
                color: '#1e293b',
                transition: 'border-color 0.15s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = '#f97316'; }}
              onBlur={e => { if (!error) e.target.style.borderColor = '#e2e8f0'; }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !identifier.trim()}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: 10,
              border: 'none',
              background: loading || !identifier.trim()
                ? '#fed7aa'
                : 'linear-gradient(135deg, #f97316, #ea6f0a)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: loading || !identifier.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s',
            }}
          >
            {loading
              ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Finding user...</>
              : <><UserPlus size={15} /> Start Chat</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
