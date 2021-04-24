const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
const submissionStatusOptions = require("./submissionStatusOptions");

module.exports.validateSubmission = (submission) => {
    submission.code = String(submission.code);
    const schema = new Joi.object({
        problem: Joi.objectId().required(),
        author: Joi.objectId().required(),
        code: Joi.objectId().required(),
        expectedComplexity : Joi.string(),
        usedTime : Joi.number(),
        usedMemory : Joi.number(),
        status : Joi.string().equal(...submissionStatusOptions).required()
    });
    const {error} = schema.validate(submission);
    return error;
}