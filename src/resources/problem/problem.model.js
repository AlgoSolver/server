const mongoose = require("mongoose");

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

// handling pagination -- IG
problemSchema.plugin(mongoosePaginate);

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;