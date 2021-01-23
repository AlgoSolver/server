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
    }
    prerequistes: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
  
);

 

module.exports = mongoose.model('Track', trackSchema);
