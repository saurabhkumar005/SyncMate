import { registerUserService, loginUserService, getCurrentUserService } from "./auth.service.js";

async function registerUserController(req, res){
    try{
        const user = await registerUserService(req.body);
        return res.status(201).json({success: true, data: user});
    }catch(err){
        return res.status(err.statusCode || 500).json({success: false, error: err.message || "Internal server error"});
    }
}

export const loginUserController = async (req, res)=>{
    try{
        const user = await loginUserService(req.body);
        return res.status(200).json({success: true, data : user});
    }catch(err){
         return res.status(err.statusCode || 500).json({success: false, error: err.message || "Internal server error"});
    }
};

export const getCurrentUserController = async(req, res)=>{
    try{
        const user = await getCurrentUserService(req.user);
        return res.status(200).json({success: true, data: user});
    }catch(err){
         return res.status(err.statusCode || 500).json({success: false, error: err.message || "Internal server error"});
    }
};

export {registerUserController};