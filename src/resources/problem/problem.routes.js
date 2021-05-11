const { getProblems, createProblem, getProblem, updateProblem } = require("./problem.controller");

const router = require("express").Router();

router.route("/")
    .get(getProblems) 
    .post(createProblem);// should be admin

router.route("/:id")
    .get(getProblem)
    .put(updateProblem); // should be admin

module.exports = router;