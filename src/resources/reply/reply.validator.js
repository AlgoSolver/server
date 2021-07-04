const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateReplyId = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.objectId().required()
    });

    const {error} = schema.validate(req.params, {allowUnknown: true});
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    return next();
};

const validateReply = (req, res, next) => {
    const schema = Joi.object({
        date: Joi.date().required(),
        body: Joi.string().required()
    });

    const {error} = schema.validate(req.body, {allowUnknown: true});
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    return next();
};

module.exports = {
    validateReply,
    validateReplyId
};