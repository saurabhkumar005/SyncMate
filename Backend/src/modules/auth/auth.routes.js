import express from 'express';
import { registerUserController } from './auth.controller.js';





const router = express.Router();

router.post('/register',registerUserController);

export default router;