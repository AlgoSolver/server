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

exports.updateTrack = async (req, res) => {
  const track = tracksModel.findById(req.params.id);
  try {
    if (track.username === req.body.username) {
      await track.updateOne({ $set: req.body });
      res.status(200).json("Track Updated Successfully");
    } else {
      res
        .status(403)
        .json("Unauthorized permission: You can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Upvote track
exports.upvoteTrack = async (req, res) => {};

// Downvote track
exports.downvoteTrack = async (req, res) => {};

exports.deleteTrack = async (req, res) => {
  const track = tracksModel.findById(req.params.id);
  try {
    if (track.username === req.body.username) {
      await track.updateOne();
      res.status(200).json("Track Deleted Successfully");
    } else {
      res
        .status(403)
        .json("Unauthorized permission: You can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
