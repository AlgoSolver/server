const {validateSubmission, Submission, createSubmission, getSubmission, handleCode} = require("../models/problem_submission");
const express = require("express");
const router = express.Router();

router.post("/", async(req, res) => {
    if(!req.auth._id){
      return res.status(402).json({message: "Not Authorized!"});
    }
    try{
        req.body.author = String(req.auth._id);
        req.body.code.author =  String(req.auth._id);
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

router.get("/user/:uid", async(req, res) => {
    try{
        const submissions = await Submission.find({author:req.params.uid});
        res.send(submissions);
    }
    catch(err){
        return res.status(404).send({message : "User not found"});
    }
});

module.exports = router;
