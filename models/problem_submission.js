const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const { func } = require('joi');
Joi.objectId = require("joi-objectid")(Joi);


const submissionStatusOptions = ["Pending", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Memory Limit Exceeded", "Compilation Error"];

const submissionSchema = new mongoose.Schema( {
    // According to schema description in: https://github.com/AlgoSolver/database-schema
    problem: {
      type: mongoose.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: mongoose.Types.ObjectId, // to store sourcce as data in the form of arrays.
      ref: "Code",
      required: true,
    },
    status: {
      type : String,
      required : true,
      default : "Pending",
      enum : submissionStatusOptions
    },
    expectedComplexity : {// the complexity of last passed testSet
      type : String,
      default : "No Expected Complexity"
    },
    usedTime: {
      type: Number,
      default: 0,
    },
    usedMemory: {
      type: Number,
      default: 0,
    },

}, {timestamps: true});

function validateSubmission(Submission) {
  const schema = new Joi.object({
        problem: Joi.objectId().required(),
        author: Joi.objectId().required(),
        code: Joi.objectId().required(),
        expectedComplexity : Joi.string(),
        usedTime : Joi.number(),
        usedMemory : Joi.number(),
        status : Joi.string().equal(...submissionStatusOptions).required()
  });

  return schema.validate(Submission);
}

// const {error} = validateSubmission({
//   problem : "123456789012123456789012",
//   author : "123456789012123456789012",
//   code : "123456789012123456789012",
//   status : "Compilation Error"
// });
// console.log("error => \n", error);


const Submission = mongoose.model('Submission', submissionSchema);

module.exports.validateSubmission = validateSubmission;
module.exports.Submission = Submission;
