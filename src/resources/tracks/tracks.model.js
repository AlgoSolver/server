const mongoose = require("mongoose");
const Joi = require("joi");
const User = require("../user/user.model");
const User = require("../user/user.model");
const User = require("../user/problem.model");

const Schema = mongoose.Schema;

const trackSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    parentTrack: {
      type: mongoose.ObjectId,
      ref: "Track",
      type: String,
      required: true,
    },
    prerequistes: {
      type: String,
    },
    problems: {
      type: [mongoose.ObjectId],
      ref: "Problem",
    },
    upvoteTrack: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Track", trackSchema);
