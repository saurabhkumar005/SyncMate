import { verifyToken } from "../utils/jwt.js";

import AppError from "../utils/AppError.js";

const authMiddleware = (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new AppError("Unauthorized Access!", 401);
        }

        const token = authHeader.split(" ")[1];

        //verification of JWT token -> return {userId/user Payload : value, metadata of token... }
        const authData = verifyToken(token);

        req.user = authData;

        next();


    }catch(err){
        return res.status(err.statusCode || 401).json({success:false, message: err.message || "Unauthorized Access!"});
    }
}
export default authMiddleware;
