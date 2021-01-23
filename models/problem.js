const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const testCaseSchema = new Schema(
  {
    input: String,
    output: String,
  },
 {timestamps: true},
);

const problemSchema = new Schema({
  description: {
    title: {required: true, type: String},
    statement: {required: true, type: String},
    sampleInput: {required: true, type: String},
    sampleOutput: {required: true, type: String},
    samples: {required: true, type: [testCaseSchema]},
    timeLimit: {required: true, type: Number},
    memoryLimit: {required: true, type: Number},
    modelAnswer: {required: true, type: String},
    editorial: {required: true, type: String},
  },
  
}, {timestamps: true}
);

function validateProblem(Problem) {
  const schema = {
     title: Joi.string().required(),
      statement: Joi.string().required(),
      sampleInput: Joi.string().required(),
      sampleOutput: Joi.string().required(),
      samples: Joi.string().required(),
      timeLimit: Joi.string().required(),
      memoryLimit: Joi.string().required(),
      modelAnswer: Joi.string().required(),
      editorial: Joi.string().required(),
  };

  return Joi.validate(Problem, schema);
}

module.exports = mongoose.model('Problem', problemSchema);
module.exports = mongoose.model('testCaseSchema', testCaseSchema);
module.exports = mongoose.model('validateProblem', validateProblem);
