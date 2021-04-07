module.exports = (req, res, next) => {
	if (req?.auth?.notAuth === true || !req.auth) {
		return res
			.status(4001)
			.json({ message: "You must login first to do this" });
	}
	return next();
};