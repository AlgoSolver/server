const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateblogId = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.objectId().required()
    });

    const {error} = schema.validate(req.params, {allowUnknown: true});
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    return next();
};

const validateblog = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().trim().required(),
        date: Joi.date().required(),
        tags: Joi.array().items(Joi.string()),
        body: Joi.string()
    });

    const {error} = schema.validate(req.body, {allowUnknown: true});
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    return next();
};

const validateblogtags = (req, res, next) => {
    const schema = Joi.object({
        tags: Joi.string().required()
    });
    const {error} = schema.validate(req.query, {allowUnknown: true});
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    return next();
};

module.exports = {
    validateblog,
    validateblogId,
    validateblogtags
};