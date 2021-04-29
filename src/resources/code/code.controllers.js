const Code = require('./code.model');
const getPagination = require('../../utils/getPagination');
exports.codes = async (req,res)=>{
  console.log(req.query)
  let codes;
  try{
    codes = await Code.paginate({
      author:req.auth._id
    },{
      sort:{
        updatedAt:-1
      },
      ...getPagination(parseInt(req.query.page)-1,10)
    });
  }catch(err){
    return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
  }
  return res.json(codes)
}
exports.code = async (req,res)=>{
  const {id} = req.params;
  let code;
  try{
    code = await Code.findById(id);
  }catch(err){
    return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
  }
  if(!code){
    return res.status(400).send({message : "no playground with this id ..."})
  }
  return res.json(code);
}
exports.createCode = async (req,res)=>{
  const {name} = req.body;
  let code = new Code({name,author:req.auth._id});
  try{
    await code.save();
  }catch(err){
    return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
  }
  return res.json(code);
}
exports.updateCode = async (req,res)=>{
  const {id} = req.params;
  const {name} = req.body;
  let code;
  try{
    code = await Code.findById(id);
  }catch(err){
    return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
  }
  if(!code){
    return res.status(400).send({message : "no playground with this id ..."})
  }
  if(code._id !== req.auth._id){
    return res.status(400).send({message : "Unauthrized"})
  }
  try{
     code.name = name;
     await code.save();
  }catch(err){
    return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
  }
  return res.status(201).json(code);
}
exports.deleteCode = async (req,res)=>{
  const {id} = req.params;
  let code;
  try{
    code = await Code.findById(id);
  }catch(err){
    return code.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
  }
  if(!code){
    return res.status(400).send({message : "no playground with this id ..."})
  }
  if(code.author?.toString() != req.auth._id){
    return res.status(400).send({message : "Unauthrized"})
  }
  try{
    await code.remove();
  }catch(err){
    console.log(err)
    return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
  }
  return res.json({id})
}
