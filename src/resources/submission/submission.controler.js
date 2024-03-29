const Submission = require("./submission.model");
const validate = require("./submission.validator");
const SubmissionHandler = require("./submissionEventHandler");
const getPagination = require("../../utils/getPagination");

const submissionHandler = new SubmissionHandler();

async function init(){
  const pendingProblems = await Submission.find({status: "Pending"}).select("_id");
  for(pendingProblem of pendingProblems){
    submissionHandler.emit("submit", pendingProblem._id);
  }
}
init();// call it

exports.createSubmission = async (req, res) => {
  if (!req.auth._id) {
    //return res.status(401).json({message: "Not Authorized!"});
    req.auth._id = req.body.author; // just for debugging
  }

  try {
    req.body.author = String(req.auth._id);
    req.body.status = "Pending"; // will raise an event after inserting to database any pending
    error = validate(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }
    const submission = new Submission(req.body);
    await submission.save();
    submissionHandler.emit("submit", submission._id);
    res.send(submission);
  } catch (err) {
    console.log("Error is :", err, "\n\n");
    res.status(400).send("Bad Request"); // stupid validation for now should customise response
  }
};

exports.getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .sort({
        createdAt: -1,
      })
      .populate("problem", "title")
      .populate("author", "username");

    if (!submission)
      return res.status(404).send({ message: "Submission not found" });
    return res.send(submission);
  } catch (err) {
    return res.status(404).send({ message: "Submission not found" });
  }
};

exports.getUserSubmissions = async (req, res) => {
  const limit = +req.query?.limit || 100;
  const page = +req.query?.page || 0;
  let submissions;
  try {
   submissions = await Submission.find({ author: req.params.uid })
      .sort({
        createdAt: -1,
      })
      .skip(page * limit)
      .limit(limit)
      .populate("problem", "title");
  } catch (err) {
    console.log(err)
    return res.status(404).send({ message: "User not found" });
  }
  return res.send(submissions || []);
};
exports.getUserSubmissionsProblem = async (req, res) => {
  const { uid, pid } = req.params;
  try {
    const submissions = await Submission.find({
      author: uid,
      problem: pid,
    })
      .sort({
        createdAt: -1,
      })
      .populate("problem", "title");
    return res.send(submissions);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again later!" });
  }
};
