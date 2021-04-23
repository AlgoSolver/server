const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require('mongoose');

const Code = require('../resources/code/code.model');
function validateCode(code) {
  console.log("called validate code");
  const schema = Joi.object({
    author: Joi.objectId().required(),
    sourceCode : Joi.string().required(),
    language : Joi.string().required().equal("C++")
  });
  console.log("Will apply validate schema");

  return schema.validate(code);
}

async function createCode(code){
  code = Code(code);
  const result = await code.save();
  return result;
};

// createCode({
//   author : "60158b8029b9b6160c5f078b",
//   sourceCode: "#include<bits/stdc++.h>\n\nusing namespace std;\n\nint main(){\n cout << \"hello World\" << endl;\n  return 0;\n}\n",
//   language : "C++"
// }).then(code => console.log("Code :", code))
//   .catch(err => console.error(err));

// async function printCodes() {
//   const codes = await Code.find();
//   console.log("Codes => ", codes);
// }
// printCodes();

exports.Code = Code;
exports.validate = validateCode;
exports.createCode = createCode;
