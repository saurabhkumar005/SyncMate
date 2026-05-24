import {io} from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL,{
    autoConnect: false 
});
//autoconnect false means socket will only connnect after login (production standard)
export default socket;