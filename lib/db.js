const mongoose = require('mongoose');
const config = require('config');

const dbUrl = config.get('app.db_uri');

module.exports = async () => {
  mongoose
    .connect(dbUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(() => console.log('connected to db'));
};
