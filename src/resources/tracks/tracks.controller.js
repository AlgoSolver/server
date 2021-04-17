const tracksModel = require("./tracks.model");
const tracksValidator = require("./user.validator");
const userModel = require("../user/user.controller.js");
const userValidator = require("../user/user.validator.js");

exports.createTrack = async (req, res) => {
  const newTrack = new tracksModel(req.body);
  try {
    const savedTrack = await newTrack.save();
    res.status(200).json(savedTrack);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getTrack = async (req, res) => {};

exports.getAllTracks = async (req, res) => {};

exports.updateTrack = async (req, res) => {};

// Upvote track
exports.upvoteTrack = async (req, res) => {};

// Downvote track
exports.downvoteTrack = async (req, res) => {};

exports.deleteTrack = async (req, res) => {};
