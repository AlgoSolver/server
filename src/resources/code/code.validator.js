const Joi = require("joi");

exports.codeName = (req,res,next)=>{
  const schema = Joi.object({
    name:Joi.string().min(3).max(32),
    code:Joi.string()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}
