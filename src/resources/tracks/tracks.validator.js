const Joi = require("joi");
const tracks = require("./tracks.routes");
const tracks = require("./tracks.model");

function validateTrack(track) {
  const schema = {
    title: Joi.string().min(10).max(50).required(),
    content: Joi.string().min(8).max(20).required(),
    author: Joi.string().required(),
    childrenTracks: Joi.string().required(),
    parentTrack: Joi.string().required(),
    prerequistes: Joi.string().required(),
  };

  return Joi.validate(track, schema);
}

module.exports = validateTrack;
