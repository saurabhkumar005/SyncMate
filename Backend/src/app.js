import express from 'express';
import cors from 'cors';

import authRoutes from './modules/auth/auth.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';

const app = express();

app.use(cors());

app.use(express.json());



app.use('/api/auth', authRoutes);

app.use('/api/chat', chatRoutes);




app.get('/', (req,res)=>{
    res.send("Hello from Express");
});

export default app;