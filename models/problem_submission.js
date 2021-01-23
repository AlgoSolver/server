const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');


const submissionSchema = new Schema( 
{
    // According to schema description in: https://github.com/AlgoSolver/database-schema
    contest: {
      type: mongoose.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    problem: {
      type: mongoose.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDuringContest: {
      type: Boolean,
      default: false,
    },
    isJudged: {
      type: Boolean,
      required: true,
      default: false,
    },
    SubmissionID: {
      type: Number,
    },
    sourceCode: {
      type: Buffer, // to store sourcce as data in the form of arrays.
      required: true,
    },
    time: {
      type: Number,
      default: 0,
    },
    languageID: { // till now c++
      type: Number,
      required: true,
    },
    memory: {
      type: Number,
      default: 0,
    },

}, {timestamps: true});

function validateSubmission(Submission) {
  const schema = {
        title: Joi.string().required(),
        user: Joi.any(),
        problem: Joi.string().required().min(1),
        contest: Joi.string().min(1),
        languageID: Joi.number().required().min(1),
        sourceCode: Joi.array().required().min(1) // i don't know if type Buffer works with Joi or not, please review it
  };

  return Joi.validate(Submission, schema);
}

module.exports = mongoose.model('Submission', submissionSchema);
module.exports = mongoose.model('validateSubmission', validateSubmission);
