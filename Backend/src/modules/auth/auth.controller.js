import { registerUserService } from "./auth.service.js";

async function registerUserController(req, res){
    try{
        const user = await registerUserService(req.body);
        return res.status(201).json({success: true, data: user});
    }catch(err){
        return res.status(err.statusCode || 500).json({success: false, error: err.message || "Internal server error"});
    }
}

export {registerUserController};