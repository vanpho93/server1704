const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');

const { storyRouter } = require('./controllers/story.controller');
const { userRouter } = require('./controllers/user.controller');
const { commentRouter } = require('./controllers/comment.controller');
const { friendRouter } = require('./controllers/friend.controller');

const { onError } = require('./middlewares/onError.middleware');

const app = express();
app.use(json());
app.use(cors());
app.use(onError);

app.use('/user', userRouter);
app.use('/story', storyRouter);
app.use('/comment', commentRouter);
app.use('/friend', friendRouter);

module.exports = { app };
