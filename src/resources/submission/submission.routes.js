const {
  createSubmission,
  getSubmission,
  getUserSubmissions,
  getUserSubmissionsProblem,
} = require("./submission.controler");
const router = require("express").Router();

router.route("/").post(createSubmission);

router.route("/:id").get(getSubmission);

router.route("/user/:uid").get(getUserSubmissions);

// get the problem submissions for  a particular user
router.route("/:pid/:uid").get(getUserSubmissionsProblem);
module.exports = router;
