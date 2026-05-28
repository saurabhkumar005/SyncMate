import jwt from 'jsonwebtoken';
import onlineUsers from './onlineUsers.js';
import { registerChatSocketEvents } from '../modules/chat/chat.socket.js';
import { getUserConversationIds } from '../modules/chat/chat.repository.js';

export const setupSocketHandlers = (io) => {

    io.on('connection', (socket) => {

        console.log("New socket connected:", socket.id);

        socket.on('auth', async (token) => {

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = decoded.userId;
                onlineUsers.set(decoded.userId, socket.id);

                // ✅ Auto-join all conversation rooms so user receives live messages
                const conversationIds = await getUserConversationIds(decoded.userId);
                conversationIds.forEach(convId => {
                    socket.join(`conversation_${convId}`);
                });

                console.log(`User ${decoded.userId} authenticated and joined ${conversationIds.length} conversation room(s)`);

                // Notify client that auth succeeded
                socket.emit('auth_success', { userId: decoded.userId });

            } catch (err) {
                console.log("Socket auth failed:", err.message);
                socket.emit('auth_error', { message: 'Authentication failed' });
                socket.disconnect();
            }
        });

        registerChatSocketEvents(io, socket);

        socket.on('disconnect', () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
            }
            console.log("Socket disconnected:", socket.id);
        });

    });
};