import axiosInstance from './axios.js';

export const createDirectConversation = async(data)=>{
    const response = await axiosInstance.post(
        '/api/chat/direct',
        data
    );

    return response.data;
};


export const getUserConversations = async()=>{
    const response = await axiosInstance.get(
        '/api/chat/conversations'
    );

    return response.data;
};


export const sendMessageHttp = async(conversationId, content)=>{
    const response = await axiosInstance.post('/api/chat/message', { conversationId, content });
    return response.data;
};


export const getConversationMessages = async(conversationId)=>{
    const response = await axiosInstance.get(
        `/api/chat/messages/${conversationId}`
    );

    return response.data;
};