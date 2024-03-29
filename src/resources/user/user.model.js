const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      imgURL:{
        type:String,
      },
        role: {
        type: String,
        status: ["ADMIN", "STUDENT", "CONTENT_CREATOR"],
        default: "STUDENT",
      },
      resetPasswordLink: {
        type: String,
        default: "",
      },
      //adding the user relationships
      //   blogs:[{
      //     type:mongoose.ObjectID,ref:"blog"
      //   }],
      //   bookmarkedBlogs:[{
      //     type:mongoose.ObjectID,ref:"blog"
      //   }],
      //
      //   bookmarkedBlogs:[{
      //     type:mongoose.ObjectID,ref:"blog"
      //   }],
      //
      //   solvedProblems:[{
      //     type:mongoose.ObjectID,ref:"problem"
      //   }],
      //   bookmarkedProblems:[{
      //     type:mongoose.ObjectID,ref:"problem"
      //   }],
      //   codes:[{
      //       type:mongoose.ObjectID,ref:"code"
      //     }],
      // }, {timestamps: true}
      // })
      // );
      //
      //   codes:[{
      //       type:mongoose.ObjectID,ref:"code"
      //     }],
    },
    { timestamps: true }
  )
);
module.exports = User;
