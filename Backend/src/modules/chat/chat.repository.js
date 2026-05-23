import connectionPool from "../../config/db.js";

export const findExistingDirectConversation = async ( currentUserId, targetUserId)=>{

   const [rows] = await connectionPool.execute(
      `
      SELECT cp1.conversation_id
      FROM conversation_participants cp1
      JOIN conversation_participants cp2
      ON cp1.conversation_id = cp2.conversation_id
      JOIN conversations c ON c.id = cp1.conversation_id
      WHERE cp1.user_id = ? AND cp2.user_id = ? AND c.type = 'direct'
      LIMIT 1
      `,
      [currentUserId, targetUserId ]
    );
   return rows[0];
};

export const findUserById = async(userId)=>{
   const [rows] = await connectionPool.execute(
      `SELECT id FROM users WHERE id = ? `, [userId]
    );
   return rows[0];
};


export const createConversation = async(connection, createdBy)=>{
    const [result] = await connection.execute(
        `
        INSERT INTO conversations(type, created_by)
        VALUES('direct', ?)
        `,
        [createdBy]
    );

    return result.insertId;
};


export const addParticipant = async(connection, userId, conversationId)=>{
    await connection.execute(
        `
        INSERT INTO conversation_participants(user_id, conversation_id)
        VALUES(?,?)
        `,
        [userId, conversationId]
    );
};




export const findConversationById = async(conversationId)=>{
    const [rows] = await connectionPool.execute(
        `
        SELECT id, type
        FROM conversations
        WHERE id = ?
        `,
        [conversationId]
    );

    return rows[0];
};




export const checkConversationParticipant = async(userId, conversationId)=>{
    const [rows] = await connectionPool.execute(
        `
        SELECT id
        FROM conversation_participants
        WHERE user_id = ?
        AND conversation_id = ?
        `,
        [userId, conversationId]
    );

    return rows[0];
};




export const createMessage = async(connection, senderId, conversationId, content)=>{
    const [result] = await connection.execute(
        `
        INSERT INTO messages(sender_id, conversation_id, content)
        VALUES(?,?,?)
        `,
        [senderId, conversationId, content]
    );

    return result.insertId;
};




export const updateLastMessage = async(connection, conversationId, messageId)=>{
    await connection.execute(
        `
        UPDATE conversations
        SET last_message_id = ?
        WHERE id = ?
        `,
        [messageId, conversationId]
    );
};




export const findMessageById = async(messageId)=>{
    const [rows] = await connectionPool.execute(
        `
        SELECT *
        FROM messages
        WHERE id = ?
        `,
        [messageId]
    );

    return rows[0];
};


export const getConversationMessages = async(conversationId)=>{
    const [rows] = await connectionPool.execute(
        `
        SELECT m.id, m.content, m.message_type, m.created_at, u.id as sender_id,
        u.username, u.avatar_url FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
        `,
        [conversationId]
    );

    return rows;
};
export const getUserConversations = async(userId)=>{
    const [rows] = await connectionPool.execute(
        `
        SELECT c.id, c.type, c.group_name, c.group_avatar, 
        c.last_message_id, c.created_at FROM conversations c
        JOIN conversation_participants cp ON cp.conversation_id = c.id
        WHERE cp.user_id = ?
        ORDER BY c.created_at DESC
        `,
        [userId]
    );

    return rows;
};