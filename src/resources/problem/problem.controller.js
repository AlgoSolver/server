const Problem = require("./problem.model");
const {validateProblem, validateProblemItems} = require("./problem.validator");
const getPagination = require('../../utils/getPagination');

const selectedFields = "title description timeLimit memoryLimit editorial";

exports.getProblems = async (req, res) => {
    try{
        const problems = await Problem.paginate({
            isPublished:true
        },{...getPagination(parseInt(req.query.page)-1,2), select : selectedFields}
        );
        return res.json(problems)
    }
    catch(err){
      console.error(err);
      return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
    }
}

exports.getProblem = async (req,res)=>{
    try{
        const problem = await Problem.findById(req.params.id)
        .select(selectedFields);
        return res.json(problem)
    }
    catch(err){
        console.error(err);
        res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
    }
}

exports.createProblem = async(req, res) => {
    try{
        const error = validateProblem(req.body);// author in body should be the same as current user.
        if(error){
            return res.status(400).send(error.details);
        }
        const problem = new Problem(req.body);
        await problem.save();
        res.status(200).send(problem);
    }
    catch(err){
        console.error(err);
        res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
    }
}

exports.updateProblem = async(req, res) => {
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
}