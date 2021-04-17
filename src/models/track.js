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
    isAdmin: {
      type: Boolean,
      default: false
    }
    parentTrack: {
      type:mongoose.ObjectId,
      ref:'Track'
      type: String,
      required: true
    },
    prerequistes: {
      type: String,
      default: ""
    },
    problems:{
      type:[mongoose.ObjectId],
      ref:'Problem'
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Track', trackSchema);
