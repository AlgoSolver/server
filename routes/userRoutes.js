const express = require("express");
const router = express.Router();
const userValidator = require("../middleware/schemaValidator/userValidator");
const verificationCheck = require("../middleware/verificationCheck");
const userController = require("../controllers/userController");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    "Too many request created from this IP, please try again after an 10 minutes",
});

router.get("/auth", userController.getCurrent);
router.post(
  "/login",
  userValidator.login,
  verificationCheck,
  userController.login
);

router.post("/logout", userController.logout);
router.post("/google-login", userController.googleLogin);

router.post("/signup", limiter, userValidator.signup, userController.signup);

router.post(
  "/activate-account",
  userValidator.activateAccount,
  userController.activateAccount
);

router.post(
  "/email-verification",
  userValidator.emailVerification,
  userController.emailVerification
);
router.post(
  "/token-verification",
  userValidator.tokenVerification,
  userController.tokenVerification
);

router.post(
  "/reset-password",
  userValidator.resetPassword,
  userController.resetPassword
);

module.exports = router;
