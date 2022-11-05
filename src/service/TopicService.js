import sql from 'mysql2/promise';
import config from './database/dbconfig.js';

const TopicService = {
  addTopic: async (title, user_id) => {
    let result = [];
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
    
      try {
        await connection.beginTransaction();
        try {
          result = await connection.query(
            `insert into Untopic values(null, ?, ?, 0, default)`, [title, user_id]);
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

  voteTopic : async (untopic_id, user_id) => {
    let result = [];
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      
      let isLiked = [];
  
      try {
        await connection.beginTransaction();
        try {          
          isLiked = await connection.query(
            `select * from Untopic_like where untopic_id = ? and user_id = ?`,
            [untopic_id, user_id]
          )
      
          
          isLiked = isLiked[0].length
          console.log(isLiked)

          if(isLiked == 0){
            
            result = await connection.query(
              `insert into Untopic_like(untopic_id, user_id, regdata) values(?, ?, default)`, [untopic_id, user_id]);
            await connection.query(
              `update Untopic set likes = likes + 1 where untopic_id = ?`, 
              [untopic_id]
            );
            result = {
              "result" : '투표 성공'
            };
          }
          else{
            result = await connection.query(
              `delete from Untopic_like where untopic_id = ? and user_id = ?`, [untopic_id, user_id]);
      
            await connection.query(
              `update Untopic set likes = likes - 1 where untopic_id = ?`, 
              [untopic_id]
            );
            result = {
              "result" : '투표 취소'
            }
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
      result = {
        "result" : 'fail'
      }
      throw new Error(`USER/${error}`);
    }
  },

  randomTopic : async () => {
    let result = [];
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      let topics = [];

      try {
        await connection.beginTransaction();
        try {
          topics = await connection.query(
            `select * from Untopic order by rand() LIMIT 0, 5`);
          topics = topics[0];

          result = {
            "randomtopics" : topics,
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

  confirmTopic : async (title, endtime) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      let result = [];
    
      try {
        await connection.beginTransaction();
        try {
          await connection.query(
            `insert into Topic values(null, ?, default, ?)`, 
            [title, endtime]);
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
      result = {
        "success" : 'success'
      }
      return result;
    } catch (error) {
      throw new Error(`USER/${error}`);
    }
  },
};

export default TopicService;
