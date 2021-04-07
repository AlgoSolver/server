const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const trackSchema = new Schema(
  {
    title: {
      type: String
    },
    content: {
      type: String
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    parentTrack: {
<<<<<<< HEAD
      type:mongoose.ObjectId,
      ref:'Track'
=======
      type: String,
      required: true
>>>>>>> 8dc87b2e99e44d3908d5be583b430266959bb0e2
    },
    prerequistes: {
      type: String
    },
    problems:{
      type:[mongoose.ObjectId],
      ref:'Problem'
    }
  },
  { timestamps: true }
);

<<<<<<< HEAD
=======
function validateTrack(track) {
  const schema = {
    title: Joi.string().min(10).max(50).required(),
    content: Joi.string().min(8).max(20).required(),
    author: Joi.string().required(),
    childrenTracks: Joi.string().required(),
    parentTrack: Joi.string().required(),
    prerequistes: Joi.string().required()
  };
>>>>>>> 8dc87b2e99e44d3908d5be583b430266959bb0e2

  return Joi.validate(track, schema);
}
 
exports.validate = validateTrack;
module.exports = mongoose.model('Track', trackSchema);
