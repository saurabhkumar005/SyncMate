import express from 'express';
import { registerUserController, loginUserController} from './auth.controller.js';




const router = express.Router();

router.post('/register',registerUserController);
router.post('/login', loginUserController );

export default router;