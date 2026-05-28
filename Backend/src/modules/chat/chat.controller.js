import { createDirectConversationService, sendMessageService, 
    getConversationMessagesService , getUserConversationsService
} from "./chat.service.js";

import { findAuthUserData } from "../auth/auth.repository.js";
import { getIO } from "../../socket/socket.js";
import onlineUsers from "../../socket/onlineUsers.js";

export const createDirectConversationController = async (req, res)=>{
   try{
      const currentUserId = req.user.userId
      let { targetUserId, identifier } = req.body;

      if (!targetUserId && identifier) {
          const targetUser = await findAuthUserData(identifier);
          if (!targetUser) {
              return res.status(404).json({ success: false, message: "User not found" });
          }
          targetUserId = targetUser.id;
      }

      if (!targetUserId) {
          return res.status(400).json({ success: false, message: "Target user ID or identifier is required" });
      }

      const conversation = await createDirectConversationService( currentUserId, targetUserId);

      // ✅ Auto-join both users' sockets into the new conversation room
      try {
          const io = getIO();
          const roomName = `conversation_${conversation.id}`;
          [currentUserId, targetUserId].forEach(uid => {
              const socketId = onlineUsers.get(uid);
              if (socketId) {
                  const userSocket = io.sockets.sockets.get(socketId);
                  if (userSocket) {
                      userSocket.join(roomName);
                      console.log(`Auto-joined user ${uid} (socket ${socketId}) to room ${roomName}`);
                  }
              }
          });
      } catch (socketErr) {
          console.error('Socket room join failed:', socketErr.message);
      }

      return res.status(201).json({
         success: true,
         data: conversation
      });

   }catch(error){
      return res.status(error.statusCode || 500).json({
         success: false,
         message: error.message || "Internal Server Error"
      });
   }
};



export const sendMessageController = async(req, res)=>{
    try{
        const senderId = req.user.userId;
        const {conversationId, content} = req.body;

        const message = await sendMessageService(senderId, conversationId, content);

        // ✅ Broadcast the new message to ALL users in the conversation room via socket
        try {
            const io = getIO();
            io.to(`conversation_${conversationId}`).emit('new_message', message);
        } catch (socketErr) {
            console.error('Socket broadcast failed:', socketErr.message);
        }

        return res.status(201).json({
            success: true,
            data: message
        });

    }catch(err){
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};


export const getConversationMessagesController = async(req, res)=>{
    try{

        const userId = req.user.userId;
        const {conversationId} = req.params;

        const messages = await getConversationMessagesService(userId, conversationId);

        return res.status(200).json({
            success: true,
            data: messages
        });

    }catch(err){

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};




export const getUserConversationsController = async(req, res)=>{
    try{

        const userId = req.user.userId;

        const conversations = await getUserConversationsService(userId);

        return res.status(200).json({
            success: true,
            data: conversations
        });

    }catch(err){

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};