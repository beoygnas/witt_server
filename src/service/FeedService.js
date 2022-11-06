import sql from 'mysql2/promise';
import config from './database/dbconfig.js';

const FeedService = {
  addPost: async (user_id, content) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();

        const _topic_id = await connection.query('SELECT topic_id FROM Topic ORDER BY regdata DESC LIMIT 0, 1');
        const topic_id = JSON.parse(JSON.stringify(_topic_id))[0][0]['topic_id'];

        await connection.query(`
            INSERT INTO Post(user_id, content, topic_id) VALUES ('${user_id}', '${content}', '${topic_id}');
            `);
        const _post_id = await connection.query('SELECT LAST_INSERT_ID()');
        const post_id = JSON.parse(JSON.stringify(_post_id))[0][0]['LAST_INSERT_ID()'];

        await connection.commit();
        return {
          post_id: post_id,
        };
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }
    } catch (error) {
      throw new Error(`FEED/${error}`);
    }
  },

  addComment: async (user_id, post_id, content) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();

        await connection.query(`
            INSERT INTO Comment(user_id, post_id, content) VALUES ('${user_id}', ${post_id}, '${content}');
            `);
        const _comment_id = await connection.query('SELECT LAST_INSERT_ID()');
        const comment_id = JSON.parse(JSON.stringify(_comment_id))[0][0]['LAST_INSERT_ID()'];

        await connection.commit();
        return {
          comment_id: comment_id,
        };
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }
    } catch (error) {
      throw new Error(`FEED/${error}`);
    }
  },

  // 연관 검색어 추천
  getSearchWord: async (word) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();

        const _search_word = await connection.query(`
            SELECT topic_id, title FROM Topic WHERE title LIKE '%${word}%'
            `);
        const search_word = JSON.parse(JSON.stringify(_search_word))[0];

        await connection.commit();
        return search_word;
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }
    } catch (error) {
      throw new Error(`FEED/${error}`);
    }
  },

  // 검색 결과 반환: 인기 컨텐츠, 팔로잉 컨텐츠
  getSearchResult: async (topic_id, user_id) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();

        const _hot_feed = await connection.query(`
            SELECT p.post_id, p.user_id, p.content, p.regdata, p.likes, pl.user_id AS is_like
                FROM Post p
                LEFT JOIN Post_like pl ON pl.user_id = p.user_id
            WHERE topic_id = '${topic_id}' ORDER BY p.likes DESC LIMIT 0, 10
            `);
        const hot_feed = JSON.parse(JSON.stringify(_hot_feed))[0];

        const _following_feed = await connection.query(`
            SELECT p.post_id, p.user_id, p.content, p.regdata, p.likes, pl.user_id AS is_like
                FROM Post p
                INNER JOIN User_follow uf ON uf.following_id = p.user_id
                LEFT JOIN Post_like pl ON pl.user_id = p.user_id
            WHERE topic_id = '${topic_id}' AND uf.user_id = '${user_id}'
            LIMIT 10, 0
            `);
        const following_feed = JSON.parse(JSON.stringify(_following_feed))[0];

        await connection.commit();
        return { hot_feed, following_feed };
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }
    } catch (error) {
      throw new Error(`FEED/${error}`);
    }
  },

  // 지금의 주제
  getNowTopic: async () => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        const _now_topic = await connection.query(`
            SELECT topic_id, title, regdata, endtime FROM Topic ORDER BY regdata DESC LIMIT 0, 1
            `);
        const now_topic = JSON.parse(JSON.stringify(_now_topic))[0][0];

        await connection.commit();
        return { now_topic };
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }
    } catch (error) {
      throw new Error(`FEED/${error}`);
    }
  },

  // 팔로잉 피드 가쟈오기
  getFollowingFeed: async (user_id) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();

        const _following_feed = await connection.query(`
            SELECT p.post_id, p.user_id, p.content, p.regdata, p.likes, pl.user_id AS is_like
                FROM Post p
                INNER JOIN User_follow uf ON uf.following_id = p.user_id
                LEFT JOIN Post_like pl ON pl.user_id = p.user_id
            WHERE uf.user_id = '${user_id}' AND p.topic_id = (SELECT topic_id FROM Topic ORDER BY regdata DESC LIMIT 0, 1)
            LIMIT 10, 0
            `);
        const following_feed = JSON.parse(JSON.stringify(_following_feed))[0];

        await connection.commit();
        return following_feed;
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }
    } catch (error) {
      throw new Error(`FEED/${error}`);
    }
  },

  // 랜덤 피드 가쟈오기
  getHotFeed: async () => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();

        const _hot_feed = await connection.query(`
            SELECT p.post_id, p.topic_id, p.user_id, p.content, p.regdata, p.likes, pl.user_id AS is_like
                FROM Post p
                LEFT JOIN Post_like pl ON pl.user_id = p.user_id
            WHERE p.topic_id = (SELECT topic_id FROM Topic ORDER BY regdata DESC LIMIT 0, 1)
            ORDER BY rand() LIMIT 0, 10
            `);
        const hot_feed = JSON.parse(JSON.stringify(_hot_feed))[0];

        await connection.commit();
        return hot_feed;
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }
    } catch (error) {
      throw new Error(`FEED/${error}`);
    }
  },

  // 게시글 좋아요 누르기
  postLike: async (post_id, user_id, is_like) => {
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        console.log(is_like);
        if (is_like == 1) {
          // 좋아요
          await connection.query(`
            INSERT INTO Post_like (post_id, user_id) VALUE (${post_id}, '${user_id}')
            `);
          await connection.query(`
            UPDATE Post SET likes = (SELECT COUNT(*) FROM Post_like WHERE post_id = ${post_id})
            `);
        } else {
          // 좋아요 취소
          await connection.query(`
            DELETE FROM Post_like WHERE user_id = '${user_id}' AND post_id = ${post_id}
            `);
          await connection.query(`
            UPDATE Post SET likes = (SELECT COUNT(*) FROM Post_like WHERE post_id = ${post_id})
            `);
        }

        await connection.commit();
        return true;
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
        pool.end();
      }
    } catch (error) {
      throw new Error(`FEED/${error}`);
    }
  },
  getHotTopic: async () => {
    let result = [];
    try {
      const pool = sql.createPool(config);
      const connection = await pool.getConnection(async (conn) => conn);
      let topics = [];

      try {
        await connection.beginTransaction();
        try {
          topics = await connection.query(`select * from Topic order by rand() LIMIT 0, 6`);
          topics = topics[0];

          result = {
            hotopics: topics,
          };
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

export default FeedService;
