import sql from 'mysql2/promise';
import config from './database/dbconfig.js';
const multer = require('multer');

const UserService = {
  addPost: async (user_id, content, imageFile, topic_id) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();

        // file upload -> ../static/${post_id}.png
        var storage = multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, '../static');
          },
          filename: function (req, file, cb) {
            cb(null, `${post_id}`);
          },
        });

        var upload = multer({ storage: storage }).single('file');

        await connection.query(`
            INSERT INTO Post(user_id, cont)
            `);
        const commentIdResult = await connection.query('SELECT LAST_INSERT_ID()');
        const commentId = JSON.parse(JSON.stringify(commentIdResult))[0][0]['LAST_INSERT_ID()'];

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
