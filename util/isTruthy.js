const isTruthy = (val) => {
	if (val.toLowerCase() === 'false') return false;
	return val;
};

module.exports = isTruthy;
