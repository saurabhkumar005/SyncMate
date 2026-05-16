

export default function socketSetup(io){
    io.on("connection", (socket)=>{
        console.log("new socket created", socket.id);
        socket.on("msg",(message)=>{
            console.log("Backend: Message Recieved"+message);
            socket.emit("mess","PersonalMessage");
            socket.broadcast.emit("mess","broadcast");
            io.emit("mess","msgRecieved");
        
        });
        io.emit("userJoined");
        socket.on("join",(roomId)=>{
            socket.join("chatRoom");
            io.to("chatRoom").emit("roomMess","Room Mess: new user joined");
            console.log("new user joined to room ", roomId);
        })
        socket.on("disconnect", ()=>{
            console.log("User Disconnected", socket.id);
        })    
    });
}
