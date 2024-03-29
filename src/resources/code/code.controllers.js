const Code = require("./code.model");
const User = require("../user/user.model")
const getPagination = require("../../utils/getPagination");
exports.codes = async (req, res) => {
  const {username} = req.params;
  const limit = +(req.query.limit) || 10 ;
  let codes;
  let user;
  try{
    user = await User.findOne({username});
  }catch(err){
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  if(!user){
     return res.status(400).send({ message: "no user found for this username ..." });
  }
  try {
    codes = await Code.paginate(
      {
        author:user._id,
      },
      { 
        sort: {
          updatedAt: -1,
        },
        ...getPagination(parseInt(req.query.page) - 1, limit),
      }
    );
  } catch (err) {
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  return res.json(codes);
};
exports.code = async (req, res) => {
  const { id } = req.params;
  let code;
  try {
    code = await Code.findById(id);
  } catch (err) {
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  if (!code) {
    return res.status(400).send({ message: "no playground with this id ..." });
  }
  return res.json(code);
};
exports.createCode = async (req, res) => {
  const { name } = req.body;
  let code = new Code({ name, author: req.auth._id });
  if (req.body.code) {
    code.code = req.body.code;
  }
  try {
    await code.save();
  } catch (err) {
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  return res.json(code);
};
exports.updateCode = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  let code;
  try {
    code = await Code.findById(id);
  } catch (err) {
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  if (!code) {
    return res.status(400).send({ message: "no playground with this id ..." });
  }
  if (code.author?.toString() != req.auth._id) {
    return res.status(400).send({ message: "Unauthrized" });
  }
  try {
    if (data.name) code.name = data.name;
    if (data.code) code.code = data.code;
    await code.save();
  } catch (err) {
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  return res.status(201).json(code);
};
exports.deleteCode = async (req, res) => {
  const { id } = req.params;
  let code;
  try {
    code = await Code.findById(id);
  } catch (err) {
    return code.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  if (!code) {
    return res.status(400).send({ message: "no playground with this id ..." });
  }
  if (code.author?.toString() != req.auth._id) {
    return res.status(400).send({ message: "Unauthrized" });
  }
  try {
    await code.remove();
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message:
        "Sorry we are facing an internal error please try again later ...",
    });
  }
  return res.json({ id });
};
