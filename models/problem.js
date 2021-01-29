const mongoose = require("mongoose");
const Joi = require("joi");
const { func } = require("joi");


mongoose.connect("mongodb://localhost/playground")// only here for testing will be removed and implemented at index.js
    .then(() => console.log("Connected Successfully..."))
    .catch((err) => console.error(err));


function validateTestSet(testSet){
    const schema = Joi.object({
        constraints: Joi.string().required(),
        expectedComplexity: Joi.string(),
        testCases : Joi.array().items(Joi.string()).min(1).required()
    });
    const {error} = schema.validate(testSet)
    return error;
}

const testSetSchema = new mongoose.Schema({
    constraints: {
        type: String,
        required : true
    },
    expectedComplexity : {
        type : String,
        default: "Can't detect Complexity"// for problems where we can't decide the exact complexity such as randomization problems also for sample input
    }, 
    testCases: {
        type : [String],
        validate: {
            validator: function(tests){
                if(tests && Array.isArray(tests) && tests.length >= 1){
                    return true;
                }
                return false;
            },
            message: "TestCases should be an array of strings of size at least 1"
        }
    }
});


module.exports.validateTestSet = validateTestSet;