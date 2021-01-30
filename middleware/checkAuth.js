const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  req.auth = { notAuth: true };
  if (!req.cookies.user) {
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(req.cookies.user, process.env.JWT_KEY);
  } catch (err) {}
  if (!decodedToken || !decodedToken.userId) {
    return next();
  }
  let userExist;
  try {
    userExist = await User.findById(decodedToken.userId).select(
      "username email _id"
    );
  } catch (err) {}
  if (userExist) req.auth = userExist;

  return next();
};
