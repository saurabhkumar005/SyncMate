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
        SELECT m.id, m.content, m.message_type, m.created_at,
               m.sender_id, m.conversation_id,
               u.username, u.avatar_url
        FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.id = ?
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

/**
 * Returns all conversations for a user with participants and last message.
 * Uses two simple queries instead of JSON_ARRAYAGG (better MySQL compatibility).
 */
export const getUserConversations = async(userId)=>{
    // Step 1: Get all conversations with last message info
    const [convRows] = await connectionPool.execute(
        `
        SELECT
            c.id,
            c.type,
            c.group_name,
            c.group_avatar,
            c.created_at,
            m.content        AS last_message,
            m.created_at     AS last_message_time,
            sender.username  AS last_sender_name
        FROM conversations c
        JOIN conversation_participants cp ON cp.conversation_id = c.id
        LEFT JOIN messages m      ON m.id = c.last_message_id
        LEFT JOIN users sender    ON sender.id = m.sender_id
        WHERE cp.user_id = ?
        ORDER BY COALESCE(m.created_at, c.created_at) DESC
        `,
        [userId]
    );

    if (convRows.length === 0) return [];

    // Step 2: Get all participants for these conversations in one query
    const convIds = convRows.map(r => r.id);
    const placeholders = convIds.map(() => '?').join(',');

    const [partRows] = await connectionPool.execute(
        `
        SELECT cp.conversation_id, u.id, u.username, u.full_name, u.avatar_url
        FROM conversation_participants cp
        JOIN users u ON u.id = cp.user_id
        WHERE cp.conversation_id IN (${placeholders})
        `,
        convIds
    );

    // Step 3: Group participants by conversation_id
    const participantMap = {};
    partRows.forEach(p => {
        if (!participantMap[p.conversation_id]) participantMap[p.conversation_id] = [];
        participantMap[p.conversation_id].push({
            id: p.id,
            username: p.username,
            full_name: p.full_name,
            avatar_url: p.avatar_url,
        });
    });

    // Step 4: Merge
    return convRows.map(conv => ({
        ...conv,
        participants: participantMap[conv.id] || [],
    }));
};

/**
 * Returns all conversation IDs a user is part of (for socket room joining).
 */
export const getUserConversationIds = async(userId)=>{
    const [rows] = await connectionPool.execute(
        `SELECT conversation_id FROM conversation_participants WHERE user_id = ?`,
        [userId]
    );
    return rows.map(r => r.conversation_id);
};