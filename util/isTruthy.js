const isTruthy = (val) => {
	if (val === 'false') return false;
	return val;
};

module.exports = isTruthy;
