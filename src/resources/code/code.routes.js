const router = require("express").Router();
const { codeName } = require("./code.validator");
const codeControllers = require("./code.controllers");
const authGuard = require("../_global-middlewares/auth-guard");

const fun = (req, res) => res.json({ message: "working" });
router
  .route("/")
  .post(codeName, authGuard, codeControllers.createCode);

router
  .route("/:id")
  .get(codeControllers.code)
  .patch(codeName, authGuard, codeControllers.updateCode)
  .delete(authGuard, codeControllers.deleteCode);

 router.get("/user/:username",codeControllers.codes);

module.exports = router;
