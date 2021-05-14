const Joi = require("joi");

exports.createTrack = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    img_url: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  req.body.name = req.body.name.toLowerCase();
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.updateTrack = (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      img_url: Joi.string(),
    });
  
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  };