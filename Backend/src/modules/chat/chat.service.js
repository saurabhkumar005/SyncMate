import connectionPool from '../../config/db.js';

import AppError from '../../utils/AppError.js';

import 
{ 
    findUserById, findExistingDirectConversation, createConversation, addParticipant,
    findConversationById, checkConversationParticipant, createMessage, updateLastMessage, 
    findMessageById, getConversationMessages, getUserConversations,
} from './chat.repository.js';



export const createDirectConversationService = async(currentUserId, targetUserId)=>{
    if(currentUserId === targetUserId){
        throw new AppError("You cannot create chat with yourself!", 400);
    }
    const targetUser = await findUserById(targetUserId);
    if(!targetUser){
        throw new AppError("Target user not found!", 404);
    }

    const existingConversation = await findExistingDirectConversation(currentUserId, targetUserId);
    if(existingConversation){
        return existingConversation;
    }

    const connection = await connectionPool.getConnection();
    try{
        await connection.beginTransaction();

        const conversationId = await createConversation(connection, currentUserId);
        await addParticipant(connection, currentUserId, conversationId);
        await addParticipant(connection, targetUserId, conversationId);

        await connection.commit();

        return {
            id: conversationId
        };

    }catch(err){
        await connection.rollback();
        throw err;
    }finally{
        connection.release();
    }
};





export const sendMessageService = async(senderId, conversationId, content)=>{

    if(!content || !content.trim()){
        throw new AppError("Message content required!", 400);
    }

    const conversation = await findConversationById(conversationId);

    if(!conversation){
        throw new AppError("Conversation not found!", 404);
    }

    const isParticipant = await checkConversationParticipant(senderId, conversationId);

    if(!isParticipant){
        throw new AppError("Unauthorized Access!", 403);
    }

    const connection = await connectionPool.getConnection();

    try{

        await connection.beginTransaction();

        const messageId = await createMessage(
            connection,
            senderId,
            conversationId,
            content.trim()
        );

        await updateLastMessage(connection, conversationId, messageId);

        await connection.commit();

        const message = await findMessageById(messageId);

        return message;

    }catch(err){

        await connection.rollback();

        throw err;

    }finally{

        connection.release();
    }
};


export const getConversationMessagesService = async(userId, conversationId)=>{

    const isParticipant = await checkConversationParticipant(userId, conversationId);

    if(!isParticipant){
        throw new AppError("Unauthorized Access!", 403);
    }

    return await getConversationMessages(conversationId);
};

export const getUserConversationsService = async(userId)=>{
    return await getUserConversations(userId);
};

