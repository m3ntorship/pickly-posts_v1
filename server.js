const connect = require("./lib/db");
const app = require("./app");

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
