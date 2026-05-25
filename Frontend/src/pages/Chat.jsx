// src/pages/Chat.jsx
import { useState, useCallback } from 'react';
import { useChatContext } from '../context/ChatContext.jsx';
import ChatList from '../components/chat/ChatList.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import ProfilePanel from '../components/chat/ProfilePanel.jsx';

export default function Chat() {
  const [showDetails, setShowDetails] = useState(false);
  // Mobile view: 'list' | 'chat'
  const [mobileView, setMobileView] = useState('list');
  const { selectedConversationId } = useChatContext();

  const handleSelectConversation = useCallback(() => {
    setMobileView('chat');
  }, []);

  const handleBack = useCallback(() => {
    setMobileView('list');
  }, []);

  const handleInfoClick = useCallback(() => {
    setShowDetails((prev) => !prev);
  }, []);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
      {/* Chat list sidebar */}
      <div
        className={mobileView === 'list' ? '' : 'hidden-mobile'}
        style={{ display: 'flex' }}
      >
        <ChatList onSelectConversation={handleSelectConversation} />
      </div>

      {/* Main chat window */}
      <div
        className={mobileView === 'chat' ? '' : 'hidden-mobile'}
        style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}
      >
        <ChatWindow
          onInfoClick={handleInfoClick}
          onBack={handleBack}
          showBack={mobileView === 'chat'}
        />
      </div>

      {/* Right details panel (contextual, toggle) */}
      <ProfilePanel
        isOpen={showDetails && !!selectedConversationId}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
}