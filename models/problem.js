const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    tutrial: {required: true, type: String},
  }
  
}, {timestamps: true}));


module.exports = mongoose.model('Problem', problemSchema);
