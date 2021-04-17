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

exports.getTrack = async (req, res) => {
  try {
    const track = await tracksModel.findById(req.params.id);
    res.status(200).json(track);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllTracks = async (req, res) => {};

exports.updateTrack = async (req, res) => {
  const track = await tracksModel.findById(req.params.id);
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
exports.voteTrack = async (req, res) => {
  try {
    const track = await tracksModel.findById(req.params.id);
    // after finding this track, I'm  gonna check if this post in the upvoteTrack array or not
    if (!track.upvoteTrack.include(req.body.username) === req.body.username) {
      await track.updateOne({ $push: { upvoteTrack: req.body.username } });
      res.status(200).json("Track has been upvoted");
    } else {
      // In case downvoted, just pull out this user
      await track.updateOne({ $pull: { upvoteTrack: req.body.username } });
      res.status(200).json("Track has been downvoted");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

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
