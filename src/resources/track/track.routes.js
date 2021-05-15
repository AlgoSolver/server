const router = require("express").Router();
const trackControllers = require("./track.controllers");
const trackValidator = require("./track.validator");
router
  .route("/")
  .get(trackControllers.tracks)
  .post(trackValidator.createTrack, trackControllers.createTrack);

router
  .route("/:id")
  .get(trackControllers.track)
  .patch(trackValidator.updateTrack, trackControllers.updateTrack)
  .delete(trackControllers.deleteTrack);

module.exports = router;
