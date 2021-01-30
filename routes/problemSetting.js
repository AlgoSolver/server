const {validateProblem, createProblem, getProblems, updateProblem} = require("../models/problem");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send({message : "Welcome Our Tourist :) !!!"});
})

router.get("/getProblems", async(req, res) => {
    try{
        const problems = await getProblems();
        res.send(problems);
    }
    catch(err){
        console.error(err);
        res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
    }
});


module.exports = router;