import { createContext, useContext, useEffect, useRef } from 'react';
import socket from '../socket/socket.js';
import { AuthContext } from './AuthContext.jsx';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const hasAuthed = useRef(false);

  useEffect(() => {
    if (!token) {
      // No token — disconnect if connected
      if (socket.connected) {
        socket.disconnect();
      }
      hasAuthed.current = false;
      return;
    }

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Send auth when connected (or immediately if already connected)
    const doAuth = () => {
      if (!hasAuthed.current) {
        console.log('[SocketProvider] Sending auth token…');
        socket.emit('auth', token);
        hasAuthed.current = true;
      }
    };

    if (socket.connected) {
      doAuth();
    }

    socket.on('connect', doAuth);

    // If we get disconnected and reconnect, re-auth
    socket.on('reconnect', doAuth);

    return () => {
      socket.off('connect', doAuth);
      socket.off('reconnect', doAuth);
    };
  }, [token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socket.disconnect();
      hasAuthed.current = false;
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};