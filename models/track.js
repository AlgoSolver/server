const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const trackSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    childrenTracks:{
      type: String,
      required: true
    },
    parentTrack: {
      type: String,
      required: true
    },
    prerequistes: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

function validateTrack(track) {
  const schema = {
    title: Joi.string().min(10).max(50).required(),
    content: Joi.string().min(8).max(20).required(),
    author: Joi.string().required(),
    childrenTracks: Joi.string().required(),
    parentTrack: Joi.string().required(),
    prerequistes: Joi.string().required()
  };

  return Joi.validate(track, schema);
}
 
exports.validate = validateTrack;
module.exports = mongoose.model('Track', trackSchema);
