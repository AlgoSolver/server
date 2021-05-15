const { Problem } = require("../models/problem");
const express = require("express");
const getPagination = require("../utils/getPagination");

const router = express.Router();

router.get("/", async (req, res) => {
  let problems;
  try {
    problems = await Problem.paginate(
      {
        // isPublished:true
      },
      getPagination(parseInt(req.query.page) - 1, 2)
    );
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  return res.json(problems);
});

router.get("/:id", async (req, res) => {
  let problem;
  try {
    problem = await Problem.findById(req.params.id).select(
      "title description timeLimit memoryLimit editorial"
    );
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  return res.json(problem);
});
module.exports = router;
