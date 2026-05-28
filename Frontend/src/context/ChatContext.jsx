// src/context/ChatContext.jsx
import { createContext, useContext, useEffect, useReducer, useRef, useCallback } from 'react';
import { getUserConversations, getConversationMessages, sendMessageHttp } from '../api/chat.api.js';
import { AuthContext } from './AuthContext.jsx';
import { SocketContext } from './SocketContext.jsx';

export const ChatContext = createContext();

const initialState = {
  conversations:          [],
  selectedConversationId: null,
  messages:               {},   // { [conversationId]: [...] }
  loading:                false,
  messagesLoading:        false,
  error:                  null,
  typingUsers:            {},   // { [conversationId]: [userId] }
  unreadCounts:           {},   // { [conversationId]: count }
};

function chatReducer(state, action) {
  switch (action.type) {

    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload, loading: false };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_MESSAGES_LOADING':
      return { ...state, messagesLoading: action.payload };

    case 'SELECT_CONVERSATION':
      return {
        ...state,
        selectedConversationId: Number(action.payload),
        unreadCounts: { ...state.unreadCounts, [Number(action.payload)]: 0 },
      };

    case 'SET_MESSAGES':
      return {
        ...state,
        messagesLoading: false,
        messages: {
          ...state.messages,
          [Number(action.payload.conversationId)]: action.payload.messages,
        },
      };

    case 'APPEND_MESSAGE': {
      const convId    = Number(action.payload.conversation_id);
      const existing  = state.messages[convId] || [];
      const isRealMsg = !String(action.payload.id).startsWith('temp-');

      let updated;
      if (isRealMsg) {
        // Remove any temp message with the same content (optimistic dedup)
        const withoutMatchingTemp = existing.filter(m =>
          String(m.id).startsWith('temp-') ? m.content !== action.payload.content : true
        );
        // Skip if already present by DB id
        const alreadyExists = withoutMatchingTemp.some(m => Number(m.id) === Number(action.payload.id));
        updated = alreadyExists ? withoutMatchingTemp : [...withoutMatchingTemp, action.payload];
      } else {
        updated = [...existing, action.payload];
      }

      const isSelected = Number(state.selectedConversationId) === convId;
      return {
        ...state,
        messages: { ...state.messages, [convId]: updated },
        unreadCounts: {
          ...state.unreadCounts,
          [convId]: isSelected ? 0 : (state.unreadCounts[convId] || 0) + 1,
        },
        conversations: state.conversations.map(c =>
          Number(c.id) === convId
            ? { ...c, last_message: action.payload.content, last_message_time: action.payload.created_at }
            : c
        ),
      };
    }

    case 'SET_TYPING':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.conversationId]: action.payload.users,
        },
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user }          = useContext(AuthContext);
  const socket            = useContext(SocketContext);
  const messagesEndRef    = useRef(null);
  // Track known conversation IDs to detect new ones arriving via socket
  const knownConvIds      = useRef(new Set());

  /* ─── Load conversations ─── */
  const loadConversations = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await getUserConversations();
      const list = res.data || [];
      dispatch({ type: 'SET_CONVERSATIONS', payload: list });
      // Track known IDs
      list.forEach(c => knownConvIds.current.add(Number(c.id)));
    } catch (err) {
      console.error('[Chat] Failed to load conversations:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  /* ─── Load on user login / page reload ─── */
  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user, loadConversations]);

  // Ref to avoid stale closures in socket handlers
  const typingRef = useRef(state.typingUsers);
  typingRef.current = state.typingUsers;

  /* ─── Socket events ─── */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      console.log('[Socket] new_message:', message);
      const convId = Number(message.conversation_id);

      // If this conversation isn't in our list yet → refresh
      if (!knownConvIds.current.has(convId)) {
        console.log('[Chat] Unknown conversation, refreshing list…');
        loadConversations();
      }

      dispatch({ type: 'APPEND_MESSAGE', payload: message });
    };

    const handleTyping = ({ conversationId, userId, isTyping }) => {
      const current = typingRef.current[conversationId] || [];
      dispatch({
        type: 'SET_TYPING',
        payload: {
          conversationId,
          users: isTyping
            ? [...current, userId].filter((v, i, a) => a.indexOf(v) === i)
            : current.filter(id => id !== userId),
        },
      });
    };

    const handleAuthSuccess = () => {
      console.log('[Socket] auth_success, refreshing conversations…');
      loadConversations();
    };

    socket.on('new_message',  handleNewMessage);
    socket.on('typing',       handleTyping);
    socket.on('auth_success', handleAuthSuccess);
    socket.on('message_error', err => console.error('[Socket] error:', err));

    return () => {
      socket.off('new_message',  handleNewMessage);
      socket.off('typing',       handleTyping);
      socket.off('auth_success', handleAuthSuccess);
      socket.off('message_error');
    };
  }, [socket, loadConversations]);

  /* ─── Select conversation & load messages ─── */
  const selectConversation = useCallback(async (conversationId) => {
    const convId = Number(conversationId);
    dispatch({ type: 'SELECT_CONVERSATION', payload: convId });
    socket?.emit('join_conversation', convId);

    // Always reload messages fresh when switching
    dispatch({ type: 'SET_MESSAGES_LOADING', payload: true });
    try {
      const res = await getConversationMessages(convId);
      dispatch({
        type:    'SET_MESSAGES',
        payload: { conversationId: convId, messages: res.data || [] },
      });
    } catch (err) {
      dispatch({ type: 'SET_MESSAGES_LOADING', payload: false });
      console.error('[Chat] Failed to load messages:', err);
    }
  }, [socket]);

  /* ─── Send message (HTTP first, socket for real-time) ─── */
  const sendMessage = useCallback(async (content, type = 'text') => {
    if (!state.selectedConversationId || !content.trim()) return;

    const convId  = Number(state.selectedConversationId);
    const myId    = Number(user?.id);
    const trimmed = content.trim();

    // Optimistic UI
    const tempMessage = {
      id:               `temp-${Date.now()}`,
      conversation_id:  convId,
      content:          trimmed,
      message_type:     type,
      created_at:       new Date().toISOString(),
      sender_id:        myId,
      status:           'sending',
    };
    dispatch({ type: 'APPEND_MESSAGE', payload: tempMessage });

    try {
      await sendMessageHttp(convId, trimmed);
    } catch (err) {
      console.error('[Chat] HTTP send failed, falling back to socket:', err);
      socket?.emit('send_message', { conversationId: convId, content: trimmed, type });
    }
  }, [socket, state.selectedConversationId, user]);

  /* ─── Typing ─── */
  const sendTyping = useCallback((isTyping) => {
    if (!state.selectedConversationId) return;
    socket?.emit('typing', {
      conversationId: Number(state.selectedConversationId),
      isTyping,
    });
  }, [socket, state.selectedConversationId]);

  /* ─── Derived values ─── */
  const selectedConversation = state.conversations.find(
    c => Number(c.id) === Number(state.selectedConversationId)
  );

  const currentMessages = (
    state.messages[Number(state.selectedConversationId)] ||
    state.messages[state.selectedConversationId] ||
    []
  );

  const totalUnread = Object.values(state.unreadCounts).reduce((s, n) => s + n, 0);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        selectedConversation,
        currentMessages,
        totalUnread,
        messagesEndRef,
        loadConversations,
        selectConversation,
        sendMessage,
        sendTyping,
        currentUserId: user?.id,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
