const {validateProblem, createProblem, getProblems, updateProblem} = require("../models/problem");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send({message : "Welcome Our Tourist :) !!!"});
})

module.exports = router;