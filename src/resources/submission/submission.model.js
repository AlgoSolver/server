const mongoose = require("mongoose");
const submissionStatusOptions = require("./submissionStatusOptions");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    sourceCode: {
      type: String,
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
    errorMessage: {
      type: String,
    },
    language: {
      type: String,
      default: "C++",
    },
  },
  { timestamps: true }
);

submissionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Submission", submissionSchema);
