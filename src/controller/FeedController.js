import express, { Router } from 'express';
import 'express-promise-router';
import multer from 'multer';
import FeedService from '../service/FeedService.js';

//정적 라우터
const router = new Router();

router.get('/', async (req, res) => {
  res.json({ hello: '유저컨트롤러입니다.' });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage }).single('img');

router.post('/upload', upload, async (req, res) => {
  res.send(true);
});

router.post('/post', async (req, res) => {
  const result = await FeedService.addPost(req.body.user_id, req.body.content, req.body.topic_id);
  console.log('/post', result);
  res.send(result);
});

router.post('/comment', async (req, res) => {
  const result = await FeedService.addComment(req.body.user_id, req.body.post_id, req.body.content);
  console.log('/comment', result);
  res.send(result);
});

router.post('/search', async (req, res) => {
  const result = await FeedService.getSearchWord(req.body.word);
  console.log('/search', result);
  res.send(result);
});

router.post('/search/result', async (req, res) => {
  const result = await FeedService.getSearchResult(req.body.topic_id, req.body.user_id);
  console.log('/search/result', result);
  res.send(result);
});

router.get('/now', async (req, res) => {
  const result = await FeedService.getNowTopic();
  console.log('/now', result);
  res.send(result);
});

router.post('/hot', async (req, res) => {
  const result = await FeedService.getHotFeed(req.body.topic_id);
  console.log('/hot', result);
  res.send(result);
});

router.post('/following', async (req, res) => {
  const result = await FeedService.getFollowingFeed(req.body.topic_id, req.body.user_id);
  console.log('/following', result);
  res.send(result);
});

router.post('/like', async (req, res) => {
  const result = await FeedService.postLike(req.body.post_id, req.body.user_id, req.body.is_like);
  console.log('/like', result);
  res.send(result);
});

router.post('/hotTopic', async (req, res) => {
  const result = await FeedService.getHotTopic();
  console.log(result);
  res.send(result);
});

export default router;
