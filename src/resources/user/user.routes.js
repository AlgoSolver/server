const userController = require("./user.controller");
const userValidator = require("./user.validator");
const router = require("express").Router();

router.get("/auth", userController.getCurrent);
router.post("/login", userValidator.login, userController.login);

router.post("/logout", userController.logout);
router.post("/google-login", userController.googleLogin);

router.post("/signup", userValidator.signup, userController.signup);

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
