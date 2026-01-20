const jwt = require("jsonwebtoken");
const User = require("../models/authModels");

module.exports = async (req, res, next) => {
	const header = req.headers.authorization;
	let token = null;

	if (header?.startsWith("Bearer ")) {
		token = header.split(" ")[1];
	}

	if (!token) return next(); // 👈 allow guest access

	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		if (!decoded?.id) return next();

		const user = await User.findById(decoded.id).select("_id email");
		if (user) req.user = user;
	} catch (err) {
		// silent failure — calculation still works
	}

	next();
};
