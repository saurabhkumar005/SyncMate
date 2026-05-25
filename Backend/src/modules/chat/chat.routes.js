import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";

import { createDirectConversationController, sendMessageController, 
    getConversationMessagesController, getUserConversationsController
} from "./chat.controller.js";

const router = express.Router();



router.post("/direct", authMiddleware, createDirectConversationController );


router.post('/message', authMiddleware, sendMessageController);

router.get('/messages/:conversationId', authMiddleware, getConversationMessagesController);

router.get('/conversations', authMiddleware, getUserConversationsController);

export default router;