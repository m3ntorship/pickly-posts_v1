const express = require('express');
const connect = require('./lib/db');
const postRouter = require('./routes/postRoutes');
const imageRouter = require('./routes/imageRoutes');
const { protector } = require('./controllers/authController');
const errorHandler = require('./middleware/errorhandler');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: './.env' });

const app = express();
app.use(cors(), express.json());

// Security  
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());


app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// protect all routes
// app.use(protector);

app.get('/protected', (req, res) => {
  res.json({ protected: true });
});

app.use('/posts', postRouter);
app.use('/images', imageRouter);

app.use(errorHandler);

const dbUrl =
  process.env.DB_URI || 'mongodb://localhost:27017/multer-m3ntorship';

const port = 3001;
connect(dbUrl)
  .then(() => {
    app.listen(port, function () {
      console.log('Listening on, port number ' + port);
    });
  })
  .catch(err => {
    console.log(err);
  });
