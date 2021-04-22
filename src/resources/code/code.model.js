const {Schema,model,Types} = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");


const codeSchema = new Schema({
  name:{
    type:String
  },
  sourceCode:{
    type:String,
    default:`#include <iostream>;
    using namespace std;
    int main(){
    }`
  },
  language: {
    type: String,
    default:'C++',
  },
  author:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  }
},{timestamps:true})

codeSchema.plugin(mongoosePaginate)

module.exports = model('Code',codeSchema)
