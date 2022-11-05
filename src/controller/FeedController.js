import express, { Router } from 'express';
import 'express-promise-router';
import UserService from '../service/UserService.js';
import multer from 'multer';

//정적 라우터
const router = new Router();

router.get('/', async (req, res) => {
  res.json({ hello: '유저컨트롤러입니다.' });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../static');
  },
  filename: function (req, file, cb) {
    cb(null, `${post_id}`);
  },
});

var upload = multer({ storage: storage }).single('file');

// router.post('/img', upload.single('img'), (req, res) => {
//   res.json(req.file);
//   console.log(req.file);
// });

router.post('/signup', async (req, res) => {
  const result = await UserService.signup(req.body.user_id, req.body.user_email, req.body.user_password, req.body.user_nickname, req.body.user_gender, req.body.user_phonenumber, req.body.user_age);
  res.send(result);
});

export default router;
