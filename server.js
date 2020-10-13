const express = require("express");
const connect = require("./lib/db");
const postRouter = require('./routes/postRoutes');
const protector = require("./controllers/authController");
const errorHandler = require("./middleware/errorhandler");
const cors = require('cors');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require('swagger-ui-express');
const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: "./.env" });


const app = express();
app.use(cors(), express.json());

const swaggerOptions = {
  swagerDefinition: {
    info: {
      title: 'Pickly API',
      description: 'Pickly API documentation',
      contact: {
        name: 'm3ntorship.com'
      },
      servers: ["https://pickly.io"],
    }
  },
  apis: ['server.js', './routes/*.js']
};

swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// protect all routes
app.use(protector);

app.get("/protected", (req, res) => {
  res.json({ protected: true });
});

app.use('/posts', postRouter);

app.use(errorHandler);

const dbUrl =
  process.env.DB_URI || "mongodb://localhost:27017/multer-m3ntorship";

const port = 3001;
connect(dbUrl)
  .then(() => {
    app.listen(port, function () {
      console.log("Listening on, port number " + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
