const jwt = require("jsonwebtoken");
const User = require("./user.model");
const bcrypt = require("bcryptjs");
const send = require("../../services/send-mail");
const { OAuth2Client } = require("google-auth-library");
const activateAccountTemp = require("./users.emails");
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email }).select("password email username _id");
  } catch (err) {
    return res.status(500).json({ message: "Unknowen error" });
  }
  if (!user) {
    console.log("heloo");
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
  const token = jwt.sign(
    {
      email: user._doc.email,
      userId: user._doc._id,
      username: user._doc.username,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "365d",
    }
  );

  // cookies
  // res.cookie("algosolver_user_credential", token, {
  //   httpOnly: true,
  //   max: 1000 * 60 * 60 * 24 * 12, // 1 year
  // });

  return res.status(200).json({ user: { ...user._doc }, token });
};
exports.logout = async (req, res) => {
  res.clearCookie("algosolver_user_credential");
  return res.status(200).json({ notAuth: true });
};
exports.getCurrent = async (req, res) => {
  return res.status(200).json(req.auth);
};
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  let response;
  try {
    response = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }
  const { email_verified, name, email } = response.payload;
  //return res.status(200).json({message:"heloo"});
  if (!email_verified) {
    return res
      .status(422)
      .json({ message: "You have to Verify your account first" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: "Google login failed. Try again" });
  }

  if (!existingUser) {
    return res.status(400).json({ message: "Account does't exist" });
    //     let password = email + process.env.JWT_KEY;
    //     existingUser = new User({ username, email, password });
    //     try {
    //       await existingUser.save();
    //     } catch (err) {
    //       return res
    //         .status(500)
    //         .json({ message: "Google login failed. Try again" });
    //     }
  }

  const token = jwt.sign(
    {
      email: email,
      userId: existingUser._id,
      username: existingUser.username,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "365d",
    }
  );
  // res.cookie("algosolver_user_credential", token, {
  //   httpOnly: true,
  //   max: 1000 * 60 * 60 * 24 * 12, // 1 year
  // });
  return res.status(200).json({
    token,
    user: {
      email,
      _id: existingUser._id,
      username: existingUser.username,
    },
  });
};
exports.signup = async (req, res, next) => {
  const { email, password, username } = req.body;
  // check if user is already exist or not
  let existingUser;
  try {
    existingUser = await User.exists({ email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }

  if (existingUser) {
    return res
      .status(422)
      .json({ message: "User exists already, please login instead." });
  }
  // user dos't exist
  // generate a token and send an email to activate this email
  try {
    const token = jwt.sign(
      { username, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "30m" }
    );
    const e = send(
      email,
      "Activate Email",
      activateAccountTemp(
        process.env.NODE_ENV === "production"
          ? process.env.CLIENT_PROD_URL
          : process.env.CLIENT_DEV_URL,
        token
      )
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }

  //email has beem sent
  return res.status(200).json({ email, password, username });
};

exports.activateAccount = async (req, res, next) => {
  const { token } = req.body;
  //if the token exist
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
  } catch (err) {
    return res.status(500).json({ message: "Expired Link. Signup again" });
  }
  if (!decodedToken) {
    return res.status(500).json({ message: "Expired Link. Signup again" });
  }
  const { username, email, password } = decodedToken;
  // check if the email is already activated
  let existingUser;
  try {
    existingUser = await User.exists({ email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }
  if (existingUser) {
    return res
      .status(422)
      .json({ message: "User exists already, please login instead." });
  }
  // incode password
  let incryptedPassword;
  try {
    incryptedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }
  let newUser = new User({ username, email, password: incryptedPassword });
  try {
    await newUser.save();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }
  //account has been created
  return res.status(200).json({ username, email });
};

exports.tokenVerification = async (req, res) => {
  const { token } = req.body;
  //if the token exist
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_RESET_PASSWORD);
  } catch (err) {
    return res.status(500).json({ message: "Expired Link. Try again" });
  }
  if (!decodedToken) {
    return res.status(500).json({ message: "Expired Link. Try again" });
  }
  const { username, email } = decodedToken;
  return res.status(200).json({ username, email });
};

exports.emailVerification = async (req, res, next) => {
  const { email } = req.body;
  // check if user is already exist or not
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }

  if (!existingUser) {
    return res
      .status(422)
      .json({ message: "Invalid email, This email dose not exist." });
  }
  // sending the url in an email
  try {
    const token = jwt.sign(
      { _id: existingUser._id, email, username: existingUser.username },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "30m",
      }
    );

    const text = `<h1>Please use the following link to change your account password</h1>
          <p>${
            process.env.NODE_ENV === "production"
              ? process.env.CLIENT_PROD_URL
              : process.env.CLIENT_DEV_URL
          }/accounts/new-password/${token}</p>
          <hr />
          <p>this email may conatan sensitive information</p>
          <p>${
            process.env.NODE_ENV === "production"
              ? process.env.CLIENT_PROD_URL
              : process.env.CLIENT_DEV_URL
          }</p>
       `;
    existingUser.resetPasswordLink = token;
    await existingUser.save();
    const e = send(email, "Reset Password", text);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }
  return res.status(200).json({ email });
};

exports.resetPassword = async (req, res, next) => {
  const { password, token } = req.body;

  // decode the resetPasswordLink
  let userInfo;
  try {
    userInfo = jwt.verify(token, process.env.JWT_RESET_PASSWORD);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }

  if (!userInfo._id) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }

  let user;
  try {
    user = await User.findById(userInfo._id);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong. Try later" });
  }
  if (user.resetPasswordLink !== token)
    return res.status(500).json({ message: "This token has been expired" });
  // incode password
  let incryptedPassword;
  try {
    incryptedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try later." });
  }
  try {
    user.password = incryptedPassword;
    user.resetPasswordLink = "";
    user.save();
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong. Try later" });
  }
  return res.status(200).json({ email: userInfo.email || user.email });
};
