const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require('mongoose');

const Code = new mongoose.model('Code', new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceCode: {
    type : String, // to store our source code
    required : true
  },
  language: {
    type: String,
    required: true
  },
}, {timestamps: true}));

function validateCode(code) {
  const schema = Joi.object({
    author: Joi.objectId().required(),
    sourceCode : Joi.string().required(),
    language : Joi.string().required().equal("C++")
  });

  return schema.validate(code);
}

const {error} = validateCode({
  author : "123456789012123456789012",
  sourceCode : "Cout << \" Hello World \" << endl;\n",
  language : "C++"

});
console.log("validation error => ", error);

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