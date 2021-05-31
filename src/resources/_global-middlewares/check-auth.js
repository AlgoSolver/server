const User = require("../user/user.model");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  req.auth = { notAuth: true };

  //cookies
  // const user = req?.cookies?.algosolver_user_credential || null;

  // header
  let user = req?.headers?.authentication?.split(" ")[1] || null;
  console.log(user);
  if (!user) {
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(user, process.env.JWT_KEY);
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
