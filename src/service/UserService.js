import sql from 'mysql2/promise';
import config from './database/dbconfig.js';

const UserService = {
  signup: async (user_id, user_pw) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      let result = [];

      try {
        await connection.beginTransaction();
        try {
          result = await connection.query(`insert into User values('${user_id}', '${user_pw}')`);
        } catch (error) {return false;}
        await connection.commit();
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }

      result = {
        "result" : 'success'
      }
      return result;
    } catch (error) {
      result = {
        "result" : 'fail'
      }
      throw new Error(`USER/${error}`);
    }
  },

  login: async (user_id, user_pw) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      
      let result = [];

      

      try {
        await connection.beginTransaction();
        try {
          result = await connection.query(`select * from User where user_id = ? and user_pw = ?`, [user_id, user_pw]);
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

      if(result[0].length == 0){
        result = {
          "result" : 'fail'
        }
      }
      else result = {
        "result" : 'success'
      }
      
      console.log(result);
      return result;
    } catch (error) {
      throw new Error(`USER/${error}`);
    }
  },

  userinfo : async (user_id) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      let result = [];
      let posts = [];
      let followers = -1;

      try {
        await connection.beginTransaction();
        try {
          posts = await connection.query(
            `select * from Post where user_id = ?`, [user_id]);
          posts = posts[0];

          followers = await connection.query(
            `select * from User_follow where following_id = ?`, [user_id]);
          followers = followers[0].length
          console.log(followers);

          result = {
            "posts" : posts,
            "followers" :  followers
          }
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
};

export default UserService;
