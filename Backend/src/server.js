// import connectDBPool from "./config/db.js";
import app from "./app.js";
import http from 'http';
import { Server } from "socket.io";
import dotenv from "dotenv";

import {initSocket} from './socket/socket.js';
import {setupSocketHandlers} from './socket/socketHandler.js';

dotenv.config()
const server = http.createServer(app); //wrapping app with http server to joint with socket

const io = initSocket(server);

setupSocketHandlers(io);





server.listen(process.env.PORT || 8080, ()=>{console.log(`Http Server started on port ${process.env.PORT || 8080}`)});
 