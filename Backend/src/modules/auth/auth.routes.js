import express from 'express';
import { registerUserController, loginUserController, getCurrentUserController} from './auth.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';




const router = express.Router();

router.post('/register',registerUserController);
router.post('/login', loginUserController );
router.get('/myprofile', authMiddleware, getCurrentUserController);
export default router;