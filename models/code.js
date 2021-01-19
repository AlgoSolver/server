const { Buffer } = require('buffer');
const Joi = require('joi');
const mongoose = require('mongoose');

const Code = mongoose.model('Code', new mongoose.Schema({
  codeId: {
    type: Number,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source_code: {
    data: Buffer, // to store our sourcce as data in the form of arrays.
  },
  language: {
    type: String,
    required: true
  },
}, {timestamps: true}));

function validateCode(code) {
  const schema = {
    codeId: Joi.number().unique().required(),
  };

  return Joi.validate(code, schema);
}

exports.Code = Code;
exports.validate = validateCode;