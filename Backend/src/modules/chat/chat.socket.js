import {sendMessageService} from './chat.service.js';



export const registerChatSocketEvents = (io, socket)=>{

    socket.on('join_conversation', (conversationId)=>{

        socket.join(`conversation_${conversationId}`);

        console.log(`User joined room ${conversationId}`);
    });



    socket.on('send_message', async(data)=>{

        try{

            const {conversationId, content} = data;

            const senderId = socket.userId;

            const message = await sendMessageService(
                senderId,
                conversationId,
                content
            );

            io.to(`conversation_${conversationId}`).emit(
                'new_message',
                message
            );

        }catch(err){

            socket.emit('message_error',{
                message: err.message
            });
        }
    });


    socket.on('leave_conversation', (conversationId)=>{

        socket.leave(`conversation_${conversationId}`);

        console.log(`User left room ${conversationId}`);
    });
};