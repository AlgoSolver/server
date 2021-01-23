const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
      type: String,
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

}, {timestamps: true}));

module.exports = mongoose.model('submissionSchema', trackSchema);
