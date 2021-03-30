const {validateSubmission, Submission, createSubmission, getSubmission, handleCode} = require("../models/problem_submission");
const express = require("express");
const router = express.Router();

router.post("/", async(req, res) => {
    try{
        req.body.status = "Pending";// will raise an event after inserting to database any pending
        let error = await handleCode(req.body);
        if(error){
            return res.status(400).send(error.details);
        }
        error = validateSubmission(req.body);
        if(error){
            return res.status(400).send(error.details);
        }
        const submission = await createSubmission(req.body);
        res.send(submission);
    }
    catch(err){
        res.status(400).send("Bad Request");// stupid validation for now should customise response
    }
});

router.get("/:id", async(req, res) => {
    try{
        const submission = await getSubmission(req.params.id);
        if(!submission)
            return res.status(404).send({message : "Submission not found"});
        return res.send(submission);
    }
    catch(err){
        return res.status(404).send({message : "Submission not found"});
    }
});


module.exports = router;