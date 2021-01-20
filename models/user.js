const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 10,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    status: ["admin", "student", "content_creator"]
  },
  /*
  adding the user relationships 

  blogs:[{type:mongoose.ObjectID,ref:"blog"}],
  bookmarkedBlogs:[{type:mongoose.ObjectID,ref:"blog"}],

  solvedProblems:[{type:mongoose.ObjectID,ref:"Problem"}],
  bookmarkedProblems:[{type:mongoose.ObjectID,ref:"Problem"}],

  codes:[{type:mongoose.ObjectID,ref:"Code"}],
  */
}, {timestamps: true}));

function validateUser(user) {
  const schema = {
    username: Joi.string().min(5).max(10).required(),
    password: Joi.string().min(8).max(20).required().regex(/^[\w]{8,20}$/),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    role: Joi.string().required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;