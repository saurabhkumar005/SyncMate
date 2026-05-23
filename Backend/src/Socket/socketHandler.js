import jwt from 'jsonwebtoken';

import onlineUsers from './onlineUsers.js';

import {registerChatSocketEvents} from '../modules/chat/chat.socket.js';



export const setupSocketHandlers = (io)=>{

    io.on('connection', (socket)=>{

        console.log("New socket connected:", socket.id);

        socket.on('auth', (token)=>{

            try{

                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                socket.userId = decoded.userId;

                onlineUsers.set(decoded.userId, socket.id);

                console.log("User connected:", decoded.userId);

            }catch(err){

                console.log("Socket auth failed");

                socket.disconnect();
            }
        });

        
        registerChatSocketEvents(io, socket);

        socket.on('disconnect', ()=>{

            if(socket.userId){
                onlineUsers.delete(socket.userId);
            }

            console.log("Socket disconnected:", socket.id);
        });

    });
};