const { trackController } = require("./tracks.controller.js");
const userValidator = require("./tracks.validator.js");
const router = require("express").Router();

// TODOs

// Create track + care about the access level. TODO isAuth as middleware
router.post("/add-track", trackControllerller.createTrack);

// Get track
router.get("/:id", trackController.getTrack);

// Get all tracks
router.post("/all-tracks", trackController.getAllTracks);

// Update track + care about the access level TODO isAuth as middleware
router.put("/update-track/:id", trackController.updateTrack);

// Upvote track
router.post("/:id/up-vote", trackController.upvoteTrack);

// Downvote track
router.post("/:id/down-vote", trackController.downvoteTrack);

// Delete track + care about the access level TODO isAuth as middleware
router.delete("/delete-track/:id", trackController.deleteTrack);

module.exports = router;
