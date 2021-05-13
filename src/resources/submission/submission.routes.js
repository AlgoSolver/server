const {
  createSubmission,
  getSubmission,
  getUserSubmissions,
} = require("./submission.controler");
const router = require("express").Router();

router.route("/").post(createSubmission);

router.route("/:id").get(getSubmission);

router.route("/user/:uid").get(getUserSubmissions);

module.exports = router;
