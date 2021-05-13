const Submission = require("./submission.model");
const Problem = require("../problem/problem.model");
const axios = require("axios");
const EventEmitter = require("events");
const { exit } = require("process");

//const playgroundURL = "http://localhost:3000/";
const playgroundURL = "https://algosolver-playground.herokuapp.com/";
const runCodePath = "api/runCode",
  runCheckerPath = "api/runChecker";

class SubmissionHandler extends EventEmitter {
  constructor() {
    super();
    this.on("submit", (submissionId) => {
      console.log("Submission Emitted");
      this.testOneSubmission(submissionId)
        .then((res) =>
          console.log("Tested submission without problems !!!\n", res)
        )
        .catch((err) => {
          console.log(err.message);
          // try to check again after X seconds if server is back
          setTimeout(() => this.emit("submit", submissionId), 60000); // try to connect again every 60 seconds
        });
    });
  }

  async runTestCase(sourceCode, test) {
    try {
      const res = await axios.post(`${playgroundURL}${runCodePath}`, {
        lang: "C++",
        timeLimit: 10,
        sourceCode: sourceCode,
        input: test,
      });
      return {
        responded: true,
        body: res.data,
      };
    } catch (err) {
      return {
        responded: false,
      };
    }
  }

  async runChecker(sourceCode, input, userOutput, juryOutput) {
    try {
      const res = await axios.post(`${playgroundURL}${runCheckerPath}`, {
        lang: "C++",
        sourceCode: sourceCode,
        input: input,
        userOutput: userOutput,
        juryOutput: juryOutput,
      });
      return {
        responded: true,
        body: res.data,
      };
    } catch (err) {
      return {
        responded: false,
      };
    }
  }

  async testOneSubmission(submissionId) {
    console.log("Called here for testing ...\n");
    const submission = await Submission.findById(submissionId);

    if (submission.status != "Pending") {
      // done with handling it
      return;
    }

    const problem = await Problem.findById(submission.problem).populate(
      "testSets"
    );
    if (!problem || !problem.isPublished) {
      // can't submin non published problems
      throw new error("Submitting non published Problem!!!");
    }

    const userCode = submission.sourceCode;
    const juryCode = problem.modelAnswer;
    const checker = problem.checker;
    const testSets = problem.testSets;

    // console.log("UserCode :", userCode);
    // console.log("Jury code:", juryCode);
    // console.log("Checker code :", checker);

    for (let testSet of testSets) {
      for (let testCase of testSet.testCases) {
        // let's test that test case
        try {
          const userRes = await this.runTestCase(userCode, testCase);
          const juryRes = await this.runTestCase(juryCode, testCase);
          if (userRes.responded == false || juryRes.responded == false) {
            throw new Error("Not connected to playground");
          }
          if (userRes.body.codeStatus !== "Accepted") {
            submission.status = userRes.body.codeStatus;
            if (userRes.body.errorMessage)
              submission.errorMessage = userRes.body.errorMessage;
            submission.save();
            return submission;
          }
          // check for WA
          const checkerRes = await this.runChecker(
            checker,
            testCase,
            userRes.body.output,
            juryRes.body.output
          );
          if (checkerRes.responded == false) {
            throw new Error("Not connected to playground");
          }
          if (checkerRes.body.output !== "Accepted") {
            // Wrong Answer
            submission.status = "Wrong Answer";
            submission.save();
            return submission;
          }
          // accepted
          submission.usedTime = Math.max(
            submission.usedTime,
            userRes.body.usedTime
          );
        } catch (err) {
          throw err;
        }
      }
      // if passed whole testSet then I guess he has complexity = to that testSet
      if (testSet.expectedComplexity)
        submission.expectedComplexity = testSet.expectedComplexity;
    }
    //console.log("Passed all test cases");
    submission.status = "Accepted";
    submission.save();
    return submission;
  }
}

module.exports = SubmissionHandler;
