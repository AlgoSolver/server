const router = require("express").Router();
const subjectControllers = require("./subject.controllers");
const subjectValidatot = require("./subject.validator");
router
  .route("")
  .post(subjectValidatot.createSubject, subjectControllers.createSubject);

router.route("/:topic").get(subjectControllers.subjects);

module.exports = router;
