import connectionPool from "../../config/db"

async function createUser(userData){
    const {full_name, username, email, phone_number, password, profession, avatar_url} = userData;
    const sqlCode = `INSERT INTO users
    (full_name, username, email, phone_number, password, profession, avatar_url)
    VALUES(?,?,?,?,?,?,?)`;
    const [result] = await connectionPool.execute(sqlCode, [full_name, username, email, phone_number, password, profession, avatar_url]);
    return {id: result.insertId};
}

export const findUserByEmail = async (email)=>{
    const result = await connectionPool.execute(
        `SELECT id from users where email = ?`
        ,[email]
    );
    return result[0];
}

export {createUser};