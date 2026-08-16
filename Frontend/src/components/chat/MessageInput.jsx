// src/components/chat/MessageInput.jsx
import { useRef, useState, useCallback, useEffect } from 'react';
import { Smile, Paperclip, Image, Send } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext.jsx';

const EMOJI_LIST = [
  '😀','😂','😍','🤔','👍','👎','❤️','🔥','✅','🎉',
  '😮','😢','🙏','💪','🤝','👏','🎯','💡','📚','⚡',
];

export default function MessageInput() {
  const [value, setValue] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const textareaRef = useRef(null);
  const typingTimerRef = useRef(null);
  const { sendMessage, sendTyping, selectedConversationId } = useChatContext();

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    adjustHeight();

    // Typing indicator
    sendTyping(true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => sendTyping(false), 1800);
  };

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || !selectedConversationId) return;
    sendMessage(trimmed);
    setValue('');
    sendTyping(false);
    clearTimeout(typingTimerRef.current);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [value, selectedConversationId, sendMessage, sendTyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setValue((prev) => prev + emoji);
    setShowEmojis(false);
    textareaRef.current?.focus();
  };

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmojis) return;
    const handler = (e) => {
      if (!e.target.closest('#emoji-picker') && !e.target.closest('#emoji-btn')) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showEmojis]);

  const canSend = value.trim().length > 0 && !!selectedConversationId;

  if (!selectedConversationId) return null;

  return (
    <div className="message-input-area">
      {/* Emoji Picker */}
      {showEmojis && (
        <div
          id="emoji-picker"
          className="emoji-picker"
        >
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              className="emoji-btn"
              aria-label={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="message-input-container" style={{ position: 'relative' }}>
        {/* Left actions */}
        <div className="input-actions" style={{ alignSelf: 'flex-end', paddingBottom: '0.15rem' }}>
          <button
            id="emoji-btn"
            className="icon-btn"
            onClick={() => setShowEmojis(!showEmojis)}
            aria-label="Emoji picker"
            title="Emoji"
            type="button"
            style={{ width: 32, height: 32 }}
          >
            <Smile size={18} strokeWidth={1.8} />
          </button>
          <button
            className="icon-btn"
            aria-label="Attach file"
            title="Attach file"
            type="button"
            style={{ width: 32, height: 32 }}
          >
            <Paperclip size={16} strokeWidth={1.8} />
          </button>
          <button
            className="icon-btn"
            aria-label="Upload image"
            title="Image"
            type="button"
            style={{ width: 32, height: 32 }}
          >
            <Image size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* Text input */}
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder="Type a message..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Message input"
          aria-multiline="true"
        />

        {/* Send button */}
        <div style={{ alignSelf: 'flex-end', paddingBottom: '0.1rem' }}>
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            type="button"
          >
            <Send size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <p style={{
        fontSize: '0.68rem',
        color: 'var(--text-muted)',
        marginTop: '0.35rem',
        paddingLeft: '0.25rem',
      }}>
        Press <kbd style={{ fontFamily: 'monospace', background: 'var(--warm-gray-100)', padding: '0 3px', borderRadius: 3 }}>Enter</kbd> to send · <kbd style={{ fontFamily: 'monospace', background: 'var(--warm-gray-100)', padding: '0 3px', borderRadius: 3 }}>Shift+Enter</kbd> for newline
      </p>
    </div>
  );
}
