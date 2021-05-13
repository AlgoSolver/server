const router = require('express').Router();
const trackControllers = require('./track.controllers');

router.route('/')
    .get(trackControllers.tracks)
    .post(trackControllers.createTrack)

router.route('/:id')
    .get(trackControllers.track)
    .patch(trackControllers.updateTrack)
    .delete(trackControllers.deleteTrack)

module.exports = router;