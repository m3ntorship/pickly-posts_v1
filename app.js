const dotenv = require('dotenv');
const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const postRouter = require('./posts/post.routes');
const imageRouter = require('./images/image.routes');
const { protector } = require('./auth/auth.controller');
const errorHandler = require('./middleware/errorhandler');
dotenv.config({ path: resolve('secrets', '.env') });

const app = express();

app.use(cors(), express.json());

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

app.use(errorHandler);

module.exports = app;
