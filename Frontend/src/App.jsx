import {useContext} from 'react';

import {AuthContext} from './context/AuthContext.jsx';

import Login from './pages/Login.jsx';

import Chat from './pages/Chat.jsx';




function App(){

    const {user, loading} = useContext(AuthContext);

    if(loading){
        return <h1>Loading...</h1>;
    }

    return (
        <>
            {
                user
                ?
                <Chat/>
                :
                <Login/>
            }
        </>
    );
}

export default App;