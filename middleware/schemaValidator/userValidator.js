const Joi = require("joi");

exports.login = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    remember: Joi.boolean(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.signup = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .insensitive()
      .invalid("login", "register", "profile")
      .pattern(
        new RegExp(
          /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
        )
      )
      .required(),
    email: Joi.string()
      .min(5)
      .max(30)
      .pattern(
        new RegExp(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      )
      .required(),
    password: Joi.string().min(3).max(30).required(),
    confirmedPassword: Joi.required().valid(Joi.ref("password")),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
exports.activateAccount = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
exports.tokenVerification = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
exports.emailVerification = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .pattern(
        new RegExp(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      )
      .required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.resetPassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(3).max(30).required(),
    confirmedPassword: Joi.required().valid(Joi.ref("password")),
    token: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
