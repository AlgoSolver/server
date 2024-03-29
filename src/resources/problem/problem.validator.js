const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const joiTestSetSchema = Joi.object({
  constraints: Joi.string().required(),
  expectedComplexity: Joi.string(),
  testCases: Joi.array().items(Joi.string()).min(1).required(),
});

exports.validateTestSet = (testSet) => {
  const schema = joiTestSetSchema;
  const { error } = schema.validate(testSet);
  return error;
};

exports.validateProblem = (problem) => {
  let schema;
  if (typeof problem === "object" && problem.isPublished === true) {
    schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      author: Joi.objectId().required(),
      timeLimit: Joi.number().min(0.5).max(10),
      memoryLimit: Joi.number()
        .min(1024 * 16)
        .max(1024 * 1024),
      editorial: Joi.string(),
      testSets: Joi.array().items(joiTestSetSchema).min(1).required(),
      isPublished: Joi.boolean().required(),
      modelAnswer: Joi.string().required(),
      checker: Joi.string().required(),
      validator: Joi.string().required(),
    });
  } else {
    schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      author: Joi.objectId().required(),
      timeLimit: Joi.number().min(0.5).max(10),
      memoryLimit: Joi.number()
        .min(1024 * 16)
        .max(1024 * 1024),
      editorial: Joi.string(),
      testSets: Joi.array().items(joiTestSetSchema).min(1),
      isPublished: Joi.boolean(),
      modelAnswer: Joi.string(),
      checker: Joi.string(),
      validator: Joi.string(),
    });
  }
  const { error } = schema.validate(problem);
  return error;
};

exports.validateProblemItems = (problem) => {
  // same as previous except nothing is required to make it easier to update problems
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    author: Joi.objectId(),
    timeLimit: Joi.number().min(0.5).max(10),
    memoryLimit: Joi.number()
      .min(1024 * 16)
      .max(1024 * 1024),
    editorial: Joi.string(),
    testSets: Joi.array().items(joiTestSetSchema).min(1),
    isPublished: Joi.boolean(),
    modelAnswer: Joi.string(),
    checker: Joi.string(),
    validator: Joi.string(),
  });
  const { error } = schema.validate(problem);
  return error;
};
