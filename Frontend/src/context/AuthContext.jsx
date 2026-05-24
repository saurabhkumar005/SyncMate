import {createContext, useEffect, useState} from 'react';

import {getCurrentUser} from '../api/auth.api.js';

export const AuthContext = createContext();




export const AuthProvider = ({children})=>{

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem('token')
    );

    const [loading, setLoading] = useState(true);




    useEffect(()=>{

        const loadUser = async()=>{

            try{

                if(token){

                    const response = await getCurrentUser();

                    setUser(response.data);
                }

            }catch(err){

                console.log(err);

                localStorage.removeItem('token');

                setToken(null);

                setUser(null);

            }finally{

                setLoading(false);
            }
        };

        loadUser();

    },[]);




    const login = (data)=>{

        localStorage.setItem('token', data.token);

        setToken(data.token);

        setUser(data.user);
    };




    const logout = ()=>{

        localStorage.removeItem('token');

        setToken(null);

        setUser(null);
    };




    return(
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};