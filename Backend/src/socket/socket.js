import {Server} from 'socket.io';

let io;

export const initSocket = (server)=>{
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : [];

    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        }
    });
    return io;
};

export const getIO = ()=>{
    if(!io){
        throw new Error("Socket.io not initialized!");
    }

    return io;
};