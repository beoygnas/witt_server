import UserModel from '../model/UserModel.js';

const sql = require('mysql2/promise');
const UserService = {
  signup: async (user_id, user_email, user_passwrod, user_nickname, user_gender, user_phonenumber, user_age) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);

      try {
        await connection.beginTransaction();
        try {
          await connection.query(`UPDATE User SET nickname = '${user_id}' WHERE userId = '${user_email}'`);
        } catch (error) {
          return false;
        }
        await connection.commit();
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }
      return result;
    } catch (error) {
      throw new Error(`USER/${error}`);
    }
  },

  login: async (user_email, user_password) => {
    const result = await UserModel.login(user_email, user_password);
    return result;
  },
};

export default UserService;
