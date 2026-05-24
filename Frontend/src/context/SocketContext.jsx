import {createContext, useContext, useEffect} from 'react';

import socket from '../socket/socket.js';

import {AuthContext} from './AuthContext.jsx';

export const SocketContext = createContext();




export const SocketProvider = ({children})=>{

    const {token} = useContext(AuthContext);




    useEffect(()=>{

        if(token){

            socket.connect();

            socket.emit('auth', token);
        }

        return ()=>{

            socket.disconnect();
        };

    },[token]);




    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};