import {useContext, useState} from 'react';

import {AuthContext} from '../context/AuthContext.jsx';

import {loginUser} from '../api/auth.api.js';




const Login = ()=>{

    const {login} = useContext(AuthContext);

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');




    const handleLogin = async()=>{

        try{

            const response = await loginUser({
                email,
                password
            });

            login(response.data);

        }catch(err){

            console.log(err.response.data);
        }
    };




    return(
        <div>

            <h1>Login</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>

        </div>
    );
};

export default Login;