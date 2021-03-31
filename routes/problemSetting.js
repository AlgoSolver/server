const {validateProblem, createProblem,Problem, getProblems, updateProblem, validateProblemItems} = require("../models/problem");
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
    catch(err){
        console.error(err);
        res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
    }
})

router.put("/updateProblem/:id", async (req, res) => {
    try{
        const error = validateProblemItems(req.body);// author in body should be the same as current user.
        if(error){
            return res.status(400).send(error.details);
        }
        const problem = await updateProblem(req.params.id, req.body);
        if(!problem){
            return res.status(404).send({message : "The given Problem Id is invalid"});
        }
        return res.status(200).send(problem);
    }
    catch(err){
        return res.status(400).send({message : "Bad request "});// will be updated to print detailed error message
    }
});

module.exports = router;
