const appError = require('../util/appError');
const activeEmailsModel = require('../models/activeEmailsModel');
const { verifyIdToken } = require('../util/verifyIdToken');
const User = require('../models/userMode');
const catchAsync = require('../util/catchAsync');

module.exports.protector = catchAsync(async (req, res, next) => {
	let {
		headers: { authorization },
	} = req;
	if (!authorization)
		next(new appError('please provide valid user token to proceed', 401));
	const [, token] = authorization.split(/bearer /i);
	const tokeninfo = await verifyIdToken(token);

	if (!(await activeEmailsModel.find({ email: tokeninfo.email })))
		throw 'your email is not active, you cant sign up';
	req.user = { tokeninfo };

	const mongoUser = await User.findOne({ email: req.user.tokeninfo.email });
	if (!mongoUser)
		mongoUser = await User.create({
			name: req.user.tokeninfo.name,
			email: req.user.tokeninfo.email,
		});
	req.user.mongouser = mongoUser.toJSON();

	// 	verifyIdToken(token)
	// 		.then(async (tokeninfo) => {
	// 			if (!(await activeEmailsModel.find({ email: tokeninfo.email })))
	// 				throw 'your email is not active, you cant sign up';
	// 			req.user = {
	// 				tokeninfo,
	// 			};
	// 		})
	// 		.then(() => User.findOne({ email: req.user.tokeninfo.email }))
	// 		.then(async (mongoUser) => {
	// 			if (!mongoUser)
	// 				mongoUser = await User.create({
	// 					name: req.user.tokeninfo.name,
	// 					email: req.user.tokeninfo.email,
	// 				});
	// 			req.user.mongouser = mongoUser.toJSON();
	// 			next();
	// 		})
	// 		.catch((error) => {
	// 			next(new appError(error.message, 401));
	// 		});
	// } else {
	// 	next(new appError('unauthorized', 401));
	// }
});

module.exports.activeUsersOnly = (req, res, next) => {
	activeEmailsModel
		.findOne({ email: req.user.tokeninfo.email })
		.then((isActive) => {
			if (isActive) {
				return next();
			} else {
				return next(new Error(403));
			}
		});
};
