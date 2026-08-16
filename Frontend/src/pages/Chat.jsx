// src/pages/Chat.jsx
import { useState, useCallback, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext.jsx';
import ChatList from '../components/chat/ChatList.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import ProfilePanel from '../components/chat/ProfilePanel.jsx';

/** Returns true when the viewport is ≤ the given breakpoint (mobile mode). */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function Chat() {
  const [showDetails, setShowDetails] = useState(false);
  // mobilePanel: which panel is visible on small screens ('list' | 'chat')
  const [mobilePanel, setMobilePanel] = useState('list');
  const { selectedConversationId } = useChatContext();
  const isMobile = useIsMobile(768);

  const handleSelectConversation = useCallback(() => {
    setMobilePanel('chat');
  }, []);

  const handleBack = useCallback(() => {
    setMobilePanel('list');
  }, []);

  const handleInfoClick = useCallback(() => {
    setShowDetails((prev) => !prev);
  }, []);

  // On mobile: show one panel at a time using CSS display
  // On desktop: show both panels side by side using flex layout
  const showList   = !isMobile || mobilePanel === 'list';
  const showWindow = !isMobile || mobilePanel === 'chat';

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

      {/* ── Chat List sidebar ── */}
      <div
        style={{
          display: showList ? 'flex' : 'none',
          // On mobile: take full viewport (position handled by CSS class)
          // On desktop: fixed sidebar width, flex-shrink prevented
          flexShrink: 0,
        }}
      >
        <ChatList onSelectConversation={handleSelectConversation} />
      </div>

      {/* ── Main Chat Window ── */}
      <div
        style={{
          display: showWindow ? 'flex' : 'none',
          flex: 1,
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <ChatWindow
          onInfoClick={handleInfoClick}
          onBack={handleBack}
          showBack={isMobile && mobilePanel === 'chat'}
        />
      </div>

      {/* ── Right Profile / Details Panel ── */}
      <ProfilePanel
        isOpen={showDetails && !!selectedConversationId}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
}