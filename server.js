const connect = require('./lib/db');
const app = require('./app');
const config = require('config');
const dbUrl = config.get('app.DB_URI');
const port = config.get('app.port');

connect(dbUrl)
  .then(() => {
    app.listen(port, function () {
      console.log('Listening on, port number ' + port);
    });
  })
  .catch(err => {
    console.log(err);
  });
