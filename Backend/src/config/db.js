import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config();

const connectDBPool = ()=>{
    //we are not creating a single DB connection as it will make new single connection always whenever any request come to sql. 
    // every new DB connection does a TCP handshake which takes time and slows the app , better approach is to create pool 
    // of connection, so if any request come to sql, it will have already set of some available DB connection with TCP handhake done and 
    // can give availabe connection from the pool and if unavailable(all connection is in use), then it also have queue which let
    //request wait up to mentioned limit for let connection free, if queue also full, then request will be returned with error/crash.
    const conn =  mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,  //pool will allow request's wait for connection if no connection is free right now 
        connectionLimit: 20, //max number of already  availble connection ready to handle DB operation directly in pool , 
        // means that much only request can be hanled at single time, after that any request had to wait to get any connection free
        queueLimit: 0 //value 0 means, infinite , means any number of connection can wait in queue which may cause buffer full and other issue which may results in crash.
    });
    console.log("DB Connected Successfully!")
};

export default connectDBPool;