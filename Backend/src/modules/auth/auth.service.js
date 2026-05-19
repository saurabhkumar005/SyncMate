import bcrypt from 'bcrypt';

import AppError from '../../utils/AppError.js';
import { generateToken } from '../../utils/jwt.js';

import {createUser, findUserByEmail} from './auth.repository.js'


export const registerUserService = async(userData)=>{
    const {full_name, username, password, email, phone_number, avatar_url, profession} = userData;

    if(!username || !full_name || !email || !phone_number ||!password){
        throw new AppError("Please fill all required field (Name, Username, Email, Password, Phone Number) to register!", 400);

    }
    if(username.length<4){
        throw new AppError("Username should be of minimum length 4", 400);
    }
    if(password.length<8){
        throw new AppError("Password should be of minimum length 8", 400);
    }

    //normalization 
    const normalizedUsername = username.trim();
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedFullName = full_name.trim();

    //email and phone_number format check to be completed here

    const checkEmail =  await findUserByEmail(normalizedEmail);
    if(checkEmail){
        throw new AppError("User Account Already Registered, Please login!",409);
    }

    const salt = await bcrypt.genSalt(10); //10 is cost factor/ work factor which decide how many round to take to genearte hash
    //more round = more time = slow = hard for hacker to try random million password guess
    //bcrypt.genSalt() = bcrypt.genSalt(10)by defult if you not pass work factor, 10 will be taken
    const hashedPassword = await bcrypt.hash(password, salt);
    const data={full_name : normalizedFullName, username: normalizedUsername, email : normalizedEmail, phone_number,
        password : hashedPassword,
        profession, avatar_url
    };
    const createdUser = await createUser(data);
    const token = generateToken({userId: createdUser.id });
    return {
        token, 
        user:{
         id: createdUser.id,
         full_name : normalizedFullName,
         username : normalizedUsername,
         email  : normalizedEmail,
         phone_number,
         profession,
         avatar_url
        }
    }


}