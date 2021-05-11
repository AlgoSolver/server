const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
const submissionStatusOptions = require("./submissionStatusOptions");

module.exports = (submission) => {
    const schema = new Joi.object({
        problem: Joi.objectId().required(),
        author: Joi.objectId().required(),
        sourceCode: Joi.string().required(),
        expectedComplexity : Joi.string(),
        usedTime : Joi.number(),
        usedMemory : Joi.number(),
        status : Joi.string().equal(...submissionStatusOptions).required()
    });
    const {error} = schema.validate(submission);
    return error;
}