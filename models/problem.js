const Joi = require("joi");


function validateTestSet(testSet){
    const schema = Joi.object({
        constraints: Joi.string().required(),
        expectedComplexity: Joi.string(),
        testCases : Joi.array().items(Joi.string()).min(1).required()
    });
    const {error} = schema.validate(testSet)
    return error;
}







module.exports.validateTestSet = validateTestSet;