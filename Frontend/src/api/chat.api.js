import axiosInstance from './axios.js';

export const createDirectConversation = async(targetUserId)=>{
    const response = await axiosInstance.post(
        '/api/chat/direct',
        {targetUserId}
    );

    return response.data;
};


export const getUserConversations = async()=>{
    const response = await axiosInstance.get(
        '/api/chat/conversations'
    );

    return response.data;
};




export const getConversationMessages = async(conversationId)=>{
    const response = await axiosInstance.get(
        `/api/chat/messages/${conversationId}`
    );

    return response.data;
};