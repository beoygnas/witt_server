import express, { Router } from 'express';
import 'express-promise-router';
import TopicService from '../service/TopicService.js';

//정적 라우터
const router = new Router();

router.post('/addTopic', async (req, res) => {
  const result = await TopicService.addTopic(req.body.title, req.body.user_id);
  console.log('/addTopic', result);
  res.send(result);
});

router.post('/voteTopic', async (req, res) => {
  const result = await TopicService.voteTopic(req.body.untopic_id, req.body.user_id);
  console.log('/voteTopic', result);
  res.send(result);
});

router.post('/randomTopic', async (req, res) => {
  const result = await TopicService.randomTopic();
  console.log('/randomTopic', result);
  res.send(result);
});

router.post('/confirmTopic', async (req, res) => {
  const result = await TopicService.confirmTopic(req.body.title, req.body.endtime);
  console.log('/confirmTopic', result);
  res.send(result);
});

export default router;
