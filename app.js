const dotenv = require('dotenv');
const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');
const postRouter = require('./posts/post.routes');
const imageRouter = require('./images/image.routes');
const userRouter = require('./users/user.routes');
const { protector } = require('./auth/auth.controller');
const errorHandler = require('./middleware/errorhandler');
const logger = require('./util/logger');
dotenv.config({ path: resolve('secrets', '.env') });

const app = express();

app.use(cors(), express.json());

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: false,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true
  })
);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// protect all routes
app.use(protector);

app.get('/protected', (req, res) => {
  res.json({ protected: true });
});

app.use('/posts', postRouter);
app.use('/images', imageRouter);
app.use('/user', userRouter);

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger
  })
);

app.use(errorHandler);

module.exports = app;
