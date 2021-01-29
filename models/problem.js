const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const User = require("./user.js");
const Code = require("./code");


mongoose.connect("mongodb://localhost/playground")// only here for testing will be removed and implemented at index.js
    .then(() => console.log("Connected Successfully..."))
    .catch((err) => console.error(err));

const joiTestSetSchema = Joi.object({
    constraints: Joi.string().required(),
    expectedComplexity: Joi.string(),
    testCases : Joi.array().items(Joi.string()).min(1).required()
});

function validateTestSet(testSet){
    const schema = joiTestSetSchema;
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

const ObjectId = mongoose.Schema.Types.ObjectId;

function validateProblem(problem) {
    let schema;
    if(typeof problem === "object" && problem.isPublished === true){
        schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(), 
            author : Joi.objectId().required(),
            timeLimit: Joi.number().min(.5).max(10),
            memoryLimit: Joi.number().min(1024 * 16).max(1024*1024),
            editorial: Joi.string(),
            testSets : Joi.array().items(joiTestSetSchema).min(1).required(),
            isPublished: Joi.boolean().required(),
            modelAnswer : Joi.objectId().required(),
            checker : Joi.objectId().required(),
            validator : Joi.objectId().required()
        });
    }
    else{
        schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(), 
            author : Joi.objectId().required(),
            timeLimit: Joi.number().min(.5).max(10),
            memoryLimit: Joi.number().min(1024 * 16).max(1024*1024),
            editorial: Joi.string(),
            testSets : Joi.array().items(joiTestSetSchema).min(1),
            isPublished: Joi.boolean(),
            modelAnswer : Joi.objectId(),
            checker : Joi.objectId(),
            validator : Joi.objectId()
        });
    }
    const {error} = schema.validate(problem);
    return error;
}

// const result = validateProblem({ // test alidation
//     author: "60134b88faf27c146876ba57",
//     title: "Sorting", 
//     description: "Sort the given array of numbers",
//     isPublished: false,
//     testSets : [{expectedComplexity: "O(N)", constraints: "1 <= N <= 1e6", testCases: ["123", "234"]}],
//     modelAnswer: "6013ffd59149bc216d5818ae",
//     validator: "6013ffd59149bc216d5818ae", 
//     checker: "6013ffd59149bc216d5818ae"
// });

// console.log("result :", result);

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    timeLimit: {
        type: Number,
        default: 1,
        min: .5,
        max: 10,
        required: true
    },
    memoryLimit: {
        type: Number,
        default: 1024*256, //256 MB
        min: 1024* 16, 
        max: 1024*1024,// maximum memory is 1GB
        required: true
    },
    editorial: {// should be required to publish problem? not sure
        type: String
    },
    testSets: {
        type: [testSetSchema],
        required: true,
        validate: {
            validator: function (tests) {
                if( this.isPublished && (!tests || !Array.isArray(tests) || tests.length == 0))
                    return false;
                return true;// can be empty if not published
            },
            message: "testSets should be an array of testsets with at least one valid testSet"
        }
    },
    isPublished : {
        type : Boolean,
        default: false,
        validate:{
            validator: function(value){
                if(!value)
                    return true;
                if(!this.modelAnswer || !this.checker || !this.validator || !this.testSets || !Array.isArray(this.testSets) || this.testSets.length == 0)
                    return false;
                return true;
            },
            message: "All problem data should be completed before publishing"// replace with proper function in the future
        }
        // also when play ground is hosted we should add validation that checker, code are correct.
    },
    modelAnswer: {// should be required before publishing problem
        type: ObjectId, 
        ref: "Code",
        required: function () {// if is published then code should be required
            return this.isPublished;
        }
    },
    checker: {// should be required before publishing problem
        type: ObjectId, 
        ref: "Code",
        required: function () {// if is published then code should be required
            return this.isPublished;
        }
    },
    validator: {// should be required before publishing problem
        type: ObjectId, 
        ref: "Code",
        required: function () {// if is published then code should be required
            return this.isPublished;
        }
    }
    
});

const Problem = new mongoose.model("Problem", problemSchema);




async function createProblem(problem){
    try{
        problem = new Problem(problem);
        const res = await problem.save();
        return res;        
    }
    catch(err){
        throw err;
    }
}

// createProblem({// example of creating problemm
//     author: "60134b88faf27c146876ba57",
//     title: "Sorting", 
//     description: "Sort the given array of numbers",
//     isPublished: false,
//     testSets : [{expectedComplexity: "O(N)", constraints: "1 <= N <= 1e6", testCases: ["123", "234"]}],
//     modelAnswer: "6013ffd59149bc216d5818ae",
//     validator: "6013ffd59149bc216d5818ae", 
//     checker: "6013ffd59149bc216d5818ae"
// });

async function updateProblem(id, updated) {// this object should contain the items to update
   try{ 
        const problem = await Problem.findById(id);
        if(!problem){
            return false;
        }
        for(let item in updated){
            problem[item] = updated[item];
        }
        const res = await problem.save();
        return res;
    }
    catch(err){
        throw err;
    }
}


// updateProblem("60140a7d1af8fd245ec599ea", {
//     title: "New Problem Title :)"
// })
//     .then((problem) => console.log("Updated problem :", problem))
//     .catch(err => console.error(err));


async function getProblems() {
    try{
        const res = await Problem.find().populate("modelAnswer").populate("checker").populate("validator");
        return res;
    }
    catch(err){
        throw err;
    }
}

// getProblems()
//     .then((problems) => console.log(problems))
//     .catch((err) => console.error(err));


module.exports.validateTestSet = validateTestSet;
module.exports.Problem = Problem;
module.exports.createProblem = createProblem;
module.exports.getProblems = getProblems;
module.exports.updateProblem = updateProblem;
module.exports.validateProblem = validateProblem;