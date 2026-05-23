import { createDirectConversationService, sendMessageController, 
    getConversationMessagesService , getUserConversationsService
} from "./chat.service.js";

export const createDirectConversationController = async (req, res)=>{
   try{
      const currentUserId = req.user.userId
      const { targetUserId } = req.body;

      const conversation = await createDirectConversationService( currentUserId, targetUserId);
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