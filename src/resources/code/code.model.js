const { Schema, model, Types } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const codeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: `#include <iostream>;
using namespace std;
int main(){
  cout<<"Hello, AlgoSolver!"<<endl;
  return 0;
}`,
    },
    language: {
      type: String,
      default: "C++",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

codeSchema.plugin(mongoosePaginate);

module.exports = model("Playground", codeSchema);
