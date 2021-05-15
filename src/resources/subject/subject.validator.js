const Joi = require("joi");

exports.createSubject = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    topicName: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  req.body.name = req.body.name.toLowerCase();
  req.body.topicName = req.body.topicName.toLowerCase();
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
