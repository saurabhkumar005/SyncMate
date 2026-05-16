// import connectDBPool from "./config/db.js";
import app from "./app.js";
import http from 'http';
import { Server } from "socket.io";
import dotenv from "dotenv";
import socketSetup from "./Socket/socket.js";

dotenv.config()
const server = http.createServer(app); //wrapping app with http server to joint with socket

export const io = new Server(server, {
    cors: {origin: "*"},
});

socketSetup(io);






server.listen(process.env.PORT || 8080, ()=>{console.log(`Http Server started on port ${process.env.PORT || 8080}`)});
 