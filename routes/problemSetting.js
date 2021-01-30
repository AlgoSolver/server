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

router.post("/postProblem", async(req, res) => {
    try{
        const error = validateProblem(req.body);// author in body should be the same as current user.
        if(error){
            return res.status(400).send(error.details);
        }
        const problem = await createProblem(req.body);
        res.status(200).send(problem);
    }
    catch(err) {

    }
})


module.exports = router;