const Joi = require("joi");

exports.createTopic = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    trackName: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  req.body.name = req.body.name.toLowerCase();
  req.body.trackName = req.body.trackName.toLowerCase();
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};