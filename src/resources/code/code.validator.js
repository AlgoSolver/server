const Joi = require("joi");

exports.codeName = (req,res,next)=>{
  const schema = Joi.object({
    name:Joi.string().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}
