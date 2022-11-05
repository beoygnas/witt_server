const sql = require('mysql2/promise');
const UserService = {
  addPost: async (user_id, content, imageFile, topic_id) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        try {
          await connection.query(`
            INSERT INTO Post(user)
          `);
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
