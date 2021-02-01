const {Submission} = require("./problem_submission");
const { Code } = require("./code");
const { Problem} = require("./problem");
const axios = require("axios");
const playgroundURL = "http://localhost:3000/";
const runCodePath = "api/runCode", runCheckerPath = "api/runChecker";

class SubmissionHandler{
    constructor(){

    }

    async runTestCase(sourceCode, test){
        try{
            const res = await axios.post(`${playgroundURL}${runCodePath}`, {
                "lang" : "C++", 
                "timeLimit" : 10,
                "sourceCode" : sourceCode,
                "input" : test
            });
            return {
                responded : true,
                body : res.data
            };
        }
        catch(err){
            return {
                responded : false
            };
        }
    }

    async runChecker(sourceCode, input, userOutput, juryOutput){
        try{
            const res = await axios.post(`${playgroundURL}${runCheckerPath}`, {
                "lang" : "C++", 
                "sourceCode" : sourceCode,
                "input" : input, 
                "userOutput" : userOutput,
                "juryOutput" : juryOutput
            });
            return {
                responded : true,
                body : res.data
            };
        
        }
        catch(err){
            return {
                responded : false
            };
        }
    }
    
    async testOneSubmission(submissionId){
        const submission = await Submission.findById(submissionId)
        .populate("code", "sourceCode");

        if(submission.status != "Pending"){ // done with handling it
            return;
        }

        const problem = await Problem.findById(submission.problem).populate("modelAnswer").populate("checker").populate("testSets");
        if(!problem || !problem.isPublished){// can't submin non published problems
            throw new error("Submitting non published Problem!!!");
        }
        const userCode = (await Code.findById(submission.code)).sourceCode;
        const juryCode = problem.modelAnswer.sourceCode;
        const checker = problem.checker.sourceCode;
        const testSets = problem.testSets;

        for(let testSet of testSets){
            for(let testCase of testSet.testCases){// let's test that test case
                try{
                    const userRes = await this.runTestCase(userCode, testCase);
                    const juryRes = await this.runTestCase(juryCode, testCase);
                    if(userRes.responded == false || juryRes.responded == false){
                        throw new Error("Not connected to playground");
                    }
                    if(userRes.body.codeStatus !== "Accepted"){
                        submission.status = userRes.body.codeStatus;
                        submission.save();
                        return submission;
                    }
                    // check for WA 
                    const checkerRes = await this.runChecker(checker, testCase, userRes.body.output, juryRes.body.output);
                    if(checkerRes.responded == false){
                        throw new Error("Not connected to playground");
                    }
                    if(checkerRes.body.output !== "Accepted"){
                        // Wrong Answer
                        submission.status = "Wrong Answer";
                        submission.save();
                        return submission;
                    }   
                }
                catch(err){
                    throw err;
                }
            }
            // if passed whole testSet then I guess he has complexity = to that testSet
            if(testSet.expectedComplexity)
                submission.expectedComplexity = testSet.expectedComplexity;
        }
        //console.log("Passed all test cases");
        submission.status = "Accepted";
        submission.save();
        return submission;
    }
  }

module.exports = SubmissionHandler;
