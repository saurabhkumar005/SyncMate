import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());

app.get('/',(req,res)=>{
    console.log("Express App is Listening");
    res.send("Hello from Express");
});

export default app;
