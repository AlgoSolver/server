const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { createCode, validate } = require("../models/code");
const submissionStatusOptions = [
  "Pending",
  "Accepted",
  "Wrong Answer",
  "Time Limit Exceeded",
  "Memory Limit Exceeded",
  "Compilation Error",
];

const submissionSchema = new mongoose.Schema(
  {
    // According to schema description in: https://github.com/AlgoSolver/database-schema
    problem: {
      type: mongoose.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: mongoose.Types.ObjectId, // to store sourcce as data in the form of arrays.
      ref: "Code",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: submissionStatusOptions,
    },
    expectedComplexity: {
      // the complexity of last passed testSet
      type: String,
      default: "No Expected Complexity",
    },
    usedTime: {
      type: Number,
      default: 0,
    },
    usedMemory: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

async function handleCode(submission) {
  if (mongoose.Types.ObjectId.isValid(submission.code)) {
    return;
  }
  const { error } = validate(submission.code);
  if (error) {
    return error;
  }
  submission.code = (await createCode(submission.code))._id;
}

function validateSubmission(submission) {
  submission.code = String(submission.code);
  const schema = new Joi.object({
    problem: Joi.objectId().required(),
    author: Joi.objectId().required(),
    code: Joi.objectId().required(),
    expectedComplexity: Joi.string(),
    usedTime: Joi.number(),
    usedMemory: Joi.number(),
    status: Joi.string()
      .equal(...submissionStatusOptions)
      .required(),
  });
  const { error } = schema.validate(submission);
  return error;
}

// const {error} = validateSubmission({
//   problem : "123456789012123456789012",
//   author : "123456789012123456789012",
//   code : "123456789012123456789012",
//   status : "Compilation Error"
// });
// console.log("error => \n", error);

const Submission = mongoose.model("Submission", submissionSchema);

module.exports.Submission = Submission;
const SubmissionHandler = require("./submissionEventHandler");

const submissionHandler = new SubmissionHandler();

async function createSubmission(submission) {
  try {
    submission = new Submission(submission);
    const result = await submission.save();
    submissionHandler.emit("submit", submission._id);
    return result;
  } catch (err) {
    throw err;
  }
}

// createSubmission({
//     code : "601647f3318eb9c8bf4fb8c7",
//     problem : "60173c6d5236522717f7563c",
//     author : "123456789012123456789012"
// });

async function updateSubmission(id, updated) {
  try {
    const submission = await Submission.findById(id);
    if (!submission) {
      return false;
    }
    for (item in updated) {
      submission[item] = updated[item];
    }
    const res = await submission.save();
    return res;
  } catch (err) {
    throw err;
  }
}

// updateSubmission("60169108ba7de4fd99080ec2", {
//   status: "Accepted",
//   expectedComplexity : "O(N^2)"
// });

async function getSubmission(id) {
  try {
    const submission = await Submission.findById(id);
    return submission;
  } catch (err) {
    throw err;
  }
}

module.exports.validateSubmission = validateSubmission;
module.exports.createSubmission = createSubmission;
module.exports.getSubmission = getSubmission;
module.exports.updateSubmission = updateSubmission;
module.exports.handleCode = handleCode;
