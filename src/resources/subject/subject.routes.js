const router = require("express").Router();
const subjectControllers = require("./subject.controllers");

router.route("").post(subjectControllers.createSubject);

router.route("/:topic").get(subjectControllers.subjects);

module.exports = router;
