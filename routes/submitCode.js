const {validateSubmission, Submission, createSubmission, getSubmission} = require("../models/problem_submission");
const express = require("express");
const router = express.Router();

router.post("/", async(req, res) => {
    try{
        req.body.status = "Pending";// will raise an event after inserting to database any pending
        const error = validateSubmission(req.body);
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
        res.send(submission);
    }
    catch(err){
        res.send(404).send("Submission not found");
    }
});


module.exports = router;