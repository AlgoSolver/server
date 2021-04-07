const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email }).select("password email username _id");
  } catch (err) {
    return res.status(500).json({ message: "Unknowen error" });
  }
  if (!user) {
    return res.status(400).json({ message: "Incorrect credentials." });
  }

  let validPassword;
  try {
    validPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    return res.status(400).json({ message: "Incorrect credentials." });
  }
  if (!validPassword) {
    return res.status(400).json({ message: "Incorrect credentials." });
  }
  delete user._doc.password;
  req.user = user._doc;
  return next();
};
