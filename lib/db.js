const mongoose = require('mongoose');

module.exports = async (url) => {
	mongoose
		.connect(url, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false,
		})
		.then(() => console.log('connected to db'));
};
