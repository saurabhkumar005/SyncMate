
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
    const [rows] = await connectionPool.execute(
        `SELECT id from users where email = ?`
        ,[email]
    );
    return rows[0];
}

export const findUserIdByUsername = async (username)=>{
    const query = `SELECT id from users where username = ?`;
    const [rows] = await connectionPool.execute(query, [username]);
    return rows[0];
}



export const findAuthUserData = async(identifier)=>{
    const query = "select * from users where username = ? OR email = ?";
    const [rows] = await connectionPool.execute(query, [identifier, identifier]);
    return rows[0];
};

export const findUserById = async(userId)=>{
    const query = "SELECT id, username, email, phone_number, full_name, avatar_url, profession from users where id=?";
    //.execute() return [rows(can be more than 1), metadata];
    //rows is list of objects , object is all user rows that mysql2 return acccroding to your sql code, can be 1 or more thnan 1

    const [rows] = connectionPool.execute(query,userId);
    return rows[0];
};

export {createUser};























