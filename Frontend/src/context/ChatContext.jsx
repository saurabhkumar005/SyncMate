// src/context/ChatContext.jsx
import { createContext, useContext, useEffect, useReducer, useRef, useCallback } from 'react';
import { getUserConversations, getConversationMessages } from '../api/chat.api.js';
import { AuthContext } from './AuthContext.jsx';
import { SocketContext } from './SocketContext.jsx';

export const ChatContext = createContext();

const initialState = {
  conversations: [],
  selectedConversationId: null,
  messages: {},       // { conversationId: [messages] }
  loading: false,
  messagesLoading: false,
  error: null,
  typingUsers: {},    // { conversationId: [userId] }
  unreadCounts: {},   // { conversationId: count }
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
        selectedConversationId: action.payload,
        unreadCounts: { ...state.unreadCounts, [action.payload]: 0 },
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messagesLoading: false,
        messages: { ...state.messages, [action.payload.conversationId]: action.payload.messages },
      };
    case 'APPEND_MESSAGE': {
      const convId = action.payload.conversation_id;
      const existing = state.messages[convId] || [];
      const isDuplicate = existing.some((m) => m.id === action.payload.id);
      if (isDuplicate) return state;
      const newMessages = [...existing, action.payload];
      const isSelected = state.selectedConversationId === convId;
      return {
        ...state,
        messages: { ...state.messages, [convId]: newMessages },
        unreadCounts: {
          ...state.unreadCounts,
          [convId]: isSelected ? 0 : (state.unreadCounts[convId] || 0) + 1,
        },
        conversations: state.conversations.map((c) =>
          c.id === convId ? { ...c, last_message: action.payload.content, last_message_time: action.payload.created_at } : c
        ),
      };
    }
    case 'SET_TYPING':
      return {
        ...state,
        typingUsers: { ...state.typingUsers, [action.payload.conversationId]: action.payload.users },
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const messagesEndRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      dispatch({ type: 'APPEND_MESSAGE', payload: message });
    };

    const handleTyping = ({ conversationId, userId, isTyping }) => {
      dispatch({
        type: 'SET_TYPING',
        payload: {
          conversationId,
          users: isTyping
            ? [...(state.typingUsers[conversationId] || []), userId].filter((v, i, a) => a.indexOf(v) === i)
            : (state.typingUsers[conversationId] || []).filter((id) => id !== userId),
        },
      });
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing', handleTyping);
    };
  }, [socket, state.typingUsers]);

  const loadConversations = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await getUserConversations();
      dispatch({ type: 'SET_CONVERSATIONS', payload: res.data || [] });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  const selectConversation = useCallback(async (conversationId) => {
    dispatch({ type: 'SELECT_CONVERSATION', payload: conversationId });
    socket?.emit('join_conversation', conversationId);

    if (!state.messages[conversationId]) {
      dispatch({ type: 'SET_MESSAGES_LOADING', payload: true });
      try {
        const res = await getConversationMessages(conversationId);
        dispatch({
          type: 'SET_MESSAGES',
          payload: { conversationId, messages: res.data || [] },
        });
      } catch (err) {
        dispatch({ type: 'SET_MESSAGES_LOADING', payload: false });
        console.error('Failed to load messages:', err);
      }
    }
  }, [socket, state.messages]);

  const sendMessage = useCallback((content, type = 'text') => {
    if (!state.selectedConversationId || !content.trim()) return;
    socket?.emit('send_message', {
      conversationId: state.selectedConversationId,
      content: content.trim(),
      type,
    });
  }, [socket, state.selectedConversationId]);

  const sendTyping = useCallback((isTyping) => {
    if (!state.selectedConversationId) return;
    socket?.emit('typing', {
      conversationId: state.selectedConversationId,
      isTyping,
    });
  }, [socket, state.selectedConversationId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const selectedConversation = state.conversations.find(
    (c) => c.id === state.selectedConversationId
  );

  const currentMessages = state.messages[state.selectedConversationId] || [];

  const totalUnread = Object.values(state.unreadCounts).reduce((sum, n) => sum + n, 0);

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
        scrollToBottom,
        currentUserId: user?.id,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
