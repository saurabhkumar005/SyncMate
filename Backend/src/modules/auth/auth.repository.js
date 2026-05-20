
import connectionPool from "../../config/db.js"

async function createUser(userData){
    const {full_name, username, email, phone_number, password, profession, avatar_url} = userData;
    const sqlCode = `INSERT INTO users
    (full_name, username, email, phone_number, password, profession, avatar_url)
    VALUES(?,?,?,?,?,?,?)`;
    const [result] = await connectionPool.execute(sqlCode, [full_name, username, email, phone_number, password, profession, avatar_url]);
    return {id: result.insertId};
}

export const findUserIdByEmail = async (email)=>{
    const result = await connectionPool.execute(
        `SELECT id from users where email = ?`
        ,[email]
    );
    return result[0];
}

export const findUserIdByUsername = async (username)=>{
    const query = `SELECT id from users where username = ?`;
    const result = await connectionPool.execute(query, [username]);
    return result[0];
}



export const findAuthUserData = (identifier)=>{
    const query = "select * from users where username = ? OR email = ?";
    const result = await connectionPool.execute(query, [identifier, identifier]);
    return result[0];
};

export {createUser};























