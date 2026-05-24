import {useContext} from 'react';

import {SocketContext} from '../context/SocketContext.jsx';

const useSocket = ()=>{
    return useContext(SocketContext);
};

export default useSocket;