import axiosInstance from './axios.js';



export const registerUser = async(userData)=>{
    const response = await axiosInstance.post(
        '/api/auth/register',
        userData
    );

    return response.data;
};




export const loginUser = async(userData)=>{
    const response = await axiosInstance.post(
        '/api/auth/login',
        userData
    );

    return response.data;
};




export const getCurrentUser = async()=>{
    const response = await axiosInstance.get(
        '/api/auth/myprofile'
    );

    return response.data;
};