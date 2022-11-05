import express from 'express';
import userController from './src/controller/UserController.js';
import feedController from './src/controller/FeedController.js';
import topicController from './src/controller/TopicController.js';

const app = express();
//정적 파일 사용하기
app.use(express.static('public'));

const port = process.env.PORT || 3000;

app.use(
  express.json({
    limit: '50mb',
  }),
);
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
  }),
);

//router
app.use('/user', userController);
app.use('/feed', feedController);
app.use('/topic', topicController);

app.get((req, res) => {
  res.status(404).send('not found');
});

app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});
